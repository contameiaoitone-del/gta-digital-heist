import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const { order_id } = await req.json();
    if (!order_id || typeof order_id !== "string") return jsonResponse({ error: "missing_order_id" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, payment_method")
      .eq("id", order_id)
      .maybeSingle();
    if (error || !data) return jsonResponse({ error: "not_found" }, 404);

    return jsonResponse({ order_id: data.id, status: data.status, payment_method: data.payment_method });
  } catch (e) {
    console.error("efi-check-status error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
