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
      .select("id, expires_at")
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

    // 3. Ensure member_access for all distinct module products (granted long ago, bypasses drip)
    const { data: products } = await admin.from("modules").select("product");
    const distinct = Array.from(new Set(((products as { product: string }[] | null) || []).map((p) => p.product))).filter(Boolean);
    if (distinct.length > 0) {
      const { data: existingAccess } = await admin
        .from("member_access")
        .select("product")
        .eq("user_id", guestId)
        .eq("active", true);
      const have = new Set(((existingAccess as { product: string }[] | null) || []).map((a) => a.product));
      const missing = distinct.filter((p) => !have.has(p));
      if (missing.length > 0) {
        await admin.from("member_access").insert(
          missing.map((p) => ({ user_id: guestId, product: p, active: true, granted_at: new Date(0).toISOString() }))
        );
      }
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