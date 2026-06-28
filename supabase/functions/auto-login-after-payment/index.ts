// Returns a magic link for a paid order so the buyer can be auto-logged in
// from the /obrigado page. Public endpoint. SECURITY: an auto-login token is
// only returned when the caller proves it is the buyer's browser by sending the
// same session_id (SCK) that created the order. Without that match we still
// ensure access is granted (idempotent safety net) but return NO login token —
// the buyer falls back to the welcome e-mail / manual login. This prevents an
// account takeover where anyone holding a leaked order_id (it travels in the
// /obrigado URL) could mint a login for the buyer.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeAccessProduct(product: string): string {
  if (["lp2", "lp2_97", "lp2_5"].includes(product)) return "treinamento";
  if (product.startsWith("mentoria:")) return "treinamento";
  return product;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { order_id, session_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const siteUrl = Deno.env.get("SITE_URL") || "https://joaolucasps.co";

    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, status, product, session_id")
      .eq("id", order_id)
      .maybeSingle();

    if (!order || order.status !== "paid") {
      return new Response(JSON.stringify({ error: "not paid" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const email = (order.customer_email || "").trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Ensure access exists (in case webhook ran but grant didn't). This is safe
    // to run for any paid order regardless of caller — it's idempotent and the
    // welcome e-mail is deduped, so it never leaks anything or double-sends.
    try {
      await supabase.functions.invoke("grant-member-access", { body: { order_id: order.id } });
    } catch (e) {
      console.error("ensure grant failed", e);
    }

    const product = order.product || "treinamento";
    const productSlug = normalizeAccessProduct(product);

    // SECURITY GATE: only mint an auto-login token when the request carries the
    // same SCK (session_id) that created the order — i.e. it really is the
    // buyer's browser. On any mismatch (or legacy orders without a session_id)
    // we skip the token and tell the page to fall back to e-mail / manual login.
    const sessionMatches = !!order.session_id && !!session_id && order.session_id === session_id;
    if (!sessionMatches) {
      console.warn("auto-login session mismatch", { order_id, has_order_session: !!order.session_id });
      return new Response(
        JSON.stringify({ requires_email_login: true, email, redirect_path: `/${productSlug}/membros` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/${encodeURIComponent(productSlug)}/membros` },
    });
    if (linkErr) {
      console.error("generateLink failed", linkErr);
      return new Response(JSON.stringify({ error: linkErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const props = linkData?.properties as { action_link?: string; hashed_token?: string; email_otp?: string } | undefined;
    return new Response(
      JSON.stringify({
        magic_link: props?.action_link,
        hashed_token: props?.hashed_token,
        email,
        redirect_path: `/${productSlug}/membros`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "internal" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
