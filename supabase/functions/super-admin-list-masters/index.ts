import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, requireSuperAdmin } from "../_shared/super-admin-auth.ts";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const guard = await requireSuperAdmin(req);
  if ("error" in guard) return json({ error: guard.error }, guard.status);
  const { admin } = guard;
  try {
    const { data: list, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) return json({ error: error.message }, 400);
    const ids = list.users.map((u) => u.id);
    const [rolesRes, areasRes] = await Promise.all([
      admin.from("user_roles").select("user_id, role").in("user_id", ids),
      admin.from("member_areas").select("id, name, owner_id").in("owner_id", ids),
    ]);
    const rolesByUser = new Map<string, string[]>();
    (rolesRes.data || []).forEach((r: { user_id: string; role: string }) => {
      const arr = rolesByUser.get(r.user_id) || [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });
    const areasByUser = new Map<string, { id: string; name: string }[]>();
    (areasRes.data || []).forEach((a: { id: string; name: string; owner_id: string }) => {
      const arr = areasByUser.get(a.owner_id) || [];
      arr.push({ id: a.id, name: a.name });
      areasByUser.set(a.owner_id, arr);
    });
    const masters = list.users
      .filter((u) => (rolesByUser.get(u.id) || []).includes("master") || (rolesByUser.get(u.id) || []).includes("super_admin"))
      .map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        banned_until: (u as unknown as { banned_until?: string }).banned_until || null,
        is_super_admin: (rolesByUser.get(u.id) || []).includes("super_admin"),
        areas: areasByUser.get(u.id) || [],
      }));
    return json({ masters });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, 500);
  }
});