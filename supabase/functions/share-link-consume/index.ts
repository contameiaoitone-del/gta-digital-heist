import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GUEST_EMAIL = "share-guest@system.local";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return new Response(JSON.stringify({ error: "Token requerido" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    // 1. Validate token
    const { data: link, error: linkErr } = await admin
      .from("share_links")
      .select("id, expires_at, area_id")
      .eq("token", token)
      .maybeSingle();
    if (linkErr || !link) {
      return new Response(JSON.stringify({ error: "Link inválido" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "Link expirado" }), { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Ensure guest user exists
    let guestId: string | null = null;
    const { data: existing } = await admin.rpc("get_user_id_by_email", { _email: GUEST_EMAIL });
    if (existing) guestId = existing as unknown as string;
    if (!guestId) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: GUEST_EMAIL,
        email_confirm: true,
        user_metadata: { full_name: "Convidado (link compartilhado)" },
      });
      if (createErr) throw createErr;
      guestId = created.user!.id;
    }

    // 3. Scope guest access to the product of THIS share link's area only
    //    (não liberar todos os produtos). granted_at antigo = ignora drip.
    let shareProduct = "treinamento";
    if (link.area_id) {
      const { data: area } = await admin
        .from("member_areas")
        .select("product")
        .eq("id", link.area_id)
        .maybeSingle();
      if (area?.product) shareProduct = area.product;
    }
    const { data: existingAccess } = await admin
      .from("member_access")
      .select("id")
      .eq("user_id", guestId)
      .eq("product", shareProduct)
      .eq("active", true)
      .maybeSingle();
    if (!existingAccess) {
      await admin.from("member_access").insert({
        user_id: guestId,
        product: shareProduct,
        active: true,
        granted_at: new Date(0).toISOString(),
      });
    }

    // 4. Generate magic link → return token_hash for verifyOtp
    const { data: linkData, error: genErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: GUEST_EMAIL,
    });
    if (genErr) throw genErr;
    const tokenHash = (linkData as any)?.properties?.hashed_token;
    if (!tokenHash) throw new Error("Falha ao gerar token");

    return new Response(
      JSON.stringify({ token_hash: tokenHash, expires_at: link.expires_at }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Erro" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});