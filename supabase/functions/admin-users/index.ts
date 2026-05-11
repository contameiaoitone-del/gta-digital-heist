import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Missing token" }, 401);

    // Decode JWT payload to get the caller id (sub claim).
    const token = authHeader.replace(/^Bearer\s+/i, "");
    let callerId: string | undefined;
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      callerId = payload?.sub;
    } catch (_) {
      return json({ error: "Unauthorized" }, 401);
    }
    if (!callerId) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check admin role
    const { data: roleData } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 400);

      const ids = list.users.map((u) => u.id);
      const [rolesRes, accessRes] = await Promise.all([
        admin.from("user_roles").select("user_id, role").in("user_id", ids),
        admin.from("member_access").select("user_id, product, active").in("user_id", ids),
      ]);
      const rolesByUser = new Map<string, string[]>();
      (rolesRes.data || []).forEach((r) => {
        const arr = rolesByUser.get(r.user_id) || [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      });
      const accessByUser = new Map<string, { product: string; active: boolean }[]>();
      (accessRes.data || []).forEach((a) => {
        const arr = accessByUser.get(a.user_id) || [];
        arr.push({ product: a.product, active: a.active });
        accessByUser.set(a.user_id, arr);
      });
      const users = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        roles: rolesByUser.get(u.id) || [],
        access: accessByUser.get(u.id) || [],
      }));
      return json({ users });
    }

    if (action === "set_password") {
      const { user_id, password } = body;
      if (!user_id || !password || password.length < 6)
        return json({ error: "Senha deve ter pelo menos 6 caracteres" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "set_admin") {
      const { user_id, is_admin } = body;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (is_admin) {
        const { error } = await admin
          .from("user_roles")
          .upsert({ user_id, role: "admin" }, { onConflict: "user_id,role" });
        if (error) return json({ error: error.message }, 400);
      } else {
        if (user_id === callerId) return json({ error: "Não é possível remover seu próprio admin" }, 400);
        const { error } = await admin.from("user_roles").delete().eq("user_id", user_id).eq("role", "admin");
        if (error) return json({ error: error.message }, 400);
      }
      return json({ ok: true });
    }

    if (action === "set_access") {
      const { user_id, product = "infozap", active } = body;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (active) {
        const { data: existing } = await admin
          .from("member_access")
          .select("id")
          .eq("user_id", user_id)
          .eq("product", product)
          .maybeSingle();
        if (existing) {
          await admin.from("member_access").update({ active: true }).eq("id", existing.id);
        } else {
          await admin.from("member_access").insert({ user_id, product, active: true });
        }
      } else {
        await admin.from("member_access").update({ active: false }).eq("user_id", user_id).eq("product", product);
      }
      return json({ ok: true });
    }

    if (action === "delete_user") {
      const { user_id } = body;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (user_id === callerId) return json({ error: "Não é possível excluir a si mesmo" }, 400);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reset_biometrics") {
      const { user_id } = body;
      if (!user_id) return json({ error: "user_id required" }, 400);
      const { error } = await admin.from("webauthn_credentials").delete().eq("user_id", user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "create_user") {
      const { email, password, is_admin, access_treinamento, access_mentoria } = body as {
        email?: string;
        password?: string;
        is_admin?: boolean;
        access_treinamento?: boolean;
        access_mentoria?: boolean;
      };
      const normEmail = (email || "").trim().toLowerCase();
      if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
        return json({ error: "Email inválido" }, 400);
      }
      if (!password || password.length < 6) {
        return json({ error: "Senha deve ter pelo menos 6 caracteres" }, 400);
      }
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: normEmail,
        password,
        email_confirm: true,
      });
      if (createErr || !created.user) return json({ error: createErr?.message || "createUser failed" }, 400);
      const newId = created.user.id;
      if (is_admin) {
        await admin.from("user_roles").upsert({ user_id: newId, role: "admin" }, { onConflict: "user_id,role" });
      }
      const accessRows: { user_id: string; product: string; active: boolean }[] = [];
      if (access_treinamento) accessRows.push({ user_id: newId, product: "infozap", active: true });
      if (access_mentoria) accessRows.push({ user_id: newId, product: "mentoria", active: true });
      if (accessRows.length > 0) {
        await admin.from("member_access").upsert(accessRows, { onConflict: "user_id,product" });
      }
      return json({ ok: true, user_id: newId });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});