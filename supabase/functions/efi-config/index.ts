import { corsHeaders, jsonResponse } from "../_shared/efi.ts";

// Returns the public payee code used to load the Efí JS SDK in the browser.
// This identifier is safe to expose (it's part of the SDK loader URL).
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const payee = Deno.env.get("EFI_PAYEE_CODE") ?? "";
  return jsonResponse({ payee_code: payee });
});
