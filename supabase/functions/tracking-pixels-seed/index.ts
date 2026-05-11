import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(url, service);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin");
    if (!roles || roles.length === 0) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const targets: Array<{ platform: string; pixel_id?: string; access_token?: string; label: string }> = [
      {
        platform: "meta",
        pixel_id: Deno.env.get("META_PIXEL_ID") || undefined,
        access_token: Deno.env.get("META_ACCESS_TOKEN") || undefined,
        label: "Pixel principal (sistema)",
      },
      {
        platform: "tiktok",
        pixel_id: Deno.env.get("TIKTOK_PIXEL_ID") || undefined,
        access_token: Deno.env.get("TIKTOK_ACCESS_TOKEN") || undefined,
        label: "Pixel principal (sistema)",
      },
    ];

    const inserted: any[] = [];
    const skipped: any[] = [];
    for (const t of targets) {
      if (!t.pixel_id) { skipped.push({ platform: t.platform, reason: "no env pixel_id" }); continue; }
      const { data: existing } = await admin
        .from("tracking_pixels")
        .select("id")
        .eq("platform", t.platform)
        .eq("pixel_id", t.pixel_id)
        .maybeSingle();
      if (existing) { skipped.push({ platform: t.platform, pixel_id: t.pixel_id, reason: "already exists" }); continue; }
      const { data, error } = await admin.from("tracking_pixels").insert({
        platform: t.platform,
        pixel_id: t.pixel_id,
        access_token: t.access_token || null,
        label: t.label,
        active: true,
      }).select().single();
      if (error) skipped.push({ platform: t.platform, pixel_id: t.pixel_id, reason: error.message });
      else inserted.push(data);
    }

    return new Response(JSON.stringify({ inserted, skipped }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});