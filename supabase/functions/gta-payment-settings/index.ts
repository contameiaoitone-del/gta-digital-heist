// Admin-only endpoint to read/update payment_settings and test gateway creds.
// Validates the caller's JWT and verifies they have role 'admin'.
import { z } from "https://esm.sh/zod@3.23.8";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse, getPixAccessToken, normalizeSecret } from "../_shared/efi.ts";
import {
  serviceClient,
  loadPaymentSettings,
  getZzgateAccessToken,
} from "../_shared/pix-gateway.ts";

function mask(s: string | null): string {
  if (!s) return "";
  if (s.length <= 6) return "•".repeat(s.length);
  return s.slice(0, 3) + "•".repeat(Math.max(4, s.length - 6)) + s.slice(-3);
}

async function requireAdmin(req: Request): Promise<{ userId: string } | Response> {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return jsonResponse({ error: "unauthorized" }, 401);
  const token = auth.replace(/^Bearer\s+/i, "");
  // Validate the raw JWT claims directly. Edge Functions don't have an auth session,
  // and getUser() can fail with "Auth session missing" even when the JWT is valid.
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
  const userId = claimsData?.claims?.sub;
  if (claimsErr || !userId) {
    console.warn("payment-settings: getClaims failed", claimsErr);
    return jsonResponse({ error: "unauthorized" }, 401);
  }
  const svc = serviceClient();
  const { data: roles } = await svc.from("user_roles").select("role").eq("user_id", userId);
  // admin-level = admin (legado) | master | super_admin
  const isAdmin = (roles || []).some((r: { role: string }) => ["admin", "master", "super_admin"].includes(r.role));
  if (!isAdmin) return jsonResponse({ error: "forbidden" }, 403);
  return { userId };
}

const UpdateSchema = z.object({
  active_pix_gateway: z.enum(["efi", "zzgate"]).optional(),
  zzgate_client_id: z.string().trim().max(200).nullable().optional(),
  zzgate_client_secret: z.string().trim().max(400).nullable().optional(),
  efi_client_id: z.string().trim().max(200).nullable().optional(),
  efi_client_secret: z.string().trim().max(400).nullable().optional(),
  efi_pix_key: z.string().trim().max(200).nullable().optional(),
  efi_payee_code: z.string().trim().max(60).nullable().optional(),
  efi_cert_pem: z.string().max(20000).nullable().optional(),
  efi_key_pem: z.string().max(20000).nullable().optional(),
});

const TestSchema = z.object({
  gateway: z.enum(["zzgate", "efi"]),
  client_id: z.string().trim().max(200).optional(),
  client_secret: z.string().trim().max(400).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || (req.method === "GET" ? "get" : "update");

  try {
    if (action === "get") {
      const s = await loadPaymentSettings();
      // Fall back to env values for Efí so the admin sees current secrets (masked)
      const efiClientId = s.efi_client_id || normalizeSecret(Deno.env.get("EFI_CLIENT_ID"));
      const efiClientSecret = s.efi_client_secret || normalizeSecret(Deno.env.get("EFI_CLIENT_SECRET"));
      const efiPixKey = s.efi_pix_key || normalizeSecret(Deno.env.get("EFI_PIX_KEY"));
      const efiPayee = s.efi_payee_code || normalizeSecret(Deno.env.get("EFI_PAYEE_CODE"));
      const hasCert = !!(s.efi_cert_pem || Deno.env.get("EFI_CERT_PEM"));
      const hasKey = !!(s.efi_key_pem || Deno.env.get("EFI_KEY_PEM"));
      // M6 — NUNCA devolver segredos em texto puro. Só valores não-sensíveis +
      // versões mascaradas + flags "tem segredo". Para alterar, o admin digita o novo
      // (campo em branco = mantém o atual, ver action "update").
      return jsonResponse({
        active_pix_gateway: s.active_pix_gateway,
        zzgate_client_id: s.zzgate_client_id || "",
        zzgate_client_secret_masked: mask(s.zzgate_client_secret),
        zzgate_has_secret: !!s.zzgate_client_secret,
        efi_client_id: efiClientId || "",
        efi_client_secret_masked: mask(efiClientSecret),
        efi_has_secret: !!efiClientSecret,
        efi_pix_key: efiPixKey || "",
        efi_payee_code: efiPayee || "",
        efi_has_cert: hasCert,
        efi_has_key: hasKey,
      });
    }

    if (action === "update") {
      const body = await req.json().catch(() => ({}));
      const parsed = UpdateSchema.safeParse(body);
      if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: guard.userId };
      if (parsed.data.active_pix_gateway) patch.active_pix_gateway = parsed.data.active_pix_gateway;
      if (parsed.data.zzgate_client_id !== undefined) patch.zzgate_client_id = parsed.data.zzgate_client_id || null;
      // Only update secret if a non-empty string was provided (empty string clears it)
      if (parsed.data.zzgate_client_secret !== undefined) {
        patch.zzgate_client_secret = parsed.data.zzgate_client_secret || null;
      }
      // Efí — update only when a value is sent (empty string is ignored to preserve current)
      const setIfFilled = (key: keyof typeof parsed.data, col: string) => {
        const v = parsed.data[key];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          patch[col] = String(v);
        }
      };
      setIfFilled("efi_client_id", "efi_client_id");
      setIfFilled("efi_client_secret", "efi_client_secret");
      setIfFilled("efi_pix_key", "efi_pix_key");
      setIfFilled("efi_payee_code", "efi_payee_code");
      setIfFilled("efi_cert_pem", "efi_cert_pem");
      setIfFilled("efi_key_pem", "efi_key_pem");
      const svc = serviceClient();
      const { error } = await svc.from("payment_settings").update(patch).eq("id", 1);
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      return jsonResponse({ ok: true });
    }

    if (action === "test") {
      const body = await req.json().catch(() => ({}));
      const parsed = TestSchema.safeParse(body);
      if (!parsed.success) return jsonResponse({ error: "invalid" }, 400);
      try {
        if (parsed.data.gateway === "zzgate") {
          if (!parsed.data.client_id || !parsed.data.client_secret) {
            return jsonResponse({ ok: false, error: "missing creds" }, 200);
          }
          await getZzgateAccessToken(parsed.data.client_id, parsed.data.client_secret);
        } else {
          // Efí: use override if provided, else current saved/env creds
          await getPixAccessToken(
            parsed.data.client_id && parsed.data.client_secret
              ? { clientId: parsed.data.client_id, clientSecret: parsed.data.client_secret }
              : undefined,
          );
        }
        return jsonResponse({ ok: true });
      } catch (e) {
        return jsonResponse({ ok: false, error: String(e) }, 200);
      }
    }

    return jsonResponse({ error: "unknown_action" }, 400);
  } catch (e) {
    console.error("payment-settings error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});