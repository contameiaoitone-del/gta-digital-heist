import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function SuperLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      if ((roles || []).some((r) => r.role === "super_admin")) navigate("/super", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (authErr || !data.session) {
      setLoading(false);
      setError("Credenciais inválidas.");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id);
    const isSuper = (roles || []).some((r) => r.role === "super_admin");
    if (!isSuper) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Esta conta não tem acesso ao painel super admin.");
      return;
    }
    navigate("/super", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0a0a] p-6">
        <h1 className="font-gta text-2xl tracking-wide mb-1">Super Admin</h1>
        <p className="text-xs text-gray-400 mb-5">Acesso restrito ao administrador supremo.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#d95e10]"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#d95e10]"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-[#ff2d78]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d95e10] text-white font-semibold rounded py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}