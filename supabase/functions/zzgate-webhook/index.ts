// ZZGate Pix webhook. Mirrors efi-webhook side effects exactly so tracking
// (Meta CAPI, TikTok CAPI) and member access provisioning are identical.
//
// Hardening (2026-06): ZZGate only notifies payment via this postback — it has
// NO transaction-status query API, so a dropped postback = a permanently lost
// sale (order stuck `pending`, no access, no Purchase). To make delivery
// bullet-proof we now:
//   1. Persist the raw postback to `gateway_webhook_log` BEFORE doing anything,
//      so the event is never lost even if processing fails (it can be replayed).
//   2. Ack `200` immediately, then run the heavy side-effects (Meta/TikTok/
//      grant-access) in the background via EdgeRuntime.waitUntil — so a slow
//      processing chain can't make ZZGate time out and drop the delivery.
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

type ReceivePix = Record<string, unknown> & {
  transactionType?: string;
  external_id?: string;
  transactionId?: string;
  status?: string;
  amount?: number | string;
  dateApproval?: string;
};

// Heavy processing — runs AFTER we've already 200'd ZZGate. Marks the order
// paid (idempotently) and fires the same side-effects the order would get on a
// live confirmation. Records the outcome on the webhook log row.
async function processZzgatePostback(rb: ReceivePix, logId: string | null): Promise<void> {
  const supabase = serviceClient();
  const finish = async (result: string, error?: string) => {
    if (!logId) return;
    try {
      await supabase
        .from("gateway_webhook_log")
        .update({ processed_at: new Date().toISOString(), process_result: result, process_error: error ?? null })
        .eq("id", logId);
    } catch (e) {
      console.error("webhook log update failed", e);
    }
  };

  if (!rb || rb.transactionType !== "RECEIVEPIX") return finish("ignored_type");
  const externalId = rb.external_id;
  const transactionId = rb.transactionId;
  const status = rb.status;
  if (!externalId || status !== "PAID") return finish("ignored_status");

  // Lookup by order id (= external_id)
  const { data: existing } = await supabase
    .from("orders")
    .select("id, status, amount_cents, pix_gateway")
    .eq("id", externalId)
    .maybeSingle();
  if (!existing) {
    console.warn("zzgate webhook: order not found", externalId);
    return finish("order_not_found");
  }
  if (existing.status === "paid") return finish("already_paid");

  // Sanity check on amount (zzgate sends reais)
  const amountReais = Number(rb.amount);
  if (!Number.isFinite(amountReais) || Math.round(amountReais * 100) !== existing.amount_cents) {
    console.warn("zzgate webhook: amount mismatch", { externalId, amountReais, expected: existing.amount_cents });
    return finish("amount_mismatch", `got ${amountReais} expected ${(existing.amount_cents ?? 0) / 100}`);
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
    return finish("update_noop", error?.message);
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

  return finish("paid");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  // ZZGate: { requestBody: { transactionType, transactionId, external_id, amount, status, dateApproval } }
  const rb = ((body?.requestBody ?? body) as ReceivePix) || {};

  // 1) Persist the raw postback FIRST so it is never lost, even if the
  //    processing chain below fails. This row is the source of truth for replay.
  let logId: string | null = null;
  try {
    const supabase = serviceClient();
    const { data } = await supabase
      .from("gateway_webhook_log")
      .insert({
        gateway: "zzgate",
        event_type: rb?.transactionType ?? null,
        external_id: rb?.external_id ?? null,
        transaction_id: rb?.transactionId ?? null,
        status: rb?.status ?? null,
        raw: body,
      })
      .select("id")
      .maybeSingle();
    logId = (data as { id?: string } | null)?.id ?? null;
  } catch (e) {
    console.error("zzgate webhook log insert failed", e);
  }

  // 2) Authenticate the postback. This function runs with verify_jwt=false (so
  //    ZZGate's keyless postbacks aren't 401'd at the gateway), so we enforce a
  //    shared secret carried in the URL (?s=...) set at order creation. The raw
  //    event was already logged above, so a rejected/legacy postback is still
  //    visible in gateway_webhook_log (process_result='bad_secret') for replay.
  const expectedSecret = Deno.env.get("ZZGATE_WEBHOOK_SECRET");
  if (expectedSecret) {
    const provided = new URL(req.url).searchParams.get("s");
    if (provided !== expectedSecret) {
      console.warn("zzgate webhook: bad/missing secret", { external_id: rb?.external_id });
      if (logId) {
        try {
          await serviceClient()
            .from("gateway_webhook_log")
            .update({ processed_at: new Date().toISOString(), process_result: "bad_secret" })
            .eq("id", logId);
        } catch (e) {
          console.error("webhook log update failed", e);
        }
      }
      return jsonResponse({ error: "unauthorized" }, 401);
    }
  }

  // 3) Ack immediately; 4) do the heavy lifting in the background so the
  //    gateway never times out waiting on Meta/TikTok/grant-access.
  const work = processZzgatePostback(rb, logId).catch((e) => console.error("zzgate process error", e));
  // @ts-ignore EdgeRuntime is provided by the Supabase edge runtime
  if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
    // @ts-ignore
    EdgeRuntime.waitUntil(work);
  } else {
    await work;
  }

  return jsonResponse({ ok: true });
});
