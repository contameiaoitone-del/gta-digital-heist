// Shared helpers to choose Pix gateway (Efí or ZZGate) and to call ZZGate.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export type PixGateway = "efi" | "zzgate";

export interface PaymentSettings {
  active_pix_gateway: PixGateway;
  zzgate_client_id: string | null;
  zzgate_client_secret: string | null;
  efi_client_id: string | null;
  efi_client_secret: string | null;
  efi_pix_key: string | null;
  efi_payee_code: string | null;
  efi_cert_pem: string | null;
  efi_key_pem: string | null;
}

export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

export async function loadPaymentSettings(): Promise<PaymentSettings> {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("payment_settings")
    .select(
      "active_pix_gateway, zzgate_client_id, zzgate_client_secret, efi_client_id, efi_client_secret, efi_pix_key, efi_payee_code, efi_cert_pem, efi_key_pem",
    )
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    return {
      active_pix_gateway: "efi",
      zzgate_client_id: null,
      zzgate_client_secret: null,
      efi_client_id: null,
      efi_client_secret: null,
      efi_pix_key: null,
      efi_payee_code: null,
      efi_cert_pem: null,
      efi_key_pem: null,
    };
  }
  return data as PaymentSettings;
}

const ZZGATE_HOST = "https://api.zzgate.co";

export async function getZzgateAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const basic = "Basic " + btoa(`${clientId}:${clientSecret}`);
  const r = await fetch(`${ZZGATE_HOST}/v2/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: basic,
    },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.access_token) {
    const err = new Error("zzgate oauth failed: " + JSON.stringify(data));
    err.name = "ZzgateOAuthError";
    throw err;
  }
  return data.access_token as string;
}

export interface CreateZzgatePixInput {
  clientId: string;
  clientSecret: string;
  amountReais: number;
  externalId: string; // = order.id
  postbackUrl: string;
  payerName: string;
  payerCpf: string;
  payerEmail: string;
  description: string;
}

export interface CreateZzgatePixResult {
  transactionId: string;
  qrcode: string; // copia e cola
  raw: unknown;
}

export async function createZzgatePix(input: CreateZzgatePixInput): Promise<CreateZzgatePixResult> {
  const token = await getZzgateAccessToken(input.clientId, input.clientSecret);
  const r = await fetch(`${ZZGATE_HOST}/v2/pix/qrcode`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: Number(input.amountReais.toFixed(2)),
      external_id: input.externalId,
      postbackUrl: input.postbackUrl,
      payerQuestion: input.description,
      payer: {
        name: input.payerName,
        document: input.payerCpf,
        email: input.payerEmail,
      },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.qrcode || !data?.transactionId) {
    throw new Error("zzgate qrcode failed: " + JSON.stringify(data));
  }
  return { transactionId: data.transactionId, qrcode: data.qrcode, raw: data };
}

export function getZzgateWebhookUrl(): string {
  const url = Deno.env.get("SUPABASE_URL")!;
  // SUPABASE_URL is like https://<ref>.supabase.co
  const base = `${url}/functions/v1/zzgate-webhook`;
  // The webhook runs with verify_jwt=false (ZZGate can't carry our JWT), so we
  // authenticate the postback with a shared secret embedded in the URL. ZZGate
  // echoes the full postbackUrl on delivery, and the function checks `?s`.
  const secret = Deno.env.get("ZZGATE_WEBHOOK_SECRET");
  return secret ? `${base}?s=${encodeURIComponent(secret)}` : base;
}

export interface ZzgateTransactionStatus {
  status: string; // e.g. "PAID", "PENDING", "REFUNDED"
  raw: unknown;
}

/**
 * Polls ZZGate for the current status of a transaction. Used as a fallback
 * when the postback (webhook) doesn't reach us.
 */
export async function getZzgateTransactionStatus(
  clientId: string,
  clientSecret: string,
  transactionId: string,
): Promise<ZzgateTransactionStatus | null> {
  const token = await getZzgateAccessToken(clientId, clientSecret);
  // ZZGate exposes the transaction details under /v2/transactions/{id}.
  const r = await fetch(`${ZZGATE_HOST}/v2/transactions/${transactionId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.warn("zzgate transaction lookup failed", r.status, data);
    return null;
  }
  const status = String(
    (data as { status?: string; transactionStatus?: string })?.status ??
      (data as { transactionStatus?: string })?.transactionStatus ??
      "",
  ).toUpperCase();
  return { status, raw: data };
}