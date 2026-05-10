// Admin-only endpoint to read/update payment_settings and test gateway creds.
// Validates the caller's JWT and verifies they have role 'admin'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import {
  serviceClient,
  loadPaymentSettings,
  getZzgateAccessToken,
  getZzgateWebhookUrl,
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
  const svc = serviceClient();
  const { data: userData, error: userErr } = await svc.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user) {
    console.warn("payment-settings: getUser failed", userErr);
    return jsonResponse({ error: "unauthorized" }, 401);
  }
  const { data: roles } = await svc.from("user_roles").select("role").eq("user_id", user.id);
  const isAdmin = (roles || []).some((r: { role: string }) => r.role === "admin");
  if (!isAdmin) return jsonResponse({ error: "forbidden" }, 403);
  return { userId: user.id };
}

const UpdateSchema = z.object({
  active_pix_gateway: z.enum(["efi", "zzgate"]).optional(),
  zzgate_client_id: z.string().trim().max(200).nullable().optional(),
  zzgate_client_secret: z.string().trim().max(400).nullable().optional(),
});

const TestSchema = z.object({
  gateway: z.enum(["zzgate"]),
  client_id: z.string().trim().min(1).max(200),
  client_secret: z.string().trim().min(1).max(400),
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
      return jsonResponse({
        active_pix_gateway: s.active_pix_gateway,
        zzgate_client_id: s.zzgate_client_id || "",
        zzgate_client_secret_masked: mask(s.zzgate_client_secret),
        zzgate_has_secret: !!s.zzgate_client_secret,
        webhook_url: getZzgateWebhookUrl(),
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
        await getZzgateAccessToken(parsed.data.client_id, parsed.data.client_secret);
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