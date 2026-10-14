// Public endpoint used by /obrigado to poll for the outbound "Integração"
// webhook's response on lead-magnet purchases (lm_x1global, lm_fotoia,
// lm_low). Those products don't create an internal member account — the
// magic_link that grants access comes back in the webhook's response body
// (captured in integration_deliveries), asynchronously relative to the
// buyer's own request. This lets the thank-you page detect it and redirect.
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";
import { serviceClient } from "../_shared/pix-gateway.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const { order_id } = await req.json();
    if (!order_id || typeof order_id !== "string") {
      return jsonResponse({ error: "missing_order_id" }, 400);
    }

    const supabase = serviceClient();
    const { data } = await supabase
      .from("integration_deliveries")
      .select("magic_link")
      .eq("order_id", order_id)
      .not("magic_link", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.magic_link) return jsonResponse({ ready: true, magic_link: data.magic_link });
    return jsonResponse({ ready: false });
  } catch (e) {
    console.error("check-lm-access-link error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
