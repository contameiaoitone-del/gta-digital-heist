// Upserts visitor session data keyed by sck (session_id generated client-side).
// Captures real IP from request headers and merges with client-provided fbc/fbp/UA/geo.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), {
    status: s,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const body = await req.json();
    const sck = String(body.session_id || body.sck || "").trim();
    if (!sck) return json({ error: "missing_session_id" }, 400);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const ua = req.headers.get("user-agent") || body.user_agent || null;

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const setIf = (k: string, v: unknown) => {
      if (v !== undefined && v !== null && v !== "") update[k] = v;
    };
    setIf("fbc", body.fbc);
    setIf("fbp", body.fbp);
    setIf("fbclid", body.fbclid);
    setIf("ip_address", ip);
    setIf("user_agent", ua);
    setIf("country", body.country);
    setIf("state", body.state);
    setIf("city", body.city);
    setIf("page_location", body.page_location);
    setIf("event_id_pageview", body.event_id_pageview);
    setIf("event_id_initiate", body.event_id_initiate);
    setIf("first_name", body.first_name);
    setIf("last_name", body.last_name);
    setIf("email", body.email);
    setIf("phone", body.phone);
    setIf("external_id", body.external_id);

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Upsert by sck
    const { data: existing } = await sb
      .from("visitor_sessions")
      .select("id")
      .eq("sck", sck)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await sb.from("visitor_sessions").update(update).eq("sck", sck);
      if (error) throw error;
    } else {
      const { error } = await sb.from("visitor_sessions").insert({ sck, ...update });
      if (error) throw error;
    }

    return json({ ok: true });
  } catch (e) {
    console.error("track-session error", e);
    return json({ error: "internal", detail: String(e) }, 500);
  }
});
