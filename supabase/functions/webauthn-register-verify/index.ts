import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyRegistrationResponse } from "npm:@simplewebauthn/server@10.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function bytesToB64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.replace(/^Bearer\s+/i, "");
    let userId: string | undefined;
    try {
      const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      userId = p?.sub;
    } catch { return json({ error: "Unauthorized" }, 401); }
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const { response, deviceName } = await req.json();
    if (!response) return json({ error: "Missing response" }, 400);

    const origin = req.headers.get("origin") || "";
    const expectedOrigin = origin;
    const expectedRPID = (() => { try { return new URL(origin).hostname; } catch { return "localhost"; } })();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: chRow } = await admin
      .from("webauthn_challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "registration")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!chRow) return json({ error: "Challenge not found or expired" }, 400);

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: chRow.challenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return json({ error: "Verification failed" }, 400);
    }

    const { credential } = verification.registrationInfo as any;
    // simplewebauthn v10: registrationInfo.credential = { id, publicKey, counter, transports }
    const credentialId: string = credential.id; // already base64url
    const publicKey: string = bytesToB64url(credential.publicKey);
    const counter: number = credential.counter ?? 0;
    const transports: string[] | undefined = credential.transports;

    await admin.from("webauthn_credentials").insert({
      user_id: userId,
      credential_id: credentialId,
      public_key: publicKey,
      counter,
      transports: transports || [],
      device_name: deviceName || null,
    });

    await admin.from("webauthn_challenges").delete().eq("id", chRow.id);

    return json({ verified: true });
  } catch (e) {
    console.error("register-verify error", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});