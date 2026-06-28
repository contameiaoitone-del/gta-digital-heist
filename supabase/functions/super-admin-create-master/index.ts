import { corsHeaders, requireSuperAdmin } from "../_shared/super-admin-auth.ts";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const guard = await requireSuperAdmin(req);
  if ("error" in guard) return json({ error: guard.error }, guard.status);
  const { admin } = guard;
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const fullName = body.full_name ? String(body.full_name) : null;
    if (!email || password.length < 6) return json({ error: "Email e senha (mínimo 6 caracteres) obrigatórios." }, 400);

    const { data: created, error: ce } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : {},
    });
    if (ce || !created.user) return json({ error: ce?.message || "Falha ao criar usuário" }, 400);
    const userId = created.user.id;
    await admin.from("profiles").upsert({ id: userId, email, full_name: fullName }, { onConflict: "id" });
    await admin.from("user_roles").upsert({ user_id: userId, role: "master" }, { onConflict: "user_id,role" });
    return json({ ok: true, user_id: userId });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, 500);
  }
});