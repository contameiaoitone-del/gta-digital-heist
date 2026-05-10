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
  return `${url}/functions/v1/zzgate-webhook`;
}