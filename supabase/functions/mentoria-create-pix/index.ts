// Creates a Pix charge for a mentoria module purchase.
// Auth required. Server-side validates module + price, then routes through
// Efí or ZZGate based on payment_settings.active_pix_gateway.
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
  getEfiPixKey,
} from "../_shared/efi.ts";
import {
  loadPaymentSettings,
  serviceClient,
  createZzgatePix,
  getZzgateWebhookUrl,
} from "../_shared/pix-gateway.ts";

const BodySchema = z.object({
  module_id: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  cpf: z.string().trim().min(11).max(20),
});

function parseJwtSub(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const ip = getIp(req);
    if (!rateLimit(ip)) return jsonResponse({ error: "rate_limited" }, 429);

    const userId = parseJwtSub(req.headers.get("Authorization"));
    if (!userId) return jsonResponse({ error: "unauthorized" }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
    const { module_id, name, cpf } = parsed.data;
    const cleanCpf = cpf.replace(/\D/g, "");
    if (!isValidCpf(cleanCpf)) return jsonResponse({ error: "invalid_cpf" }, 400);

    const supabase = serviceClient();

    // Load module + price
    const { data: mod, error: modErr } = await supabase
      .from("modules")
      .select("id, title, kind, price_cents, published")
      .eq("id", module_id)
      .maybeSingle();
    if (modErr || !mod) return jsonResponse({ error: "module_not_found" }, 404);
    if (mod.kind !== "mentoria" || !mod.price_cents || mod.price_cents <= 0) {
      return jsonResponse({ error: "module_not_purchasable" }, 400);
    }

    // Get user email from auth
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr || !userData?.user?.email) return jsonResponse({ error: "no_email" }, 400);
    const email = userData.user.email.toLowerCase();

    // If access already exists, short-circuit
    const productKey = `mentoria:${mod.id}`;
    const { data: existingAccess } = await supabase
      .from("member_access")
      .select("id")
      .eq("user_id", userId)
      .in("product", [productKey, "mentoria"])
      .eq("active", true)
      .maybeSingle();
    if (existingAccess) return jsonResponse({ error: "already_purchased" }, 409);

    const settings = await loadPaymentSettings();
    const reais = mod.price_cents / 100;
    const description = `Mentoria — ${mod.title}`.slice(0, 140);

    if (settings.active_pix_gateway === "zzgate") {
      if (!settings.zzgate_client_id || !settings.zzgate_client_secret) {
        return jsonResponse({ error: "zzgate_not_configured" }, 500);
      }
      const { data: order, error: dbErr } = await supabase
        .from("orders")
        .insert({
          product: productKey,
          amount_cents: mod.price_cents,
          customer_name: name,
          customer_email: email,
          customer_phone: "",
          customer_cpf: cleanCpf,
          payment_method: "pix",
          status: "pending",
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
          description,
        });
        await supabase
          .from("orders")
          .update({ gateway_txid: result.transactionId, raw: { zzgate: result.raw } })
          .eq("id", order.id);
        return jsonResponse({
          order_id: order.id,
          txid: result.transactionId,
          copia_cola: result.qrcode,
          qrcode_image: "",
          expires_in: 3600,
          amount_cents: mod.price_cents,
        });
      } catch (e) {
        console.error("zzgate create failed", e);
        await supabase.from("orders").delete().eq("id", order.id);
        return jsonResponse({ error: "zzgate_failed", detail: String(e) }, 502);
      }
    }

    // ---------- EFÍ ----------
    const pixKey = await getEfiPixKey();
    if (!pixKey) return jsonResponse({ error: "pix_key_missing" }, 500);
    const token = await getPixAccessToken();

    const cobRes = await fetch(`${PIX_HOST}/v2/cob`, {
      method: "POST",
      // @ts-ignore deno mTLS client
      client: await getMtlsClient(),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        calendario: { expiracao: 3600 },
        devedor: { cpf: cleanCpf, nome: name },
        valor: { original: reais.toFixed(2) },
        chave: pixKey,
        solicitacaoPagador: description,
      }),
    });
    const cob = await cobRes.json();
    if (!cobRes.ok) {
      console.error("cob create failed", cob);
      return jsonResponse({ error: "efi_cob", detail: cob }, 502);
    }
    const qrRes = await fetch(`${PIX_HOST}/v2/loc/${cob.loc.id}/qrcode`, {
      method: "GET",
      // @ts-ignore deno mTLS client
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
        product: productKey,
        amount_cents: mod.price_cents,
        customer_name: name,
        customer_email: email,
        customer_phone: "",
        customer_cpf: cleanCpf,
        payment_method: "pix",
        efi_txid: cob.txid,
        gateway_txid: cob.txid,
        pix_gateway: "efi",
        status: "pending",
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
      amount_cents: mod.price_cents,
    });
  } catch (e) {
    console.error("mentoria-create-pix error", e);
    if (e instanceof Error && e.name === "EfiOAuthError") {
      return jsonResponse({ error: "efi_invalid_credentials" }, 502);
    }
    return jsonResponse({ error: "internal" }, 500);
  }
});