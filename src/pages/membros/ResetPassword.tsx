import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { product = "treinamento" } = useParams<{ product?: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Redefinir senha";
    // Supabase parses recovery token from URL hash; wait for session
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Mínimo 6 caracteres");
    if (password !== confirm) return toast.error("Senhas não conferem");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada!");
    navigate(`/${encodeURIComponent(product)}/membros`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
          Redefinir senha
        </h2>
        {!ready ? (
          <div className="text-center py-8 text-gray-400 text-sm flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Validando link...
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full h-12 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]" />
            <input type="password" placeholder="Confirme a nova senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              className="w-full h-12 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]" />
            <button type="submit" disabled={loading} className="w-full h-12 rounded-md font-bold uppercase tracking-wide disabled:opacity-60"
              style={{ backgroundColor: "#00ff88", color: "#000", fontFamily: "'Bebas Neue', cursive" }}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;