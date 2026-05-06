// Pix confirmation webhook from Efí. Efí calls this endpoint via mTLS — its
// own client cert is presented at the network layer (handled by Supabase edge
// runtime). No HMAC needed. We accept and idempotently mark orders as paid.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/efi.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  // Efí "ping": GET /webhook → 200 with empty body
  if (req.method === "GET") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    // Efí sends: { pix: [ { endToEndId, txid, valor, horario, ... } ] }
    const pixArr: Array<{ txid?: string; horario?: string }> = Array.isArray(body?.pix) ? body.pix : [];
    if (pixArr.length === 0) return jsonResponse({ ok: true, ignored: true });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    for (const p of pixArr) {
      if (!p.txid) continue;
      const paidAt = p.horario ? new Date(p.horario).toISOString() : new Date().toISOString();
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid", paid_at: paidAt, raw: { ...(p as object), webhook_received_at: new Date().toISOString() } })
        .eq("efi_txid", p.txid)
        .neq("status", "paid");
      if (error) console.error("webhook update failed", p.txid, error);
    }
    return jsonResponse({ ok: true });
  } catch (e) {
    console.error("efi-webhook error", e);
    return jsonResponse({ error: "internal" }, 500);
  }
});
