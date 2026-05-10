// Registers the webhook URL on Efí for the configured Pix key.
// Idempotent — safe to re-run.
import {
  corsHeaders,
  jsonResponse,
  getMtlsClient,
  getPixAccessToken,
  PIX_HOST,
} from "../_shared/efi.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") {
    return jsonResponse({ error: "method" }, 405);
  }

  try {
    const pixKey = Deno.env.get("EFI_PIX_KEY");
    if (!pixKey) return jsonResponse({ error: "pix_key_missing" }, 500);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const webhookUrl = `${supabaseUrl}/functions/v1/efi-webhook`;
    const token = await getPixAccessToken();

    if (req.method === "GET") {
      const verify = await fetch(
        `${PIX_HOST}/v2/webhook/${encodeURIComponent(pixKey)}`,
        {
          method: "GET",
          // @ts-ignore deno mTLS client
          client: await getMtlsClient(),
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const verifyData = await verify.json().catch(() => ({}));
      return jsonResponse({ webhook: verifyData, expected: webhookUrl });
    }

    // PUT register — `?ignorar=` + x-skip-mtls-checking tells Efí to skip
    // mTLS validation on the callback (Supabase Edge cannot accept inbound mTLS).
    const res = await fetch(
      `${PIX_HOST}/v2/webhook/${encodeURIComponent(pixKey)}?ignorar=`,
      {
        method: "PUT",
        // @ts-ignore deno mTLS client
        client: await getMtlsClient(),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-skip-mtls-checking": "true",
        },
        body: JSON.stringify({ webhookUrl }),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("webhook register failed", res.status, data);
      return jsonResponse({ error: "register_failed", status: res.status, detail: data }, 502);
    }

    const verify = await fetch(
      `${PIX_HOST}/v2/webhook/${encodeURIComponent(pixKey)}`,
      {
        method: "GET",
        // @ts-ignore deno mTLS client
        client: await getMtlsClient(),
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const verifyData = await verify.json().catch(() => ({}));

    return jsonResponse({ ok: true, registered: webhookUrl, verify: verifyData });
  } catch (e) {
    console.error("efi-register-webhook error", e);
    return jsonResponse(
      { error: "internal", message: e instanceof Error ? e.message : String(e) },
      500,
    );
  }
});
