import { corsHeaders, requireSuperAdmin } from "../_shared/super-admin-auth.ts";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const guard = await requireSuperAdmin(req);
  if ("error" in guard) return json({ error: guard.error }, guard.status);
  const { admin } = guard;
  try {
    const { user_id, password } = await req.json();
    if (!user_id || !password || String(password).length < 6) {
      return json({ error: "user_id e password (>=6) obrigatórios" }, 400);
    }
    const { error } = await admin.auth.admin.updateUserById(user_id, { password });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, 500);
  }
});