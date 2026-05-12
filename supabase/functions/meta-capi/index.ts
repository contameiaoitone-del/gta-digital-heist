// Meta Conversions API edge function. Sends server-side events to
// graph.facebook.com with full user_data hashed (SHA-256) for deduplication
// with the client-side Pixel via shared event_id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.toLowerCase().trim());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function digitsOnly(s: string): string {
  return (s || "").replace(/\D/g, "");
}

function formatPhoneE164BR(phone: string): string {
  const d = digitsOnly(phone);
  if (!d) return "";
  if (d.startsWith("55")) return d;
  return "55" + d;
}

function formatNameParts(full?: string): { fn?: string; ln?: string } {
  if (!full) return {};
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

interface CapiBody {
  event_name: "PageView" | "ViewContent" | "InitiateCheckout" | "Lead" | "Purchase" | string;
  event_id: string;
  event_source_url?: string;
  session_id?: string;
  // Direct user fields (override session lookup)
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  cpf?: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  user_agent?: string;
  country?: string;
  state?: string;
  city?: string;
  // Custom data
  value?: number;
  currency?: string;
  content_name?: string;
  order_id?: string;
  page_source?: string;
}

function derivePageSource(url?: string, explicit?: string): string | null {
  if (explicit) return explicit.toUpperCase();
  if (!url) return null;
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.startsWith("/mentoria")) return "MENTORIA";
    if (path.startsWith("/lp2-97")) return "LP2-97";
    if (path.startsWith("/lp2-5")) return "LP2-5";
    if (path.startsWith("/lp2") || path === "/") return "LP2";
    if (path.startsWith("/lp1")) return "LP1";
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const TEST_CODE = Deno.env.get("META_TEST_EVENT_CODE");
    const ENV_PIXEL_ID = Deno.env.get("META_PIXEL_ID");
    const ENV_ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");

    const body = (await req.json()) as CapiBody;
    if (!body?.event_name || !body?.event_id) {
      return json({ error: "missing_event" }, 400);
    }

    // Pull session context from DB if session_id is provided
    let session: Record<string, unknown> | null = null;
    if (body.session_id) {
      const sb = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data } = await sb
        .from("visitor_sessions")
        .select("*")
        .eq("sck", body.session_id)
        .maybeSingle();
      session = data;
    }

    const ipHeader =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const fbc = body.fbc || (session?.fbc as string) || undefined;
    const fbp = body.fbp || (session?.fbp as string) || undefined;
    const ip = body.ip || (session?.ip_address as string) || ipHeader;
    const ua = body.user_agent || (session?.user_agent as string) || req.headers.get("user-agent") || undefined;
    const country = body.country || (session?.country as string) || undefined;
    const state = body.state || (session?.state as string) || undefined;
    const city = body.city || (session?.city as string) || undefined;
    const email = body.email || (session?.email as string) || undefined;
    const phone = body.phone || (session?.phone as string) || undefined;

    let fn = body.first_name || (session?.first_name as string) || undefined;
    let ln = body.last_name || (session?.last_name as string) || undefined;
    if ((!fn || !ln) && body.full_name) {
      const parts = formatNameParts(body.full_name);
      fn = fn || parts.fn;
      ln = ln || parts.ln;
    }

    const cpf = body.cpf || (session?.external_id as string) || undefined;

    const userData: Record<string, unknown> = {};
    if (email) userData.em = await sha256(email);
    if (phone) userData.ph = await sha256(formatPhoneE164BR(phone));
    if (fn) userData.fn = await sha256(fn);
    if (ln) userData.ln = await sha256(ln);
    if (country) userData.country = await sha256(country.toLowerCase());
    if (state) userData.st = await sha256(state.toLowerCase());
    if (city) userData.ct = await sha256(city.toLowerCase().replace(/\s+/g, ""));
    if (cpf) userData.external_id = await sha256(digitsOnly(cpf));
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;

    const customData: Record<string, unknown> = {};
    if (body.value !== undefined) customData.value = Number(body.value) || 0;
    if (body.currency || body.value !== undefined) customData.currency = body.currency || "BRL";
    if (body.content_name) customData.content_name = body.content_name;
    if (body.order_id) customData.order_id = body.order_id;
    if (body.event_name === "Purchase") customData.content_type = "product";

    const utm_source = (session?.utm_source as string) || undefined;
    const utm_medium = (session?.utm_medium as string) || undefined;
    const utm_campaign = (session?.utm_campaign as string) || undefined;
    const utm_content = (session?.utm_content as string) || undefined;
    const utm_term = (session?.utm_term as string) || undefined;
    if (utm_source) customData.utm_source = utm_source;
    if (utm_medium) customData.utm_medium = utm_medium;
    if (utm_campaign) customData.utm_campaign = utm_campaign;
    if (utm_content) customData.utm_content = utm_content;
    if (utm_term) customData.utm_term = utm_term;

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: body.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.event_id,
          event_source_url: body.event_source_url,
          action_source: "website",
          user_data: userData,
          ...(Object.keys(customData).length > 0 && { custom_data: customData }),
        },
      ],
    };
    if (TEST_CODE) (payload as Record<string, unknown>).test_event_code = TEST_CODE;

    // Service-role client for log + idempotency + pixel lookup
    const sbAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve target pixels: prefer DB-managed list; fall back to env vars.
    const { data: dbPixels } = await sbAdmin
      .from("tracking_pixels")
      .select("pixel_id, access_token")
      .eq("platform", "meta")
      .eq("active", true);
    const targets: Array<{ pixel_id: string; access_token: string }> = [];
    for (const p of (dbPixels || []) as Array<{ pixel_id: string; access_token: string | null }>) {
      if (p.pixel_id && p.access_token) targets.push({ pixel_id: p.pixel_id, access_token: p.access_token });
    }
    if (targets.length === 0 && ENV_PIXEL_ID && ENV_ACCESS_TOKEN) {
      targets.push({ pixel_id: ENV_PIXEL_ID, access_token: ENV_ACCESS_TOKEN });
    }
    if (targets.length === 0) {
      return json({ error: "meta_not_configured" }, 500);
    }

    // Idempotency: if Purchase with this event_id already succeeded, skip.
    if (body.event_name === "Purchase" && body.event_id) {
      const { data: dup } = await sbAdmin
        .from("meta_capi_log")
        .select("id")
        .eq("event_id", body.event_id)
        .eq("event_name", "Purchase")
        .eq("success", true)
        .limit(1)
        .maybeSingle();
      if (dup) {
        console.log("meta-capi dedup hit", body.event_id);
        return json({ success: true, deduped: true });
      }
    }

    // Send to every configured pixel and log each result.
    const results: Array<{ pixel_id: string; ok: boolean; status: number; meta: unknown; error: string | null }> = [];
    for (const t of targets) {
      const url = `https://graph.facebook.com/v20.0/${t.pixel_id}/events?access_token=${t.access_token}`;
      let status = 0;
      let metaResp: unknown = null;
      let fetchErr: string | null = null;
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        status = r.status;
        metaResp = await r.json().catch(() => ({}));
      } catch (e) {
        fetchErr = String(e);
      }
      const ok = status >= 200 && status < 300 && !fetchErr;
      results.push({ pixel_id: t.pixel_id, ok, status, meta: metaResp, error: fetchErr });

      try {
        await sbAdmin.from("meta_capi_log").insert({
          event_name: body.event_name,
          event_id: body.event_id,
          order_id: body.order_id || null,
          session_id: body.session_id || null,
          value: body.value ?? null,
          status_code: status || null,
          success: ok,
          meta_response: metaResp ?? null,
          error: fetchErr || (!ok ? JSON.stringify({ pixel_id: t.pixel_id, response: metaResp }) : null),
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          utm_term: utm_term || null,
          page_source: derivePageSource(body.event_source_url, body.page_source),
        });
      } catch (e) {
        console.error("meta_capi_log insert failed", e);
      }
    }

    const anyOk = results.some((r) => r.ok);
    if (anyOk && body.event_name === "Purchase" && body.order_id) {
      try {
        await sbAdmin
          .from("orders")
          .update({ meta_purchase_sent_at: new Date().toISOString() })
          .eq("id", body.order_id);
      } catch (e) {
        console.error("orders meta_purchase_sent_at update failed", e);
      }
    }

    if (!anyOk) {
      console.error("meta capi failed for all pixels", results);
      return json({ error: "meta_capi", results }, 502);
    }
    return json({ success: true, results });
  } catch (e) {
    console.error("meta-capi error", e);
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
