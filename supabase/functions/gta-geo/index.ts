// País do visitante e oferta de pagamento fora do Brasil (Xpag) para as aulas lm_x1global e lm_low.
// POST { product, geo_override? } -> { country, region, source, [currency, amount, methods, lang, usdt] }
// Brasil, país desconhecido ou produto fora da lista -> region "BR" (checkout Pix/cartão de sempre).
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, getIp, jsonResponse, rateLimit } from "../_shared/efi.ts";
import { detectCountry, devAllowed } from "../_shared/geo.ts";
import { INTL_PRODUCTS, offerFor, regionOf } from "../_shared/xpag-offer.ts";

const cors = { ...corsHeaders, "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-geo-dev-token` };
const Body = z.object({ product: z.string().max(40), geo_override: z.string().max(2).optional() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);
  try {
    if (!rateLimit(getIp(req), 30)) return jsonResponse({ error: "rate_limited" }, 429);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return jsonResponse({ error: "invalid" }, 400);
    const { product, geo_override } = parsed.data;
    if (!INTL_PRODUCTS.has(product)) return jsonResponse({ country: "BR", region: "BR", source: "fallback" });

    const geo = await detectCountry(req, geo_override, devAllowed(req));
    const region = regionOf(geo.country);
    if (region === "BR") return jsonResponse({ country: geo.country, region, source: geo.source });
    return jsonResponse({ country: geo.country, region, source: geo.source, ...offerFor(region) });
  } catch (e) {
    console.error("gta-geo", e);
    return jsonResponse({ country: "BR", region: "BR", source: "fallback" }); // na dúvida, fluxo de sempre
  }
});
