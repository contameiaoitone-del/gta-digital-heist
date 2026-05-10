// ZZGate Pix webhook. Mirrors efi-webhook side effects exactly so tracking
// (Meta CAPI, TikTok CAPI) and member access provisioning are identical.
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    // ZZGate: { requestBody: { transactionType, transactionId, external_id, amount, status, dateApproval } }
    const rb = body?.requestBody ?? body;
    if (!rb || rb.transactionType !== "RECEIVEPIX") {
      return jsonResponse({ ok: true, ignored: true });
    }
    const externalId: string | undefined = rb.external_id;
    const transactionId: string | undefined = rb.transactionId;
    const status: string | undefined = rb.status;
    if (!externalId || status !== "PAID") {
      return jsonResponse({ ok: true, ignored: true });
    }

    const supabase = serviceClient();
    // Lookup by order id (= external_id)
    const { data: existing } = await supabase
      .from("orders")
      .select("id, status, amount_cents, pix_gateway")
      .eq("id", externalId)
      .maybeSingle();
    if (!existing) {
      console.warn("zzgate webhook: order not found", externalId);
      return jsonResponse({ ok: true, ignored: true });
    }
    if (existing.status === "paid") return jsonResponse({ ok: true, already_paid: true });

    // Sanity check on amount (zzgate sends reais)
    const amountReais = Number(rb.amount);
    if (!Number.isFinite(amountReais) || Math.round(amountReais * 100) !== existing.amount_cents) {
      console.warn("zzgate webhook: amount mismatch", { externalId, amountReais, expected: existing.amount_cents });
      return jsonResponse({ error: "amount_mismatch" }, 400);
    }

    const paidAt = rb.dateApproval ? new Date(rb.dateApproval).toISOString() : new Date().toISOString();
    const { data: updated, error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        paid_at: paidAt,
        gateway_txid: transactionId ?? null,
        pix_gateway: "zzgate",
        raw: { zzgate_webhook: rb, webhook_received_at: new Date().toISOString() },
      })
      .eq("id", externalId)
      .neq("status", "paid")
      .select("id, product, customer_name, customer_email, customer_phone, customer_cpf, amount_cents, session_id, event_id_purchase")
      .maybeSingle();
    if (error || !updated) {
      console.error("zzgate webhook update failed", error);
      return jsonResponse({ ok: true, ignored: true });
    }

    const purchaseEid = updated.event_id_purchase || crypto.randomUUID();
    const contentName = updated.product === "lp2" ? "Comunidade X1 no Pix" : "InfoZap";
    const capiBody = {
      event_id: purchaseEid,
      session_id: updated.session_id || undefined,
      full_name: updated.customer_name,
      email: updated.customer_email,
      phone: updated.customer_phone,
      cpf: updated.customer_cpf,
      value: (updated.amount_cents || 0) / 100,
      currency: "BRL",
      content_name: contentName,
      order_id: updated.id,
    };

    try {
      await supabase.functions.invoke("meta-capi", { body: { ...capiBody, event_name: "Purchase" } });
    } catch (e) {
      console.error("capi purchase (zzgate) failed", e);
    }
    try {
      await supabase.functions.invoke("tiktok-events", { body: { ...capiBody, event_name: "CompletePayment" } });
    } catch (e) {
      console.error("tiktok purchase (zzgate) failed", e);
    }
    try {
      await supabase.functions.invoke("grant-member-access", { body: { order_id: updated.id } });
    } catch (e) {
      console.error("grant access (zzgate) failed", e);
    }

    return jsonResponse({ ok: true });
  } catch (e) {
    console.error("zzgate-webhook error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});