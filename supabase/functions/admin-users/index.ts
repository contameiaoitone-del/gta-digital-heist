import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { requirePrivileged } from "../_shared/require-role.ts";

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
    // Auth: valida assinatura do JWT + exige role admin-level (admin|master|super_admin).
    const guard = await requirePrivileged(req);
    if ("error" in guard) return json({ error: guard.error }, guard.status);
    const callerId = guard.userId;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 400);

      const ids = list.users.map((u) => u.id);
      const emails = list.users.map((u) => (u.email || "").toLowerCase()).filter(Boolean);
      const [rolesRes, accessRes, profilesRes, ordersRes] = await Promise.all([
        admin.from("user_roles").select("user_id, role").in("user_id", ids),
        admin.from("member_access").select("user_id, product, active").in("user_id", ids),
        admin.from("profiles").select("id, full_name").in("id", ids),
        emails.length
          ? admin.from("orders").select("customer_email, customer_phone, customer_name, created_at").in("customer_email", emails).order("created_at", { ascending: false })
          : Promise.resolve({ data: [] as any[] }),
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
      const fullNameById = new Map<string, string>();
      (profilesRes.data || []).forEach((p: any) => { if (p.full_name) fullNameById.set(p.id, p.full_name); });
      const phoneByEmail = new Map<string, string>();
      const orderNameByEmail = new Map<string, string>();
      ((ordersRes as any).data || []).forEach((o: any) => {
        const e = (o.customer_email || "").toLowerCase();
        if (e && o.customer_phone && !phoneByEmail.has(e)) phoneByEmail.set(e, o.customer_phone);
        if (e && o.customer_name && !orderNameByEmail.has(e)) orderNameByEmail.set(e, o.customer_name);
      });
      const users = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name:
          fullNameById.get(u.id) ||
          (u.user_metadata as any)?.full_name ||
          orderNameByEmail.get((u.email || "").toLowerCase()) ||
          null,
        phone:
          (u.user_metadata as any)?.phone ||
          phoneByEmail.get((u.email || "").toLowerCase()) ||
          null,
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

    // NOTA: a action "set_admin" foi removida — atribuição de roles privilegiadas
    // (master) é exclusiva do painel super-admin (super-admin-create-master), nunca daqui.

    if (action === "set_access") {
      const { user_id, product = "treinamento", active } = body;
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
      const { email, password, access_treinamento, access_product, access_mentoria, full_name, phone, cpf } = body as {
        email?: string;
        password?: string;
        access_treinamento?: boolean;
        access_product?: string;
        access_mentoria?: boolean;
        full_name?: string;
        phone?: string;
        cpf?: string;
      };
      const normEmail = (email || "").trim().toLowerCase();
      if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
        return json({ error: "Email inválido" }, 400);
      }
      if (!password || password.length < 6) {
        return json({ error: "Senha deve ter pelo menos 6 caracteres" }, 400);
      }
      const userMeta: Record<string, string> = {};
      if (full_name && full_name.trim()) userMeta.full_name = full_name.trim();
      if (phone && phone.trim()) userMeta.phone = phone.trim();
      if (cpf && cpf.trim()) userMeta.cpf = cpf.trim();
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: normEmail,
        password,
        email_confirm: true,
        user_metadata: userMeta,
      });
      if (createErr || !created.user) return json({ error: createErr?.message || "createUser failed" }, 400);
      const newId = created.user.id;
      // Upsert profile
      await admin.from("profiles").upsert({
        id: newId,
        email: normEmail,
        full_name: userMeta.full_name || null,
      }, { onConflict: "id" });
      const accessRows: { user_id: string; product: string; active: boolean }[] = [];
      if (access_treinamento) accessRows.push({ user_id: newId, product: access_product || "treinamento", active: true });
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