// Webhook da Xpag (cash-in confirmado) das aulas avulsas do funil. A Xpag NÃO assina o webhook:
//  1) a URL carrega ?o=<pedido>&t=<HMAC do pedido>, gerado por nós ao criar a cobrança;
//  2) quem decide é a API: reconsulta a cobrança e só confirma se status=confirmed + moeda + valor batem.
// Cobre quem paga depois de fechar o popup (OXXO vale 12 dias, SPEI 24h...). 500 só em erro nosso (a Xpag pode reenviar).
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";
import { webhookToken } from "../_shared/xpag.ts";
import { reconcileXpagOrder } from "../_shared/xpag-order.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("o") || "";
    const token = url.searchParams.get("t") || "";
    if (!UUID.test(orderId) || token !== (await webhookToken(orderId))) return jsonResponse({ error: "forbidden" }, 403);
    const r = await reconcileXpagOrder(serviceClient(), orderId);
    return jsonResponse({ ok: true, paid: r.paid });
  } catch (e) {
    console.error("gta-xpag-webhook", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
