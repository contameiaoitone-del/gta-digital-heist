// Oferta fora do Brasil (Xpag, sem Pix) das aulas avulsas lm_x1global e lm_low (R$ 94 no Brasil).
// R$ 94 ≈ US$ 18,7 em 21/10/2026, arredondado. Mudou o preço: editar aqui e fazer deploy das gta-xpag-*.
export type Region = "BR" | "MX" | "CO" | "CL" | "OTHER";
export type IntlRegion = Exclude<Region, "BR">;
export type IntlMethod = "OXXO" | "SPEI" | "NEQUI" | "BREB" | "CHECKOUT" | "USDT";

export const regionOf = (country: string): Region =>
  country === "BR" ? "BR" : country === "MX" ? "MX" : country === "CO" ? "CO" : country === "CL" ? "CL" : "OTHER";

/** Só estas aulas vendem fora do Brasil. */
export const INTL_PRODUCTS = new Set(["lm_x1global", "lm_low"]);

export const USDT_PRICE = { currency: "USDT" as const, amount: 19 };
export const LOCAL_PRICE: Record<IntlRegion, { currency: "MXN" | "COP" | "CLP" | "USDT"; amount: number }> = {
  MX: { currency: "MXN", amount: 349 },
  CO: { currency: "COP", amount: 59000 },
  CL: { currency: "CLP", amount: 18990 },
  OTHER: USDT_PRICE,
};
// USDT (TRC20) em todos os países fora do Brasil.
export const METHODS: Record<IntlRegion, IntlMethod[]> = {
  MX: ["OXXO", "SPEI", "USDT"], CO: ["NEQUI", "BREB", "USDT"], CL: ["CHECKOUT", "USDT"], OTHER: ["USDT"],
};
export const LANG: Record<IntlRegion, "es" | "en"> = { MX: "es", CO: "es", CL: "es", OTHER: "en" };

/** Moeda e valor cobrados para o método escolhido (USDT tem preço próprio em qualquer país). */
export const priceFor = (region: IntlRegion, method: IntlMethod) => (method === "USDT" ? USDT_PRICE : LOCAL_PRICE[region]);
export const offerFor = (region: IntlRegion) => ({ ...LOCAL_PRICE[region], methods: METHODS[region], lang: LANG[region], usdt: USDT_PRICE });

// Meta/TikTok não conhecem USDT: reporta em USD.
export const capiCurrency = (c: string) => (c === "USDT" ? "USD" : c);
