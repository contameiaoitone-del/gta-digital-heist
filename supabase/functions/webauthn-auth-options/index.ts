import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { generateAuthenticationOptions } from "npm:@simplewebauthn/server@13.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") return json({ error: "Missing email" }, 400);
    const normalized = email.trim().toLowerCase();

    const origin = req.headers.get("origin") || "";
    const rpID = (() => { try { return new URL(origin).hostname; } catch { return "localhost"; } })();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: userIdRow } = await admin.rpc("get_user_id_by_email", { _email: normalized });
    const userId: string | null = (userIdRow as any) || null;

    let allowCredentials: { id: string; transports?: any }[] = [];
    if (userId) {
      const { data: creds } = await admin
        .from("webauthn_credentials")
        .select("credential_id, transports")
        .eq("user_id", userId);
      allowCredentials = (creds || []).map((c: any) => ({
        id: c.credential_id,
        transports: c.transports || undefined,
      }));
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: "preferred",
    });

    await admin.from("webauthn_challenges").insert({
      email: normalized,
      challenge: options.challenge,
      type: "authentication",
    });

    return json({ options, hasCredentials: allowCredentials.length > 0 });
  } catch (e) {
    console.error("auth-options error", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});