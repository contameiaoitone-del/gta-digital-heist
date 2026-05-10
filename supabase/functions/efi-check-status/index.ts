import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import {
  corsHeaders,
  jsonResponse,
  getMtlsClient,
  getPixAccessToken,
  PIX_HOST,
} from "../_shared/efi.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const { order_id } = await req.json();
    if (!order_id || typeof order_id !== "string") {
      return jsonResponse({ error: "missing_order_id" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, payment_method, efi_txid")
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

    // Pix: consult Efí in real time so we don't depend on the webhook.
    if (order.payment_method === "pix" && order.efi_txid) {
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

    return jsonResponse({
      order_id: order.id,
      status: order.status,
      payment_method: order.payment_method,
    });
  } catch (e) {
    console.error("efi-check-status error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
