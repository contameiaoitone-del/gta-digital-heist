// Câmbio para BRL via AwesomeAPI (gratuita, com CORS). USDT conta como USD.
// É a cotação do momento da consulta, não a do dia da venda.
const norm = (c: string) => (c === "USDT" ? "USD" : c);

/** moeda -> reais por 1 unidade */
export type Rates = Record<string, number>;

export async function fetchBrlRates(currencies: string[]): Promise<Rates> {
  const codes = [...new Set(currencies.map(norm).filter((c) => c && c !== "BRL"))];
  if (codes.length === 0) return {};
  try {
    const res = await fetch(`https://economia.awesomeapi.com.br/json/last/${codes.map((c) => `${c}-BRL`).join(",")}`);
    const d = await res.json();
    return Object.fromEntries(codes.flatMap((c) => (d[`${c}BRL`]?.bid ? [[c, Number(d[`${c}BRL`].bid)]] : [])));
  } catch {
    return {};
  }
}

/** Valor em reais; null quando não há cotação da moeda. */
export function toBrl(value: number, currency: string | null | undefined, rates: Rates): number | null {
  const c = norm(currency || "BRL");
  if (c === "BRL") return value;
  return rates[c] ? value * rates[c] : null;
}
