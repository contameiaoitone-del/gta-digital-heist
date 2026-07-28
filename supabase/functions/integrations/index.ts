// Admin-only CRUD for outbound "Integração" webhooks + a `test` action that
// fires a sample payload at a target URL so the admin can validate a new
// integration before it goes live. Mirrors supabase/functions/payment-settings
// (mask secrets on read, blank field on update = keep current value).
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";
import { requirePrivileged } from "../_shared/require-role.ts";

function mask(s: string | null): string {
  if (!s) return "";
  if (s.length <= 6) return "•".repeat(s.length);
  return s.slice(0, 3) + "•".repeat(Math.max(4, s.length - 6)) + s.slice(-3);
}
function cleanJwt(raw?: string | null): string {
  if (!raw) return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  s = s.replace(/^bearer\s+/i, "");
  return s.replace(/\s+/g, "");
}
function cleanSecret(raw?: string | null): string {
  return (raw ?? "").replace(/\s+/g, "");
}

const EVENTS = ["initiate_checkout", "purchase", "lead"] as const;

const CreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  target_url: z.string().trim().url().max(2000),
  events: z.array(z.enum(EVENTS)).default([]),
  product: z.string().trim().max(60).nullable().optional(),
  active: z.boolean().default(true),
  secret: z.string().max(4000).optional(),
  api_key: z.string().max(8000).optional(),
});
const UpdateSchema = CreateSchema.partial().extend({ id: z.string().uuid() });
const DeleteSchema = z.object({ id: z.string().uuid() });
const TestSchema = z.object({
  id: z.string().uuid().optional(),
  target_url: z.string().trim().url().optional(),
  secret: z.string().optional(),
  api_key: z.string().optional(),
  sample_email: z.string().email().optional(),
  sample_amount: z.number().int().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const guard = await requirePrivileged(req);
  if ("error" in guard) return jsonResponse({ error: guard.error }, guard.status);

  const svc = serviceClient();
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || (req.method === "GET" ? "list" : "update");

  try {
    if (action === "list") {
      const { data, error } = await svc
        .from("integrations")
        .select("id,name,target_url,events,product,active,created_at,updated_at,secret,api_key")
        .order("created_at", { ascending: false });
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      // M6 — never return secrets in plaintext. Only masked + has_* flags.
      return jsonResponse(
        (data || []).map((r) => ({
          id: r.id,
          name: r.name,
          target_url: r.target_url,
          events: r.events,
          product: r.product,
          active: r.active,
          created_at: r.created_at,
          updated_at: r.updated_at,
          secret_masked: mask(r.secret),
          has_secret: !!r.secret,
          api_key_masked: mask(r.api_key),
          has_api_key: !!r.api_key,
        })),
      );
    }

    if (action === "deliveries") {
      const integrationId = url.searchParams.get("integration_id");
      let q = svc
        .from("integration_deliveries")
        .select("id,integration_id,order_id,event,response_status,magic_link,error,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (integrationId) q = q.eq("integration_id", integrationId);
      const { data, error } = await q;
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      return jsonResponse(data || []);
    }

    if (action === "retry") {
      const { delivery_id } = await req.json().catch(() => ({}));
      if (!delivery_id || typeof delivery_id !== "string") return jsonResponse({ error: "missing_delivery_id" }, 400);
      // Admin-gated (requirePrivileged above); delegates the actual re-POST to
      // integration-dispatch, which owns the fetch/retry/logging logic.
      const { data, error } = await svc.functions.invoke("integration-dispatch", {
        body: { retry_delivery_id: delivery_id },
      });
      if (error) return jsonResponse({ error: "dispatch_failed", detail: error.message }, 500);
      return jsonResponse(data);
    }

    if (action === "create") {
      const parsed = CreateSchema.safeParse(await req.json().catch(() => ({})));
      if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
      const d = parsed.data;
      const { data, error } = await svc
        .from("integrations")
        .insert({
          name: d.name,
          target_url: d.target_url,
          events: d.events,
          product: d.product || null,
          active: d.active,
          secret: d.secret ? cleanSecret(d.secret) : null,
          api_key: d.api_key ? cleanJwt(d.api_key) : null,
          updated_by: guard.userId,
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .maybeSingle();
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      return jsonResponse({ ok: true, id: data?.id });
    }

    if (action === "update") {
      const parsed = UpdateSchema.safeParse(await req.json().catch(() => ({})));
      if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
      const d = parsed.data;
      const patch: Record<string, unknown> = { updated_by: guard.userId, updated_at: new Date().toISOString() };
      if (d.name !== undefined) patch.name = d.name;
      if (d.target_url !== undefined) patch.target_url = d.target_url;
      if (d.events !== undefined) patch.events = d.events;
      if (d.product !== undefined) patch.product = d.product || null;
      if (d.active !== undefined) patch.active = d.active;
      // Blank secret/api_key preserves the stored value (never clears via a blank field).
      if (d.secret && d.secret.trim() !== "") patch.secret = cleanSecret(d.secret);
      if (d.api_key && d.api_key.trim() !== "") patch.api_key = cleanJwt(d.api_key);
      const { error } = await svc.from("integrations").update(patch).eq("id", d.id);
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      return jsonResponse({ ok: true });
    }

    if (action === "delete") {
      const parsed = DeleteSchema.safeParse(await req.json().catch(() => ({})));
      if (!parsed.success) return jsonResponse({ error: "invalid" }, 400);
      const { error } = await svc.from("integrations").delete().eq("id", parsed.data.id);
      if (error) return jsonResponse({ error: "db", detail: error.message }, 500);
      return jsonResponse({ ok: true });
    }

    if (action === "test") {
      const parsed = TestSchema.safeParse(await req.json().catch(() => ({})));
      if (!parsed.success) return jsonResponse({ error: "invalid", issues: parsed.error.flatten() }, 400);
      const b = parsed.data;
      let targetUrl = b.target_url;
      let secret = b.secret;
      let apiKey = b.api_key;
      if (b.id) {
        const { data } = await svc.from("integrations").select("target_url,secret,api_key").eq("id", b.id).maybeSingle();
        targetUrl = targetUrl || data?.target_url;
        if (!secret) secret = data?.secret || undefined;
        if (!apiKey) apiKey = data?.api_key || undefined;
      }
      if (!targetUrl) return jsonResponse({ ok: false, error: "missing_url" }, 200);
      const jwt = cleanJwt(apiKey);
      const sec = cleanSecret(secret);
      const sample = {
        email: b.sample_email || "teste@example.com",
        name: "Teste Integração",
        event_id: `test-${crypto.randomUUID()}`,
        phone: "",
        amount: b.sample_amount ?? 100,
      };
      try {
        const r = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: jwt,
            Authorization: `Bearer ${jwt}`,
            "x-webhook-secret": sec,
          },
          body: JSON.stringify(sample),
        });
        const text = await r.text();
        let json: unknown;
        try {
          json = JSON.parse(text);
        } catch {
          json = { raw: text };
        }
        return jsonResponse({ ok: r.ok, status: r.status, response: json });
      } catch (e) {
        return jsonResponse({ ok: false, error: String(e) }, 200);
      }
    }

    return jsonResponse({ error: "unknown_action" }, 400);
  } catch (e) {
    console.error("integrations error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
