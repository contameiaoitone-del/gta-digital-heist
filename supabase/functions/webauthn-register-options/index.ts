import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  generateRegistrationOptions,
} from "npm:@simplewebauthn/server@13.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function rpFromOrigin(origin: string): { rpID: string; rpName: string } {
  try {
    const u = new URL(origin);
    return { rpID: u.hostname, rpName: "Real Life Academy" };
  } catch {
    return { rpID: "localhost", rpName: "Real Life Academy" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.replace(/^Bearer\s+/i, "");
    let userId: string | undefined;
    let userEmail = "";
    try {
      const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      userId = p?.sub;
      userEmail = p?.email || "";
    } catch { return json({ error: "Unauthorized" }, 401); }
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const origin = req.headers.get("origin") || "";
    const { rpID, rpName } = rpFromOrigin(origin);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: existing } = await admin
      .from("webauthn_credentials")
      .select("credential_id, transports")
      .eq("user_id", userId);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(userId),
      userName: userEmail || userId,
      userDisplayName: userEmail || "Membro",
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
      excludeCredentials: (existing || []).map((c: any) => ({
        id: c.credential_id,
        transports: c.transports || undefined,
      })),
    });

    await admin.from("webauthn_challenges").insert({
      user_id: userId,
      challenge: options.challenge,
      type: "registration",
    });

    return json({ options, rpID });
  } catch (e) {
    console.error("register-options error", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});