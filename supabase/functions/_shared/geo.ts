// País do visitante, decidido no SERVIDOR (o front nunca escolhe o próprio preço).
// Única fonte em produção: o IP do cliente (cf-connecting-ip, posto/sobrescrito pela Cloudflare)
// consultado em 3 provedores em corrida, com cache. NÃO confia em cf-ipcountry (o Supabase não o define,
// então o cliente poderia mandá-lo) nem em x-forwarded-for (o 1º valor é forjável).
// Sem resposta -> Brasil (mantém o fluxo de sempre: Pix/cartão).
// Override de teste (país simulado e sandbox): só com o segredo GEO_DEV_TOKEN no cabeçalho x-geo-dev-token.
export type Geo = { country: string; source: "override" | "ip-lookup" | "fallback" };

const isCountry = (v: unknown): v is string => typeof v === "string" && /^[A-Z]{2}$/.test(v) && v !== "XX" && v !== "T1";

const PROVIDERS: Array<(ip: string) => string> = [
  (ip) => `https://api.country.is/${encodeURIComponent(ip)}`,
  (ip) => `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`,
  (ip) => `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
];
const pickCountry = (j: any) => String(j?.country ?? j?.country_code ?? "").toUpperCase();

const cache = new Map<string, { country: string; exp: number }>();
const TTL = 6 * 3600_000;

export async function lookupCountry(ip: string, fetcher: typeof fetch = fetch): Promise<string | null> {
  const hit = cache.get(ip);
  if (hit && hit.exp > Date.now()) return hit.country;
  try {
    const country = await Promise.any(PROVIDERS.map(async (url) => {
      const r = await fetcher(url(ip), { signal: AbortSignal.timeout(2500) });
      const c = pickCountry(await r.json());
      if (!r.ok || !isCountry(c)) throw new Error("no-country");
      return c;
    }));
    if (cache.size > 5000) cache.clear();
    cache.set(ip, { country, exp: Date.now() + TTL });
    return country;
  } catch { return null; }
}

/** true se a requisição traz o token secreto de desenvolvimento (GEO_DEV_TOKEN). */
export function devAllowed(req: Request): boolean {
  const secret = Deno.env.get("GEO_DEV_TOKEN") || "";
  const sent = req.headers.get("x-geo-dev-token") || "";
  return secret.length >= 16 && sent === secret;
}

export async function detectCountry(req: Request, override?: unknown, allowOverride = false): Promise<Geo> {
  const ov = typeof override === "string" ? override.trim().toUpperCase() : "";
  if (allowOverride && isCountry(ov)) return { country: ov, source: "override" };
  const ip = (req.headers.get("cf-connecting-ip") || "").trim();
  if (ip) {
    const c = await lookupCountry(ip);
    if (c) return { country: c, source: "ip-lookup" };
  }
  return { country: "BR", source: "fallback" };
}
