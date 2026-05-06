// Returns a magic link for a paid order so the buyer can be auto-logged in
// from the /obrigado page. Public endpoint — only returns a link if the order
// is paid and matches the email. Rate-limited by orderId (one link per call).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const siteUrl = Deno.env.get("SITE_URL") || "https://reallifeacademy.com.br";

    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, status")
      .eq("id", order_id)
      .maybeSingle();

    if (!order || order.status !== "paid") {
      return new Response(JSON.stringify({ error: "not paid" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const email = (order.customer_email || "").trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Ensure access exists (in case webhook ran but grant didn't)
    try {
      await supabase.functions.invoke("grant-member-access", { body: { order_id: order.id } });
    } catch (e) {
      console.error("ensure grant failed", e);
    }

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/membros` },
    });
    if (linkErr) {
      console.error("generateLink failed", linkErr);
      return new Response(JSON.stringify({ error: linkErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ magic_link: linkData?.properties?.action_link }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "internal" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
