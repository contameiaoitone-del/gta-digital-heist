// Polling do front para pedidos Xpag: reconsulta a cobrança na API e confirma o pedido (ver xpag-order.ts).
// POST { order_id } -> { status: "paid" | <status>, expired }.  POST { action: "simulate", order_id }: só sandbox + token de dev.
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { devAllowed } from "../_shared/geo.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";
import { loadXpagCreds, xpagFetch } from "../_shared/xpag.ts";
import { reconcileXpagOrder } from "../_shared/xpag-order.ts";

const cors = { ...corsHeaders, "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-geo-dev-token` };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);
  try {
    const { order_id, action } = await req.json().catch(() => ({}));
    if (typeof order_id !== "string" || !UUID.test(order_id)) return jsonResponse({ error: "missing_order_id" }, 400);
    const svc = serviceClient();

    if (action === "simulate") {
      if (!devAllowed(req)) return jsonResponse({ error: "forbidden" }, 403);
      const { data: o } = await svc.from("orders").select("raw").eq("id", order_id).maybeSingle();
      if (!o?.raw?.sandbox || !o.raw?.xpag?.transaction_id) return jsonResponse({ error: "not_found" }, 404);
      const sim = await xpagFetch(loadXpagCreds(true)!, "/sandbox/simulate", { method: "POST", body: JSON.stringify({ transaction_id: o.raw.xpag.transaction_id, status: "paid" }) });
      return jsonResponse({ ok: sim.ok, webhook: sim.data?.webhook ? { delivered: !!sim.data.webhook.delivered, http_status: sim.data.webhook.http_status ?? null } : null });
    }

    const { data: order } = await svc.from("orders").select("id, status, pix_gateway").eq("id", order_id).maybeSingle();
    if (!order) return jsonResponse({ error: "not_found" }, 404);
    if (order.status === "paid") return jsonResponse({ order_id, status: "paid", expired: false });
    if (order.pix_gateway !== "xpag") return jsonResponse({ order_id, status: order.status, expired: false });
    const r = await reconcileXpagOrder(svc, order_id);
    return jsonResponse({ order_id, status: r.paid ? "paid" : "pending", expired: r.expired });
  } catch (e) {
    console.error("gta-xpag-check", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
