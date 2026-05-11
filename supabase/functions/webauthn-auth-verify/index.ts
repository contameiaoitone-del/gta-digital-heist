import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyAuthenticationResponse } from "npm:@simplewebauthn/server@10.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function b64urlToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { email, response } = await req.json();
    if (!email || !response) return json({ error: "Missing fields" }, 400);
    const normalized = String(email).trim().toLowerCase();

    const origin = req.headers.get("origin") || "";
    const expectedOrigin = origin;
    const expectedRPID = (() => { try { return new URL(origin).hostname; } catch { return "localhost"; } })();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: chRow } = await admin
      .from("webauthn_challenges")
      .select("*")
      .eq("email", normalized)
      .eq("type", "authentication")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!chRow) return json({ error: "Challenge not found or expired" }, 400);

    const credentialId: string = response.id;
    const { data: cred } = await admin
      .from("webauthn_credentials")
      .select("*")
      .eq("credential_id", credentialId)
      .maybeSingle();
    if (!cred) return json({ error: "Credential not registered" }, 400);

    // Confirm the credential belongs to a user matching the requested email
    const { data: ownerId } = await admin.rpc("get_user_id_by_email", { _email: normalized });
    if (!ownerId || ownerId !== cred.user_id) return json({ error: "Credential does not match email" }, 400);

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: chRow.challenge,
      expectedOrigin,
      expectedRPID,
      credential: {
        id: cred.credential_id,
        publicKey: b64urlToBytes(cred.public_key),
        counter: Number(cred.counter || 0),
        transports: cred.transports || undefined,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) return json({ error: "Verification failed" }, 400);

    await admin
      .from("webauthn_credentials")
      .update({
        counter: verification.authenticationInfo.newCounter,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", cred.id);
    await admin.from("webauthn_challenges").delete().eq("id", chRow.id);

    // Generate a magic link and return the hashed_token so client can verifyOtp to create a session
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalized,
    });
    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("generateLink error", linkErr);
      return json({ error: "Could not create session" }, 500);
    }

    return json({
      verified: true,
      email: normalized,
      token_hash: linkData.properties.hashed_token,
    });
  } catch (e) {
    console.error("auth-verify error", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});