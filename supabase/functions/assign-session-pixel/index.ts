// Assigns one Meta pixel per visitor session (deterministic split by SCK hash).
// First call writes pixel_id into visitor_sessions; subsequent calls return the same one.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const { sck } = (await req.json()) as { sck?: string };
    if (!sck) return json({ error: "missing_sck" }, 400);

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Active Meta pixels (ordered for stable index)
    const { data: pixels } = await sb
      .from("tracking_pixels")
      .select("pixel_id, label")
      .eq("platform", "meta")
      .eq("active", true)
      .order("pixel_id", { ascending: true });

    const list = (pixels || []) as Array<{ pixel_id: string; label: string | null }>;
    if (list.length === 0) return json({ pixel_id: null });

    // Check existing assignment
    const { data: existing } = await sb
      .from("visitor_sessions")
      .select("pixel_id")
      .eq("sck", sck)
      .maybeSingle();

    const existingId = (existing as { pixel_id: string | null } | null)?.pixel_id;
    if (existingId && list.some((p) => p.pixel_id === existingId)) {
      return json({ pixel_id: existingId });
    }

    // Deterministic split: hash(sck) mod N
    const hex = await sha256Hex(sck);
    const n = parseInt(hex.slice(0, 8), 16);
    const chosen = list[n % list.length];

    // Persist (upsert by sck)
    await sb
      .from("visitor_sessions")
      .upsert({ sck, pixel_id: chosen.pixel_id }, { onConflict: "sck" });

    return json({ pixel_id: chosen.pixel_id });
  } catch (e) {
    console.error("assign-session-pixel error", e);
    return json({ error: "internal", detail: String(e) }, 500);
  }
});