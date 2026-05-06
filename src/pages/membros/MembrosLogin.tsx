import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const MembrosLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  useEffect(() => {
    document.title = "Entrar — Real Life Academy";
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/membros", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (error) {
      toast.error("Email ou senha inválidos");
      return;
    }
    navigate("/membros", { replace: true });
  };

  const sendMagic = async () => {
    if (!email) {
      toast.error("Digite seu email");
      return;
    }
    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/membros` },
    });
    setMagicLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Enviamos um link de acesso pro seu email!");
  };

  const inputCls = "w-full h-12 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="max-w-md w-full">
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
            REAL LIFE <span style={{ color: "#00ff88" }}>ACADEMY</span>
          </h1>
        </Link>

        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Entrar na área de membros
          </h2>
          <p className="text-sm text-gray-400 mb-6">Use o login enviado para seu email após a compra</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputCls} placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">Senha</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={inputCls} placeholder="Sua senha" required />
            </div>
            <button type="submit" disabled={loading} className="w-full h-12 rounded-md font-bold uppercase tracking-wide disabled:opacity-60" style={{ backgroundColor: "#00ff88", color: "#000", fontFamily: "'Bebas Neue', cursive" }}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Entrar"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={sendMagic}
            disabled={magicLoading}
            className="w-full h-11 rounded-md border border-white/20 text-white text-sm hover:border-[#00ff88] disabled:opacity-60"
          >
            {magicLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Receber link de acesso por email"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Ainda não é aluno?{" "}
            <Link to="/infozap" className="underline text-gray-400 hover:text-white">
              Conheça o InfoZap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembrosLogin;
