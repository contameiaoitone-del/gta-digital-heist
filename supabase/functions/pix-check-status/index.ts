// Polls Pix order status. For Efí orders, queries the cob endpoint via mTLS.
// For ZZGate orders, returns whatever status is stored (webhook is the source of truth).
import {
  corsHeaders,
  jsonResponse,
  getMtlsClient,
  getPixAccessToken,
  PIX_HOST,
} from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const { order_id } = await req.json();
    if (!order_id || typeof order_id !== "string") {
      return jsonResponse({ error: "missing_order_id" }, 400);
    }
    const supabase = serviceClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, payment_method, efi_txid, gateway_txid, pix_gateway")
      .eq("id", order_id)
      .maybeSingle();
    if (error || !order) return jsonResponse({ error: "not_found" }, 404);

    if (order.status === "paid") {
      return jsonResponse({
        order_id: order.id,
        status: "paid",
        payment_method: order.payment_method,
      });
    }

    const gateway = order.pix_gateway || (order.efi_txid ? "efi" : null);

    if (order.payment_method === "pix" && gateway === "efi" && order.efi_txid) {
      try {
        const token = await getPixAccessToken();
        const res = await fetch(`${PIX_HOST}/v2/cob/${order.efi_txid}`, {
          method: "GET",
          // @ts-ignore deno mTLS client
          client: await getMtlsClient(),
          headers: { Authorization: `Bearer ${token}` },
        });
        const cob = await res.json();
        if (res.ok && cob?.status === "CONCLUIDA") {
          await supabase
            .from("orders")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              raw: { ...(cob as object), polled_at: new Date().toISOString() },
            })
            .eq("id", order.id)
            .neq("status", "paid");
          return jsonResponse({
            order_id: order.id,
            status: "paid",
            payment_method: order.payment_method,
          });
        }
      } catch (e) {
        console.warn("efi poll failed", e);
      }
    }

    // ZZGate: rely on webhook; just return current DB status.
    return jsonResponse({
      order_id: order.id,
      status: order.status,
      payment_method: order.payment_method,
    });
  } catch (e) {
    console.error("pix-check-status error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});