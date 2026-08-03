// Creates auth user (or finds existing) for a paid order, grants member_access,
// generates magic link, and enqueues welcome email.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function randomPassword(len = 14): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let out = "";
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
  return out;
}

function normalizeAccessProduct(product: string): string {
  if (["lp2", "lp2_97", "lp2_5"].includes(product)) return "treinamento";
  return product;
}

// Lead magnets (aula avulsa) vendidos só pra disparar o webhook de compra
// (Integração/ZZFUNNELS) — não devem abrir conta nem liberar nenhuma área
// de membros interna.
const NO_MEMBER_ACCESS_PRODUCTS = new Set(["lm_x1global", "lm_fotoia", "lm_low"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const siteUrl = Deno.env.get("SITE_URL") || "https://joaolucasps.co";

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, status, product")
      .eq("id", order_id)
      .maybeSingle();
    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "order not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (order.status !== "paid") {
      return new Response(JSON.stringify({ error: "order not paid" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (NO_MEMBER_ACCESS_PRODUCTS.has(order.product || "")) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_member_access_product" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const email = (order.customer_email || "").trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: "no email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Find or create user
    let userId: string | null = null;
    let generatedPassword: string | null = null;
    let isNewUser = false;

    // Try to find existing user
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => (u.email || "").toLowerCase() === email);
    if (existing) {
      userId = existing.id;
    } else {
      generatedPassword = randomPassword(14);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { full_name: order.customer_name },
      });
      if (createErr || !created.user) {
        console.error("createUser failed", createErr);
        return new Response(JSON.stringify({ error: createErr?.message || "createUser failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      userId = created.user.id;
      isNewUser = true;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "no user id" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const product = order.product || "treinamento";
    const accessProduct = normalizeAccessProduct(product);

    // Was access already granted before this call? Multiple confirm paths
    // (pix-check-status, efi-check-status, efi-reconcile-pix, webhooks) can
    // all race to call this function for the same just-paid order, and
    // member_access.upsert is safely idempotent — but generateLink() below
    // mints a NEW token every call, so a second call sends the welcome email
    // with different content under the SAME idempotency key. Resend rejects
    // that reused-key-different-body combo with a 409, and the retry loop
    // just dead-letters it — the customer never gets the email at all. Check
    // BEFORE upserting, and skip the magic-link+email step entirely on a
    // repeat call (their account/access already exists either way).
    const { data: existingAccess } = await supabase
      .from("member_access")
      .select("id")
      .eq("user_id", userId)
      .eq("product", accessProduct)
      .maybeSingle();
    const alreadyGranted = !!existingAccess;

    // Grant access (idempotent via unique user_id+product)
    await supabase.from("member_access").upsert(
      { user_id: userId, product: accessProduct, order_id: order.id, active: true },
      { onConflict: "user_id,product" },
    );

    if (alreadyGranted) {
      return new Response(
        JSON.stringify({ ok: true, user_id: userId, is_new_user: false, already_processed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Generate magic link for auto-login
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/${encodeURIComponent(accessProduct)}/membros` },
    });
    if (linkErr) console.error("generateLink failed", linkErr);
    const magicLink = linkData?.properties?.action_link || null;

    // Enqueue welcome email (best-effort) — skip for mentoria add-ons since
    // the user is already an active member.
    const isMentoriaAddon = (order.product || "").startsWith("mentoria:");
    if (!isMentoriaAddon) try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "member-welcome",
          recipientEmail: email,
          idempotencyKey: `member-welcome-${order.id}`,
          templateData: {
            name: (order.customer_name || "").split(" ")[0] || "aluno",
            email,
            password: generatedPassword,
            magicLink,
            loginUrl: `${siteUrl}/${encodeURIComponent(accessProduct)}/membros/login`,
          },
        },
      });
    } catch (e) {
      console.error("welcome email enqueue failed", e);
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, is_new_user: isNewUser, magic_link: magicLink }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("grant-member-access error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "internal" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
