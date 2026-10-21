// Confirmação de pedidos Xpag do funil. Usada por gta-xpag-check (polling) e gta-xpag-webhook.
// NUNCA confia no corpo do webhook nem no front: consulta a cobrança na API da Xpag e só marca pago se
// status=confirmed, mesma moeda e mesmo valor da cobrança criada para ESTE pedido. Na transição
// pending->paid (1x por venda) dispara os mesmos efeitos do Pix: Meta CAPI, TikTok e o webhook de acesso
// (pedidos de sandbox não disparam nenhum deles).
import { getPageSource, getProduct } from "./efi.ts";
import type { serviceClient } from "./pix-gateway.ts";
import { capiCurrency } from "./xpag-offer.ts";
import { loadXpagCreds, xpagFetch } from "./xpag.ts";

type Svc = ReturnType<typeof serviceClient>;

export async function reconcileXpagOrder(svc: Svc, orderId: string): Promise<{ paid: boolean; expired: boolean }> {
  const { data: order } = await svc.from("orders")
    .select("id, status, product, customer_name, customer_email, customer_phone, currency, session_id, event_id_purchase, pix_gateway, raw")
    .eq("id", orderId).maybeSingle();
  if (!order) return { paid: false, expired: false };
  if (order.status === "paid") return { paid: true, expired: false };

  const x = order.raw?.xpag;
  if (order.pix_gateway !== "xpag" || !x?.transaction_id) return { paid: false, expired: false };
  const expired = !!x.expires_at && Date.parse(x.expires_at) < Date.now();

  const creds = loadXpagCreds(!!order.raw.sandbox);
  if (!creds) return { paid: false, expired };
  const r = await xpagFetch(creds, `/consult-transaction?transaction_id=${encodeURIComponent(x.transaction_id)}`);
  const d = r.data;
  if (!r.ok || d?.status !== "confirmed") return { paid: false, expired };
  if (String(d.transaction_id) !== String(x.transaction_id)) return { paid: false, expired };
  if (d.external_id && String(d.external_id) !== order.id) return { paid: false, expired };
  if (String(d.currency) !== String(x.currency)) return { paid: false, expired };
  if (Math.abs(Number(d.amount) - Number(x.amount)) > 1e-6) return { paid: false, expired };

  const { data: marked } = await svc.from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), raw: { ...order.raw, xpag_confirmed: { at: new Date().toISOString(), amount: d.amount, currency: d.currency } } })
    .eq("id", order.id).neq("status", "paid").select("id");
  if (!marked?.length) return { paid: true, expired: false }; // outro caminho já confirmou e já disparou os efeitos

  const capiBody = {
    event_id: order.event_id_purchase || crypto.randomUUID(),
    session_id: order.session_id || undefined,
    full_name: order.customer_name, email: order.customer_email, phone: order.customer_phone,
    value: x.price, currency: capiCurrency(order.currency),
    content_name: getProduct(order.product).name, order_id: order.id, page_source: getPageSource(order.product),
  };
  // Pedido de teste (sandbox): nada de Meta/TikTok, nem webhook de acesso/notificação (sem usuário, e-mail ou push reais).
  if (!order.raw.sandbox) {
    try { await svc.functions.invoke("gta-meta-capi", { body: { ...capiBody, event_name: "Purchase" } }); } catch (e) { console.error("xpag capi", e); }
    try { await svc.functions.invoke("gta-tiktok-events", { body: { ...capiBody, event_name: "CompletePayment" } }); } catch (e) { console.error("xpag tiktok", e); }
    try { await svc.functions.invoke("gta-integration-dispatch", { body: { order_id: order.id } }); } catch (e) { console.error("xpag dispatch", e); }
  }
  return { paid: true, expired: false };
}
