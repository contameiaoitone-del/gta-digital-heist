import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function requireSuperAdmin(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return { error: "Missing auth", status: 401 } as const;
  const token = auth.replace(/^Bearer /i, "");
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: userData, error: ue } = await userClient.auth.getUser();
  if (ue || !userData.user) return { error: "Invalid token", status: 401 } as const;

  const admin = createClient(url, service);
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
  const isSuper = (roles || []).some((r: { role: string }) => r.role === "super_admin");
  if (!isSuper) return { error: "Forbidden", status: 403 } as const;
  return { admin, user: userData.user } as const;
}