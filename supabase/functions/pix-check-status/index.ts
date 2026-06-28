// Polls Pix order status. For Efí orders, queries the cob endpoint via mTLS.
// For ZZGate orders, returns whatever status is stored (webhook is the source of truth).
import {
  corsHeaders,
  jsonResponse,
  getMtlsClient,
  getPixAccessToken,
  PIX_HOST,
} from "../_shared/efi.ts";
import {
  serviceClient,
  loadPaymentSettings,
  getZzgateTransactionStatus,
} from "../_shared/pix-gateway.ts";

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
      .select("id, status, payment_method, efi_txid, gateway_txid, pix_gateway, product, customer_name, customer_email, customer_phone, customer_cpf, amount_cents, session_id, event_id_purchase")
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

    // ZZGate: poll the gateway as a fallback in case the webhook (postback)
    // never reached us. If paid, mark the order paid AND fire the same
    // side-effects the webhook would (Meta CAPI, TikTok CAPI, member access).
    if (order.payment_method === "pix" && gateway === "zzgate" && order.gateway_txid) {
      try {
        const settings = await loadPaymentSettings();
        if (settings.zzgate_client_id && settings.zzgate_client_secret) {
          const tx = await getZzgateTransactionStatus(
            settings.zzgate_client_id,
            settings.zzgate_client_secret,
            order.gateway_txid,
          );
          const isPaid = tx && (tx.status === "PAID" || tx.status === "APPROVED");
          if (isPaid) {
            const { data: updated } = await supabase
              .from("orders")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                raw: { zzgate_poll: tx.raw, polled_at: new Date().toISOString() },
              })
              .eq("id", order.id)
              .neq("status", "paid")
              .select("id")
              .maybeSingle();
            // Only fire side-effects if THIS call is the one that flipped the row.
            if (updated) {
              const purchaseEid = order.event_id_purchase || crypto.randomUUID();
              const contentName = order.product === "lp2" ? "Comunidade X1 no Pix" : "InfoZap";
              const capiBody = {
                event_id: purchaseEid,
                session_id: order.session_id || undefined,
                full_name: order.customer_name,
                email: order.customer_email,
                phone: order.customer_phone,
                cpf: order.customer_cpf,
                value: (order.amount_cents || 0) / 100,
                currency: "BRL",
                content_name: contentName,
                order_id: order.id,
              };
              try {
                await supabase.functions.invoke("meta-capi", { body: { ...capiBody, event_name: "Purchase" } });
              } catch (e) {
                console.error("capi purchase (zzgate poll) failed", e);
              }
              try {
                await supabase.functions.invoke("tiktok-events", { body: { ...capiBody, event_name: "CompletePayment" } });
              } catch (e) {
                console.error("tiktok purchase (zzgate poll) failed", e);
              }
              try {
                await supabase.functions.invoke("grant-member-access", { body: { order_id: order.id } });
              } catch (e) {
                console.error("grant access (zzgate poll) failed", e);
              }
            }
            return jsonResponse({
              order_id: order.id,
              status: "paid",
              payment_method: order.payment_method,
            });
          }
        }
      } catch (e) {
        console.warn("zzgate poll failed", e);
      }
    }

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