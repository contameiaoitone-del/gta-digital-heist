// deno test --allow-env supabase/functions/_shared/xpag_test.ts
import { assert, assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { detectCountry, lookupCountry } from "./geo.ts";
import { INTL_PRODUCTS, LOCAL_PRICE, METHODS, offerFor, priceFor, regionOf, USDT_PRICE } from "./xpag-offer.ts";
import { isValidCoPhone, isValidRut, normalizeCharge } from "./xpag.ts";

Deno.test("oferta fora do Brasil: sem Pix, USDT em todos os países, só lm_*", () => {
  assertEquals(regionOf("BR"), "BR"); assertEquals(regionOf("AR"), "OTHER");
  for (const [region, m] of Object.entries(METHODS)) assert(m.includes("USDT"), region);
  assert(!Object.values(METHODS).flat().includes("PIX" as never));
  assertEquals(priceFor("MX", "USDT"), USDT_PRICE);
  assertEquals(priceFor("MX", "OXXO"), LOCAL_PRICE.MX);
  assertEquals(offerFor("CL").amount, 18990);
  assert(INTL_PRODUCTS.has("lm_low") && INTL_PRODUCTS.has("lm_x1global") && !INTL_PRODUCTS.has("lp2"));
});
Deno.test("RUT e celular colombiano", () => {
  assert(isValidRut("12.345.678-5")); assert(!isValidRut("12.345.678-9"));
  assert(isValidCoPhone("300 123 4567")); assert(!isValidCoPhone("2001234567"));
});
Deno.test("normaliza respostas reais da Xpag", () => {
  assertEquals(normalizeCharge("OXXO", { currency: "MXN", amount: 349, transaction_id: "pr_a", payee_data: { reference: "8203", barcode: "https://b" } }).instructions.kind, "oxxo");
  assertEquals(normalizeCharge("USDT", { currency: "USDT", amount: 19.0039, transaction_id: "pr_b", deposit_address: "TCe" }).amount, 19.0039);
  assertThrows(() => normalizeCharge("SPEI", { currency: "MXN", amount: 1, transaction_id: "x" }));
});
Deno.test("geo: só IP decide; cf-ipcountry/x-forwarded-for ignorados; override só autorizado", async () => {
  const mk = (h: Record<string, string>) => new Request("https://x", { headers: h });
  assertEquals((await detectCountry(mk({}), "mx", true)).country, "MX");
  assertEquals((await detectCountry(mk({}), "MX", false)).country, "BR");
  assertEquals((await detectCountry(mk({ "cf-ipcountry": "CL" }))).country, "BR");
  assertEquals((await detectCountry(mk({ "x-forwarded-for": "8.8.8.8" }))).source, "fallback");
});
Deno.test("lookup: provedor fora do ar não derruba e há cache", async () => {
  let calls = 0;
  const fake = ((url: string) => {
    calls++;
    if (url.includes("country.is")) return Promise.reject(new Error("down"));
    if (url.includes("ipwho.is")) return Promise.resolve(new Response(JSON.stringify({ success: true, country_code: "CL" })));
    return Promise.resolve(new Response("x", { status: 429 }));
  }) as unknown as typeof fetch;
  assertEquals(await lookupCountry("203.0.113.9", fake), "CL");
  const before = calls; assertEquals(await lookupCountry("203.0.113.9", fake), "CL"); assertEquals(calls, before);
});
