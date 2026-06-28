// Lets a member change their login e-mail from the (logged-out) login screen.
// Ownership is proven by the CURRENT e-mail + password (signInWithPassword on an
// anon client). The change is applied instantly with the admin API
// (email_confirm: true) so no confirmation e-mail is needed and the password is
// preserved. Two modes:
//   - verify-only (no new_email): just checks current credentials (UI step 1)
//   - change (with new_email): verifies, then swaps the e-mail (UI step 2)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse, rateLimit, getIp } from "../_shared/efi.ts";

const BodySchema = z.object({
  old_email: z.string().trim().email().max(160),
  password: z.string().min(1).max(200),
  new_email: z.string().trim().email().max(160).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const ip = getIp(req);
    // Tighter than payments: this gates password attempts, so keep it low.
    if (!rateLimit(ip, 8, 60_000)) return jsonResponse({ error: "rate_limited" }, 429);

    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return jsonResponse({ error: "invalid" }, 400);
    const oldEmail = parsed.data.old_email.trim().toLowerCase();
    const password = parsed.data.password;
    const newEmail = parsed.data.new_email?.trim().toLowerCase();

    // 1) Prove ownership: sign in with current e-mail + password (anon client).
    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({
      email: oldEmail,
      password,
    });
    // Business outcomes (bad password, taken e-mail, …) return 200 with
    // { ok:false, error } so the client can read the code — functions.invoke
    // hides the body on non-2xx responses. Real failures still use 4xx/5xx.
    if (signInErr || !signIn?.user) {
      return jsonResponse({ ok: false, error: "invalid_credentials" });
    }
    const userId = signIn.user.id;
    // Don't keep the throwaway session around.
    await anon.auth.signOut().catch(() => {});

    // verify-only (UI step 1): credentials are valid, stop here.
    if (!newEmail) return jsonResponse({ ok: true, verified: true });

    if (newEmail === oldEmail) return jsonResponse({ ok: false, error: "same_email" });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 2) Early check that the new e-mail isn't taken (best-effort; the admin
    //    update below is the authoritative guard against duplicates).
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const taken = list?.users?.some(
      (u) => (u.email || "").toLowerCase() === newEmail && u.id !== userId,
    );
    if (taken) return jsonResponse({ ok: false, error: "email_in_use" });

    // 3) Swap the e-mail instantly, keeping the password. email_confirm:true
    //    marks it verified so the user can log in immediately with the new e-mail.
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      email: newEmail,
      email_confirm: true,
    });
    if (updErr) {
      console.error("updateUserById failed", updErr);
      if (/already|registered|exists|duplicate/i.test(updErr.message)) {
        return jsonResponse({ ok: false, error: "email_in_use" });
      }
      return jsonResponse({ error: "update_failed" }, 500);
    }

    return jsonResponse({ ok: true, changed: true });
  } catch (e) {
    console.error("change-member-email error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
