// Shared helpers for Efí Bank API (production only, mTLS).
// Used by efi-create-pix, efi-create-card, efi-webhook.

export const PIX_HOST = "https://pix.api.efipay.com.br";
export const COB_HOST = "https://cobrancas.api.efipay.com.br";
export const PRODUCT_AMOUNT_CENTS = 6700; // R$ 67,00 — fixed server-side
export const PRODUCT_NAME = "InfoZap";

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

function getCert(): { cert: string; key: string } {
  const cert = Deno.env.get("EFI_CERT_PEM");
  const key = Deno.env.get("EFI_KEY_PEM");
  if (!cert || !key) {
    throw new Error("EFI_CERT_PEM/EFI_KEY_PEM not configured");
  }
  return { cert: normalizePem(cert), key: normalizePem(key) };
}

// Build a Deno HTTP client with mTLS using the Efí PEM cert+key.
// deno-lint-ignore no-explicit-any
let _client: any = null;
// deno-lint-ignore no-explicit-any
export function getMtlsClient(): any {
  if (_client) return _client;
  const { cert, key } = getCert();
  // @ts-ignore — Deno.createHttpClient is available in supabase edge runtime
  _client = Deno.createHttpClient({ cert, key });
  return _client;
}

function basicAuth(): string {
  const id = Deno.env.get("EFI_CLIENT_ID");
  const secret = Deno.env.get("EFI_CLIENT_SECRET");
  if (!id || !secret) throw new Error("EFI_CLIENT_ID/EFI_CLIENT_SECRET missing");
  return "Basic " + btoa(`${id}:${secret}`);
}

// OAuth for Pix API (mTLS required)
export async function getPixAccessToken(): Promise<string> {
  const res = await fetch(`${PIX_HOST}/oauth/token`, {
    method: "POST",
    // @ts-ignore deno client
    client: getMtlsClient(),
    headers: {
      Authorization: basicAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("efi pix oauth failed: " + JSON.stringify(data));
  return data.access_token as string;
}

// OAuth for Cobrança API (cartão) — does NOT require mTLS, but works with it.
export async function getCobAccessToken(): Promise<string> {
  const res = await fetch(`${COB_HOST}/v1/authorize`, {
    method: "POST",
    headers: {
      Authorization: basicAuth(),
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
