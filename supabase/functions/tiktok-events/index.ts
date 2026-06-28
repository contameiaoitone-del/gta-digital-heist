// TikTok Events API edge function. Server-side mirror of client Pixel events,
// with shared event_id for deduplication and SHA-256 hashed user_data.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), {
    status: s,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.toLowerCase().trim());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const digits = (s: string) => (s || "").replace(/\D/g, "");

function phoneE164(p: string): string {
  const d = digits(p);
  if (!d) return "";
  return d.startsWith("55") ? `+${d}` : `+55${d}`;
}

function nameParts(full?: string): { fn?: string; ln?: string } {
  if (!full) return {};
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

interface TtBody {
  event_name: "Pageview" | "ViewContent" | "InitiateCheckout" | "AddPaymentInfo" | "CompletePayment" | "Lead" | string;
  event_id: string;
  event_source_url?: string;
  session_id?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  cpf?: string;
  ttclid?: string;
  ttp?: string;
  ip?: string;
  user_agent?: string;
  country?: string;
  state?: string;
  city?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  content_id?: string;
  order_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const TEST_CODE = Deno.env.get("TIKTOK_TEST_EVENT_CODE");
    const ENV_PIXEL_ID = Deno.env.get("TIKTOK_PIXEL_ID");
    const ENV_ACCESS_TOKEN = Deno.env.get("TIKTOK_ACCESS_TOKEN");

    const body = (await req.json()) as TtBody;
    if (!body?.event_name || !body?.event_id) return json({ error: "missing_event" }, 400);

    let session: Record<string, unknown> | null = null;
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    if (body.session_id) {
      const { data } = await sb.from("visitor_sessions").select("*").eq("sck", body.session_id).maybeSingle();
      session = data;
    }

    // Resolve target pixels from DB; fall back to env if none configured.
    const { data: dbPixels } = await sb
      .from("tracking_pixels")
      .select("pixel_id, access_token")
      .eq("platform", "tiktok")
      .eq("active", true);
    const targets: Array<{ pixel_id: string; access_token: string }> = [];
    for (const p of (dbPixels || []) as Array<{ pixel_id: string; access_token: string | null }>) {
      if (p.pixel_id && p.access_token) targets.push({ pixel_id: p.pixel_id, access_token: p.access_token });
    }
    if (targets.length === 0 && ENV_PIXEL_ID && ENV_ACCESS_TOKEN) {
      targets.push({ pixel_id: ENV_PIXEL_ID, access_token: ENV_ACCESS_TOKEN });
    }
    if (targets.length === 0) return json({ error: "tiktok_not_configured" }, 500);

    const ipHeader =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || undefined;

    const ttclid = body.ttclid || (session?.ttclid as string) || undefined;
    const ttp = body.ttp || (session?.ttp as string) || undefined;
    const ip = body.ip || (session?.ip_address as string) || ipHeader;
    const ua = body.user_agent || (session?.user_agent as string) || req.headers.get("user-agent") || undefined;
    const email = body.email || (session?.email as string) || undefined;
    const phone = body.phone || (session?.phone as string) || undefined;
    let fn = body.first_name || (session?.first_name as string) || undefined;
    let ln = body.last_name || (session?.last_name as string) || undefined;
    if ((!fn || !ln) && body.full_name) {
      const p = nameParts(body.full_name);
      fn = fn || p.fn;
      ln = ln || p.ln;
    }
    const cpf = body.cpf || (session?.external_id as string) || undefined;

    const user: Record<string, unknown> = {};
    if (email) user.email = await sha256(email);
    if (phone) user.phone = await sha256(phoneE164(phone));
    if (fn) user.first_name = await sha256(fn);
    if (ln) user.last_name = await sha256(ln);
    if (cpf) user.external_id = await sha256(digits(cpf));
    if (ttclid) user.ttclid = ttclid;
    if (ttp) user.ttp = ttp;
    if (ip) user.ip = ip;
    if (ua) user.user_agent = ua;
    if (body.city) user.city = body.city;
    if (body.state) user.state = body.state;
    if (body.country) user.country = (body.country || "").toUpperCase();

    const properties: Record<string, unknown> = {};
    if (body.value !== undefined) properties.value = Number(body.value) || 0;
    if (body.currency || body.value !== undefined) properties.currency = body.currency || "BRL";
    if (body.content_name || body.content_id) {
      properties.contents = [{
        content_id: body.content_id || body.order_id || "treinamento",
        content_name: body.content_name || "InfoZap",
        content_type: "product",
        quantity: 1,
        price: Number(body.value) || 0,
      }];
      properties.content_type = "product";
    }
    if (body.order_id) properties.order_id = body.order_id;

    const results: Array<{ pixel_id: string; ok: boolean; meta: unknown }> = [];
    for (const t of targets) {
      const payload: Record<string, unknown> = {
        event_source: "web",
        event_source_id: t.pixel_id,
        data: [
          {
            event: body.event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: body.event_id,
            user,
            properties,
            page: body.event_source_url ? { url: body.event_source_url } : undefined,
          },
        ],
      };
      if (TEST_CODE) (payload as Record<string, unknown>).test_event_code = TEST_CODE;

      let meta: unknown = null;
      let ok = false;
      try {
        const r = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Access-Token": t.access_token },
          body: JSON.stringify(payload),
        });
        meta = await r.json();
        ok = r.ok && !(meta && typeof meta === "object" && "code" in meta && (meta as { code: number }).code !== 0);
      } catch (e) {
        meta = { error: String(e) };
      }
      if (!ok) console.error("tiktok events failed", t.pixel_id, meta);
      results.push({ pixel_id: t.pixel_id, ok, meta });
    }
    const anyOk = results.some((r) => r.ok);
    if (!anyOk) return json({ error: "tiktok_events", results }, 502);
    return json({ success: true, results });
  } catch (e) {
    console.error("tiktok-events error", e);
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
