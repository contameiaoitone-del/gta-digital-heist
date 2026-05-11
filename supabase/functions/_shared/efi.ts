// Shared helpers for Efí Bank API (production only, mTLS).
// Used by efi-create-pix, efi-create-card, efi-webhook.
import { loadPaymentSettings } from "./pix-gateway.ts";

export const PIX_HOST = "https://pix.api.efipay.com.br";
export const COB_HOST = "https://cobrancas.api.efipay.com.br";
export const PRODUCT_AMOUNT_CENTS = 6700; // R$ 67,00 — fixed server-side
export const PRODUCT_NAME = "InfoZap";

export type ProductKey = "treinamento" | "lp2";

export const PRODUCTS: Record<ProductKey, { name: string; amount_cents: number }> = {
  infozap: { name: "InfoZap", amount_cents: 6700 },
  lp2: { name: "Comunidade X1 no Pix", amount_cents: 14700 },
};

export function getProduct(key: string | undefined | null) {
  const k = (key as ProductKey) || "treinamento";
  return PRODUCTS[k] ? { key: k, ...PRODUCTS[k] } : { key: "treinamento" as ProductKey, ...PRODUCTS.infozap };
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

function normalizePem(raw: string): string {
  let s = raw.trim();
  // If user pasted with literal "\n" sequences, convert to real newlines.
  if (s.includes("\\n") && !s.includes("\n")) s = s.replace(/\\n/g, "\n");
  // If still single-line (no newlines but contains BEGIN/END), reformat.
  if (!s.includes("\n") && s.includes("-----BEGIN")) {
    const m = s.match(/-----BEGIN ([^-]+)-----(.+)-----END \1-----/);
    if (m) {
      const header = `-----BEGIN ${m[1]}-----`;
      const footer = `-----END ${m[1]}-----`;
      const body = m[2].replace(/\s+/g, "").match(/.{1,64}/g)?.join("\n") ?? "";
      s = `${header}\n${body}\n${footer}`;
    }
  }
  if (!s.endsWith("\n")) s += "\n";
  return s;
}

export function normalizeSecret(raw: string | undefined | null): string {
  if (!raw) return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export interface EfiCreds {
  clientId: string;
  clientSecret: string;
  certPem: string;
  keyPem: string;
  pixKey: string;
  payeeCode: string;
}

// Load Efí creds: prefer DB (admin-managed) values, fallback to env secrets.
export async function loadEfiCreds(): Promise<EfiCreds> {
  let s: Awaited<ReturnType<typeof loadPaymentSettings>> | null = null;
  try {
    s = await loadPaymentSettings();
  } catch (_) {
    s = null;
  }
  const pick = (db: string | null | undefined, envKey: string) =>
    normalizeSecret(db) || normalizeSecret(Deno.env.get(envKey));
  return {
    clientId: pick(s?.efi_client_id, "EFI_CLIENT_ID"),
    clientSecret: pick(s?.efi_client_secret, "EFI_CLIENT_SECRET"),
    certPem: (s?.efi_cert_pem && s.efi_cert_pem.trim()) || Deno.env.get("EFI_CERT_PEM") || "",
    keyPem: (s?.efi_key_pem && s.efi_key_pem.trim()) || Deno.env.get("EFI_KEY_PEM") || "",
    pixKey: pick(s?.efi_pix_key, "EFI_PIX_KEY"),
    payeeCode: pick(s?.efi_payee_code, "EFI_PAYEE_CODE"),
  };
}

export async function getEfiPixKey(): Promise<string> {
  return (await loadEfiCreds()).pixKey;
}

export async function getEfiPayeeCode(): Promise<string> {
  return (await loadEfiCreds()).payeeCode;
}

// Build a Deno HTTP client with mTLS using the Efí PEM cert+key.
// deno-lint-ignore no-explicit-any
let _client: any = null;
let _clientFingerprint = "";
// deno-lint-ignore no-explicit-any
export async function getMtlsClient(certOverride?: string, keyOverride?: string): Promise<any> {
  let cert = certOverride;
  let key = keyOverride;
  if (!cert || !key) {
    const c = await loadEfiCreds();
    cert = c.certPem;
    key = c.keyPem;
  }
  if (!cert || !key) throw new Error("EFI_CERT_PEM/EFI_KEY_PEM not configured");
  cert = normalizePem(cert);
  key = normalizePem(key);
  const fp = `${cert.length}:${key.length}`;
  if (_client && _clientFingerprint === fp) return _client;
  // @ts-ignore — Deno.createHttpClient is available in supabase edge runtime
  _client = Deno.createHttpClient({ cert, key });
  _clientFingerprint = fp;
  return _client;
}

async function basicAuth(idOverride?: string, secretOverride?: string): Promise<string> {
  let id = idOverride ? normalizeSecret(idOverride) : "";
  let secret = secretOverride ? normalizeSecret(secretOverride) : "";
  if (!id || !secret) {
    const c = await loadEfiCreds();
    if (!id) id = c.clientId;
    if (!secret) secret = c.clientSecret;
  }
  if (!id || !secret) throw new Error("EFI_CLIENT_ID/EFI_CLIENT_SECRET missing");
  return "Basic " + btoa(`${id}:${secret}`);
}

// OAuth for Pix API (mTLS required)
export async function getPixAccessToken(creds?: Partial<EfiCreds>): Promise<string> {
  const r = await fetch(`${PIX_HOST}/oauth/token`, {
    method: "POST",
    // @ts-ignore deno client
    client: await getMtlsClient(creds?.certPem, creds?.keyPem),
    headers: {
      Authorization: await basicAuth(creds?.clientId, creds?.clientSecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });
  const data = await r.json();
  if (!r.ok) {
    const error = new Error("efi pix oauth failed: " + JSON.stringify(data));
    error.name = "EfiOAuthError";
    throw error;
  }
  return data.access_token as string;
}

// OAuth for Cobrança API (cartão) — does NOT require mTLS, but works with it.
export async function getCobAccessToken(creds?: Partial<EfiCreds>): Promise<string> {
  const res = await fetch(`${COB_HOST}/v1/authorize`, {
    method: "POST",
    headers: {
      Authorization: await basicAuth(creds?.clientId, creds?.clientSecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("efi cob oauth failed: " + JSON.stringify(data));
  return data.access_token as string;
}

// In-memory rate limit per IP (10 req / 60s)
const RL = new Map<string, number[]>();
export function rateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (RL.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  RL.set(ip, arr);
  return true;
}

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Validate Brazilian CPF (DV check + length)
export function isValidCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const digits = cpf.split("").map(Number);
  for (let i = 9; i < 11; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) sum += digits[j] * (i + 1 - j);
    const dv = (sum * 10) % 11 % 10;
    if (dv !== digits[i]) return false;
  }
  return true;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
