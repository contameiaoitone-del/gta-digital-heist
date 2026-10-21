import { supabase } from "@/integrations/supabase/client";

// País do visitante e oferta fora do Brasil (Xpag), decididos no SERVIDOR (gta-geo). Qualquer falha ou
// demora cai em "BR": o checkout Pix/cartão de sempre. Só as aulas avulsas abaixo vendem fora do Brasil.
export type IntlMethod = "OXXO" | "SPEI" | "NEQUI" | "BREB" | "CHECKOUT" | "USDT";
export type CheckoutGeo = {
  country: string; region: "BR" | "MX" | "CO" | "CL" | "OTHER"; source: string;
  currency?: "MXN" | "COP" | "CLP" | "USDT"; amount?: number; methods?: IntlMethod[]; lang?: "es" | "en";
  usdt?: { currency: "USDT"; amount: number };
};
export const INTL_PRODUCTS = ["lm_x1global", "lm_low"];
const BR: CheckoutGeo = { country: "BR", region: "BR", source: "fallback" };

// Só no ambiente local (vite dev): ?geo=MX|CO|CL|US|BR simula o país e ?sandbox=1 usa a Xpag de teste. Exige o
// token secreto VITE_GEO_DEV_TOKEN (.env.local) que o servidor confere; em produção isto não existe.
const DEV = import.meta.env.DEV;
const DEV_TOKEN = DEV ? (import.meta.env.VITE_GEO_DEV_TOKEN as string | undefined) : undefined;
const devStore = (key: string, param: string, norm: (v: string) => string) => {
  if (!DEV) return null;
  try {
    const q = new URLSearchParams(window.location.search).get(param);
    if (q !== null) sessionStorage.setItem(key, norm(q));
    return sessionStorage.getItem(key) || null;
  } catch { return null; }
};
export const devGeo = () => devStore("dev_geo", "geo", (v) => v.toUpperCase());
export const devSandbox = () => devStore("dev_sandbox", "sandbox", (v) => (v === "1" ? "1" : "")) === "1";

/** Chama uma function do funil junto com o país/sandbox de teste (só local) e o token de dev. */
export const invokeIntl = (fn: string, body: Record<string, unknown>) =>
  supabase.functions.invoke(fn, {
    body: { ...body, geo_override: devGeo() || undefined, sandbox: devSandbox() || undefined },
    headers: DEV_TOKEN ? { "x-geo-dev-token": DEV_TOKEN } : undefined,
  });

const cache = new Map<string, Promise<CheckoutGeo>>();
export function loadCheckoutGeo(product: string): Promise<CheckoutGeo> {
  if (!INTL_PRODUCTS.includes(product)) return Promise.resolve(BR);
  const key = `${product}:${devGeo() || ""}`;
  let p = cache.get(key);
  if (!p) {
    p = Promise.race([
      invokeIntl("gta-geo", { product }).then(({ data, error }) => (error || !data?.region ? BR : (data as CheckoutGeo))),
      new Promise<CheckoutGeo>((r) => setTimeout(() => r(BR), 3500)),
    ]).catch(() => BR);
    cache.set(key, p);
  }
  return p;
}
