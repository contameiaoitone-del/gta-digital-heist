// Routes Pix creation between Efí and ZZGate based on payment_settings.
// Mirrors efi-create-pix output shape so the frontend doesn't need to change.
import { z } from "https://esm.sh/zod@3.23.8";
import {
  corsHeaders,
  jsonResponse,
  rateLimit,
  getIp,
  isValidCpf,
  getMtlsClient,
  getPixAccessToken,
  PIX_HOST,
  getProduct,
  getEfiPixKey,
} from "../_shared/efi.ts";
import {
  loadPaymentSettings,
  serviceClient,
  createZzgatePix,
  getZzgateWebhookUrl,
} from "../_shared/pix-gateway.ts";

const BodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  cpf: z.string().trim().min(11).max(20),
  session_id: z.string().trim().min(1).max(80).optional(),
  event_id_purchase: z.string().trim().min(1).max(80).optional(),
  product: z.enum(["treinamento", "lp2"]).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const ip = getIp(req);
    if (!rateLimit(ip)) return jsonResponse({ error: "rate_limited" }, 429);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
    const { name, email, phone, cpf, session_id, event_id_purchase, product: productKey } = parsed.data;
    const product = getProduct(productKey);
    const purchaseEventId = event_id_purchase || crypto.randomUUID();
    const cleanCpf = cpf.replace(/\D/g, "");
    if (!isValidCpf(cleanCpf)) return jsonResponse({ error: "invalid_cpf" }, 400);

    const settings = await loadPaymentSettings();
    const supabase = serviceClient();
    const reais = product.amount_cents / 100;

    if (settings.active_pix_gateway === "zzgate") {
      if (!settings.zzgate_client_id || !settings.zzgate_client_secret) {
        return jsonResponse({ error: "zzgate_not_configured" }, 500);
      }

      // Insert order first to get id (used as external_id)
      const { data: order, error: dbErr } = await supabase
        .from("orders")
        .insert({
          product: product.key,
          amount_cents: product.amount_cents,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          customer_cpf: cleanCpf,
          payment_method: "pix",
          status: "pending",
          session_id: session_id ?? null,
          event_id_purchase: purchaseEventId,
          pix_gateway: "zzgate",
        })
        .select("id")
        .single();
      if (dbErr || !order) {
        console.error("db insert failed", dbErr);
        return jsonResponse({ error: "db" }, 500);
      }

      try {
        const result = await createZzgatePix({
          clientId: settings.zzgate_client_id,
          clientSecret: settings.zzgate_client_secret,
          amountReais: reais,
          externalId: order.id,
          postbackUrl: getZzgateWebhookUrl(),
          payerName: name,
          payerCpf: cleanCpf,
          payerEmail: email,
          description: product.name,
        });
        await supabase
          .from("orders")
          .update({ gateway_txid: result.transactionId, raw: { zzgate: result.raw } })
          .eq("id", order.id);

        return jsonResponse({
          order_id: order.id,
          txid: result.transactionId,
          copia_cola: result.qrcode,
          qrcode_image: "", // ZZGate doesn't return image; frontend renders QR from copia_cola
          expires_in: 3600,
          event_id_purchase: purchaseEventId,
          amount_cents: product.amount_cents,
        });
      } catch (e) {
        console.error("zzgate create failed", e);
        // remove the orphan order
        await supabase.from("orders").delete().eq("id", order.id);
        return jsonResponse({ error: "zzgate_failed", detail: String(e) }, 502);
      }
    }

    // ---------- EFÍ (default) — same logic as efi-create-pix ----------
    const pixKey = await getEfiPixKey();
    if (!pixKey) return jsonResponse({ error: "pix_key_missing" }, 500);
    const token = await getPixAccessToken();
    const reaisStr = reais.toFixed(2);

    const cobRes = await fetch(`${PIX_HOST}/v2/cob`, {
      method: "POST",
      // @ts-ignore deno client
      client: await getMtlsClient(),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        calendario: { expiracao: 3600 },
        devedor: { cpf: cleanCpf, nome: name },
        valor: { original: reaisStr },
        chave: pixKey,
        solicitacaoPagador: product.name,
      }),
    });
    const cob = await cobRes.json();
    if (!cobRes.ok) {
      console.error("cob create failed", cob);
      return jsonResponse({ error: "efi_cob", detail: cob }, 502);
    }

    const qrRes = await fetch(`${PIX_HOST}/v2/loc/${cob.loc.id}/qrcode`, {
      method: "GET",
      // @ts-ignore deno client
      client: await getMtlsClient(),
      headers: { Authorization: `Bearer ${token}` },
    });
    const qr = await qrRes.json();
    if (!qrRes.ok) {
      console.error("qr fetch failed", qr);
      return jsonResponse({ error: "efi_qr", detail: qr }, 502);
    }

    const { data: order, error: dbErr } = await supabase
      .from("orders")
      .insert({
        product: product.key,
        amount_cents: product.amount_cents,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_cpf: cleanCpf,
        payment_method: "pix",
        efi_txid: cob.txid,
        gateway_txid: cob.txid,
        pix_gateway: "efi",
        status: "pending",
        session_id: session_id ?? null,
        event_id_purchase: purchaseEventId,
        raw: { cob, loc: cob.loc },
      })
      .select("id")
      .single();
    if (dbErr) {
      console.error("db insert failed", dbErr);
      return jsonResponse({ error: "db" }, 500);
    }

    return jsonResponse({
      order_id: order.id,
      txid: cob.txid,
      copia_cola: qr.qrcode,
      qrcode_image: qr.imagemQrcode,
      expires_in: 3600,
      event_id_purchase: purchaseEventId,
      amount_cents: product.amount_cents,
    });
  } catch (e) {
    console.error("pix-create error", e);
    if (e instanceof Error && e.name === "EfiOAuthError") {
      return jsonResponse({ error: "efi_invalid_credentials" }, 502);
    }
    return jsonResponse({ error: "internal" }, 500);
  }
});