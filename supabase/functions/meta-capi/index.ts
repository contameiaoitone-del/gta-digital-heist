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
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
    const ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");
    const TEST_CODE = Deno.env.get("META_TEST_EVENT_CODE");
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return json({ error: "meta_not_configured" }, 500);
    }

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

    console.log("[capi] sending", {
      event_name: body.event_name,
      event_id: body.event_id,
      test_code_present: !!TEST_CODE,
      test_code_len: TEST_CODE?.length ?? 0,
      test_code_value: TEST_CODE ?? null,
      has_fbp: !!fbp,
      has_fbc: !!fbc,
      has_ip: !!ip,
      has_ua: !!ua,
      has_em: !!userData.em,
      has_ph: !!userData.ph,
    });

    const url = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const meta = await r.json();
    console.log("[capi] meta response", { status: r.status, body: meta });
    if (!r.ok) {
      console.error("meta capi failed", meta);
      return json({ error: "meta_capi", detail: meta }, 502);
    }

    return json({ success: true, meta });
  } catch (e) {
    console.error("meta-capi error", e);
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
