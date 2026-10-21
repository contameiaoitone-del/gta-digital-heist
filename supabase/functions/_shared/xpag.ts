// Cliente mínimo da Xpag (cash-in). Docs: https://xpag.global/docs/cashin
// Auth: cabeçalhos X-Client-Id / X-Client-Secret. Sem Pix: só MXN, COP, CLP e USDT (TRC20).
import type { IntlMethod } from "./xpag-offer.ts";

const BASE = Deno.env.get("XPAG_BASE_URL") || "https://api.xpag.global";
// Credenciais PÚBLICAS de teste da própria Xpag (docs /docs/sandbox): sem dinheiro real.
const SANDBOX = { id: "xpagsandbox_00000000", secret: "202620262026202620262026" };

export type XpagCreds = { id: string; secret: string; sandbox: boolean };

export function loadXpagCreds(sandbox = false): XpagCreds | null {
  if (sandbox) return { ...SANDBOX, sandbox: true };
  const id = Deno.env.get("XPAG_CLIENT_ID");
  const secret = Deno.env.get("XPAG_CLIENT_SECRET");
  return id && secret ? { id, secret, sandbox: false } : null;
}

export async function xpagFetch(creds: XpagCreds, path: string, init: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { "X-Client-Id": creds.id, "X-Client-Secret": creds.secret, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok && data?.ok !== false, status: res.status, data };
}

// A Xpag não assina o webhook: a URL leva um token HMAC do pedido (só quem recebeu a URL chama)
// e, mesmo assim, o webhook NUNCA confia no corpo: reconsulta a cobrança na API (xpag-reconcile.ts).
async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
  return Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
export const webhookToken = (orderId: string) => hmacHex(`xpag-webhook:${orderId}`);
export async function webhookUrl(orderId: string): Promise<string> {
  return `${Deno.env.get("SUPABASE_URL")}/functions/v1/gta-xpag-webhook?o=${orderId}&t=${await webhookToken(orderId)}`;
}

// ---- documentos / campos por país ------------------------------------------------------------
export const normalizeRut = (v: string) => v.replace(/[^0-9kK]/g, "").toUpperCase();
/** RUT chileno: dígito verificador módulo 11. Aceita "12.345.678-5" ou "123456785". */
export function isValidRut(v: string): boolean {
  const s = normalizeRut(v);
  if (s.length < 7 || s.length > 9) return false;
  const body = s.slice(0, -1), dv = s.slice(-1);
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) { sum += Number(body[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
  const r = 11 - (sum % 11);
  return dv === (r === 11 ? "0" : r === 10 ? "K" : String(r));
}
export const formatRut = (v: string) => { const s = normalizeRut(v); return `${s.slice(0, -1)}-${s.slice(-1)}`; };
/** Celular colombiano: 10 dígitos começando com 3. */
export const isValidCoPhone = (v: string) => /^3\d{9}$/.test(v.replace(/\D/g, ""));

// ---- criação da cobrança ---------------------------------------------------------------------
export type Instructions =
  | { kind: "oxxo"; reference: string; barcode_url: string; checkout_url: string }
  | { kind: "spei"; clabe: string; bank: string; beneficiary: string; checkout_url: string }
  | { kind: "qr"; code: string; breb_key: string; checkout_url: string }
  | { kind: "redirect"; url: string }
  | { kind: "crypto"; address: string; network: string };

export type Charge = {
  transaction_id: string; request_number: string; amount: number; currency: string;
  expire_minutes: number; method: IntlMethod; instructions: Instructions;
};

export type PayerCtx = { orderId: string; name: string; email: string; phone?: string; rut?: string };

export async function cashinBody(method: IntlMethod, price: { currency: string; amount: number }, ctx: PayerCtx) {
  const base = { currency: price.currency, amount: price.amount, external_id: ctx.orderId, webhook_url: await webhookUrl(ctx.orderId) };
  switch (method) {
    case "OXXO": return { ...base, method: "OXXO", payerData: { name: ctx.name, email: ctx.email } };
    case "SPEI": return { ...base, method: "SPEI", name: ctx.name };
    case "NEQUI": return { ...base, method: "NEQUI", phone: (ctx.phone || "").replace(/\D/g, "") };
    case "BREB": return { ...base, method: "BREB", phone: (ctx.phone || "").replace(/\D/g, "") };
    case "CHECKOUT": return { ...base, method: "BANK_TRANSFER", name: ctx.name, email: ctx.email, document: formatRut(ctx.rut || ""), document_type: "RUT" };
    case "USDT": return base;
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Converte a resposta crua da Xpag nas instruções que o front mostra. Lança se faltar o essencial. */
export function normalizeCharge(method: IntlMethod, r: any): Charge {
  const p = r?.payee_data || {};
  let instructions: Instructions;
  switch (method) {
    case "OXXO":
      instructions = { kind: "oxxo", reference: str(p.reference) || str(r.voucher_reference) || str(r.code), barcode_url: str(p.barcode) || str(r.barcode), checkout_url: str(r.checkout_url) };
      if (!instructions.reference) throw new Error("xpag_oxxo_without_reference");
      break;
    case "SPEI":
      instructions = { kind: "spei", clabe: str(r.clabe) || str(r.code), bank: str(r.bank_name), beneficiary: str(r.beneficiary), checkout_url: str(r.checkout_url) };
      if (!instructions.clabe) throw new Error("xpag_spei_without_clabe");
      break;
    case "NEQUI":
    case "BREB":
      instructions = { kind: "qr", code: str(p.qr) || str(r.qr) || str(r.code), breb_key: str(r.breb_key) || str(p.key), checkout_url: str(r.checkout_url) };
      if (!instructions.code) throw new Error("xpag_qr_without_code");
      break;
    case "CHECKOUT":
      instructions = { kind: "redirect", url: str(p.redirectUrl) || str(r.checkout_url) || str(r.code) };
      if (!instructions.url) throw new Error("xpag_checkout_without_url");
      break;
    case "USDT":
      instructions = { kind: "crypto", address: str(r.deposit_address) || str(r.code), network: "TRON (TRC20)" };
      if (!instructions.address) throw new Error("xpag_usdt_without_address");
      break;
  }
  const amount = Number(r.amount);
  if (!r.transaction_id || !Number.isFinite(amount) || !r.currency) throw new Error("xpag_charge_incomplete");
  return {
    transaction_id: String(r.transaction_id), request_number: String(r.request_number || r.transaction_id),
    amount, currency: String(r.currency), expire_minutes: Number(r.expire_minutes) || 0, method, instructions,
  };
}
