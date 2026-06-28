// Validação de role server-side para endpoints privilegiados (admin-level).
// "admin-level" = admin (legado) | master | super_admin. Valida a ASSINATURA do JWT
// (getClaims via JWKS) e lê a role com service-role. Use em toda função privilegiada.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export const ADMIN_ROLES = ["admin", "master", "super_admin"];

export type RoleGuard =
  | { userId: string; roles: string[] }
  | { error: string; status: number };

export async function requirePrivileged(req: Request): Promise<RoleGuard> {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return { error: "unauthorized", status: 401 };
  const token = auth.replace(/^Bearer\s+/i, "");

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  // getClaims valida a assinatura do JWT (JWKS) — não confiar em atob() do payload.
  const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
  const userId = claimsData?.claims?.sub as string | undefined;
  if (claimsErr || !userId) return { error: "unauthorized", status: 401 };

  const svc = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roleRows } = await svc.from("user_roles").select("role").eq("user_id", userId);
  const roles = (roleRows || []).map((r: { role: string }) => r.role);
  if (!roles.some((r) => ADMIN_ROLES.includes(r))) return { error: "forbidden", status: 403 };
  return { userId, roles };
}
