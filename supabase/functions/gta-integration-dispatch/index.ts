// Fires the outbound "purchase confirmed" webhook for every active integration
// subscribed to the `purchase` event whose optional product/route filter
// matches the order. Invoked fire-and-forget from every path that confirms a
// payment (efi-reconcile-pix, zzgate-webhook, efi-webhook, and the two
// status-poll endpoints), mirroring how those already invoke meta-capi /
// tiktok-events / grant-member-access.
//
// Idempotent: the first thing done for each integration is an upsert into
// integration_deliveries on the (integration_id, order_id, event) unique key
// with ignoreDuplicates — if that row already exists (already delivered, or
// being delivered by a concurrent call), we skip the POST entirely. Safe to
// invoke repeatedly (retries, the reconciliation cron re-running, or more
// than one confirm-path racing on the same order).
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

// The apikey/Authorization JWT pasted from these external docs routinely
// carries a literal TAB (and sometimes quotes/"Bearer ") before the token —
// a JWT itself never contains whitespace, so stripping all \s is safe.
function cleanJwt(raw?: string | null): string {
  if (!raw) return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  s = s.replace(/^bearer\s+/i, "");
  return s.replace(/\s+/g, "");
}
function cleanSecret(raw?: string | null): string {
  return (raw ?? "").replace(/\s+/g, "");
}

interface IntegrationRow {
  id: string;
  name: string;
  target_url: string;
  secret: string | null;
  api_key: string | null;
  events: string[];
  product: string | null;
  active: boolean;
}

// Cross-project edge-function calls occasionally eat a slow cold start (seen
// in testing: a follow-up call to the same URL completed in <1s after a first
// call aborted at 10s), so the timeout is generous and network-level failures
// (not application 4xx/5xx) get one retry. The destination is expected to be
// idempotent on `event_id` (the DOC's own contract says so), so a safe retry.
const FETCH_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 2;

async function postWithRetry(
  url: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<{ status: number | null; respJson: unknown; errText: string | null }> {
  let status: number | null = null;
  let respJson: unknown = null;
  let errText: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
      status = r.status;
      const text = await r.text();
      try {
        respJson = JSON.parse(text);
      } catch {
        respJson = { raw: text };
      }
      errText = r.ok ? null : `http_${r.status}`;
      return { status, respJson, errText }; // got a real HTTP response — don't retry on 4xx/5xx
    } catch (e) {
      errText = String(e);
      status = null;
      respJson = null;
      // network/timeout failure only — retry once before giving up
    } finally {
      clearTimeout(timer);
    }
  }
  return { status, respJson, errText };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  const { order_id, retry_delivery_id } = await req.json().catch(() => ({}));
  const svc = serviceClient();

  // Manual retry path (used by the admin "Reenviar" button, gated by the
  // `integrations` admin function): re-POST for one specific already-claimed
  // delivery row, reusing its stored request_body — no new idempotency claim
  // needed since the row already exists and belongs to this one attempt.
  if (retry_delivery_id && typeof retry_delivery_id === "string") {
    const { data: delivery } = await svc
      .from("integration_deliveries")
      .select("id, integration_id, request_body")
      .eq("id", retry_delivery_id)
      .maybeSingle();
    if (!delivery) return jsonResponse({ error: "delivery_not_found" }, 404);
    const { data: integration } = await svc
      .from("integrations")
      .select("id, target_url, secret, api_key")
      .eq("id", delivery.integration_id)
      .maybeSingle();
    if (!integration) return jsonResponse({ error: "integration_not_found" }, 404);

    const jwt = cleanJwt(integration.api_key);
    const secret = cleanSecret(integration.secret);
    const { status, respJson, errText } = await postWithRetry(
      integration.target_url,
      { "Content-Type": "application/json", apikey: jwt, Authorization: `Bearer ${jwt}`, "x-webhook-secret": secret },
      delivery.request_body,
    );
    const magicLink = (respJson as { magic_link?: string } | null)?.magic_link ?? null;
    await svc
      .from("integration_deliveries")
      .update({ response_status: status, response_body: respJson, magic_link: magicLink, error: errText })
      .eq("id", delivery.id);
    return jsonResponse({ ok: true, retried: true, status, error: errText });
  }

  if (!order_id || typeof order_id !== "string") return jsonResponse({ error: "missing_order_id" }, 400);

  const { data: order } = await svc
    .from("orders")
    .select("id, status, customer_email, customer_name, customer_phone, amount_cents, product")
    .eq("id", order_id)
    .maybeSingle();
  if (!order) return jsonResponse({ error: "order_not_found" }, 404);
  if (order.status !== "paid") return jsonResponse({ ok: true, skipped: "not_paid" }, 200);

  const { data: integrations } = await svc
    .from("integrations")
    .select("id, name, target_url, secret, api_key, events, product, active")
    .eq("active", true)
    .contains("events", ["purchase"]);

  const targets = ((integrations as IntegrationRow[]) || []).filter(
    (it) => !it.product || it.product === order.product,
  );
  if (targets.length === 0) return jsonResponse({ ok: true, dispatched: 0 }, 200);

  const body = {
    email: order.customer_email,
    name: order.customer_name || undefined,
    event_id: order.id, // stable, unique per sale — external idempotency key
    phone: order.customer_phone || undefined,
    amount: order.amount_cents ?? 0, // cents; deliberately no `product` field
  };

  let dispatched = 0;
  for (const it of targets) {
    // Claim first: INSERT ... ON CONFLICT DO NOTHING. If the row already
    // exists (already delivered, or a concurrent invocation claimed it),
    // `claim` comes back null and we skip — no second POST for this sale.
    const { data: claim } = await svc
      .from("integration_deliveries")
      .upsert(
        { integration_id: it.id, order_id: order.id, event: "purchase", request_body: body },
        { onConflict: "integration_id,order_id,event", ignoreDuplicates: true },
      )
      .select("id")
      .maybeSingle();
    if (!claim) continue;

    const jwt = cleanJwt(it.api_key);
    const secret = cleanSecret(it.secret);
    const { status, respJson, errText } = await postWithRetry(
      it.target_url,
      { "Content-Type": "application/json", apikey: jwt, Authorization: `Bearer ${jwt}`, "x-webhook-secret": secret },
      body,
    );
    const magicLink = (respJson as { magic_link?: string } | null)?.magic_link ?? null;

    try {
      await svc
        .from("integration_deliveries")
        .update({ response_status: status, response_body: respJson, magic_link: magicLink, error: errText })
        .eq("id", claim.id);
    } catch (e) {
      console.error("integration-dispatch: failed to record delivery outcome", it.id, e);
    }
    dispatched++;
  }

  return jsonResponse({ ok: true, dispatched }, 200);
});
