// Cria a cobrança Xpag (sem Pix) de uma aula avulsa para compradores FORA do Brasil.
// O país e o preço são decididos aqui (geo.ts + xpag-offer.ts); o front só escolhe o método.
// POST { product, method, name, email, phone, rut?, session_id?, event_id_purchase?, geo_override?, sandbox? }
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, getIp, getProduct, jsonResponse, rateLimit } from "../_shared/efi.ts";
import { detectCountry, devAllowed } from "../_shared/geo.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";
import { INTL_PRODUCTS, METHODS, priceFor, regionOf } from "../_shared/xpag-offer.ts";
import { cashinBody, formatRut, isValidCoPhone, isValidRut, loadXpagCreds, normalizeCharge, xpagFetch } from "../_shared/xpag.ts";

const cors = { ...corsHeaders, "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-geo-dev-token` };
const Body = z.object({
  product: z.string().max(40),
  method: z.enum(["OXXO", "SPEI", "NEQUI", "BREB", "CHECKOUT", "USDT"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(24),
  rut: z.string().trim().max(14).optional(),
  session_id: z.string().trim().min(1).max(80).optional(),
  event_id_purchase: z.string().trim().min(1).max(80).optional(),
  geo_override: z.string().max(2).optional(),
  sandbox: z.boolean().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);
  try {
    if (!rateLimit(getIp(req), 10)) return jsonResponse({ error: "rate_limited" }, 429);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return jsonResponse({ error: "invalid" }, 400);
    const b = parsed.data;
    if (!INTL_PRODUCTS.has(b.product)) return jsonResponse({ error: "invalid_product" }, 400);

    const dev = devAllowed(req);
    const sandbox = b.sandbox === true && dev;
    const geo = await detectCountry(req, b.geo_override, dev);
    const region = regionOf(geo.country);
    if (region === "BR") return jsonResponse({ error: "not_available_in_country" }, 403); // Brasil paga por Pix/cartão
    if (!METHODS[region].includes(b.method)) return jsonResponse({ error: "invalid_method" }, 400);

    const phone = b.phone.replace(/[^\d+]/g, "");
    const rut = b.rut || "";
    if (b.method === "CHECKOUT" && !isValidRut(rut)) return jsonResponse({ error: "rut_invalid" }, 400);
    if ((b.method === "NEQUI" || b.method === "BREB") && !isValidCoPhone(phone)) return jsonResponse({ error: "phone_invalid" }, 400);

    const creds = loadXpagCreds(sandbox);
    if (!creds) return jsonResponse({ error: "gateway_not_configured" }, 500);

    const product = getProduct(b.product);
    const price = priceFor(region, b.method);
    const orderId = crypto.randomUUID();
    const eventId = b.event_id_purchase || crypto.randomUUID();

    const r = await xpagFetch(creds, "/cashin", { method: "POST", body: JSON.stringify(await cashinBody(b.method, price, { orderId, name: b.name, email: b.email, phone, rut })) });
    if (!r.ok) { console.error("gta-xpag-create cashin", r.status, r.data?.error_code); return jsonResponse({ error: "gateway_unavailable", gateway_error: r.data?.error_code || null }, 502); }
    let charge;
    try { charge = normalizeCharge(b.method, r.data); } catch (e) { console.error("gta-xpag-create shape", (e as Error).message); return jsonResponse({ error: "gateway_unavailable" }, 502); }
    // O valor cobrado tem que ser o do catálogo (USDT vem com sufixo de centavos para identificar o pedido).
    if (charge.currency !== price.currency || charge.amount < price.amount || charge.amount > price.amount + 1) {
      console.error("gta-xpag-create amount mismatch", charge.currency, charge.amount); return jsonResponse({ error: "gateway_unavailable" }, 502);
    }

    const expires_at = charge.expire_minutes > 0 ? new Date(Date.now() + charge.expire_minutes * 60000).toISOString() : null;
    const svc = serviceClient();
    const { error: dbErr } = await svc.from("orders").insert({
      id: orderId, product: product.key, amount_cents: Math.round(price.amount * 100), currency: price.currency,
      customer_name: b.name, customer_email: b.email, customer_phone: phone, customer_cpf: rut ? formatRut(rut) : "",
      payment_method: b.method.toLowerCase(), pix_gateway: "xpag", gateway_txid: charge.transaction_id,
      status: "pending", session_id: b.session_id ?? null, event_id_purchase: eventId,
      raw: { gateway: "xpag", sandbox, country: geo.country,
        xpag: { transaction_id: charge.transaction_id, request_number: charge.request_number, method: b.method, currency: charge.currency,
          amount: charge.amount, price: price.amount, expire_minutes: charge.expire_minutes, expires_at } },
    });
    if (dbErr) { console.error("gta-xpag-create db", dbErr); return jsonResponse({ error: "db" }, 500); }

    return jsonResponse({
      order_id: orderId, event_id_purchase: eventId,
      intl: { method: b.method, currency: charge.currency, amount: charge.amount, price: price.amount, expires_at, instructions: charge.instructions },
    });
  } catch (e) {
    console.error("gta-xpag-create", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
