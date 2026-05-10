import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const MembrosLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    document.title = "Entrar — Treinamento";
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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/membros`,
        shouldCreateUser: false,
      },
    });
    setMagicLoading(false);
    if (error) {
      const msg = /signups? not allowed|user not found|not_found/i.test(error.message)
        ? "Email não cadastrado no sistema."
        : error.message;
      toast.error(msg);
    } else toast.success("Enviamos um link de acesso pro seu email!");
  };

  const sendReset = async () => {
    if (!email) {
      toast.error("Digite seu email primeiro");
      return;
    }
    setResetLoading(true);
    // Use OTP with shouldCreateUser:false so non-existent emails are rejected.
    // Link redirects to /reset-password where user sets a new password.
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/reset-password`,
      },
    });
    setResetLoading(false);
    if (error) {
      toast.error("Email não encontrado. Verifique se você já tem cadastro.");
      return;
    }
    toast.success("Enviamos um link para redefinir sua senha!");
  };

  const inputCls = "w-full h-12 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]";

  return (
    <div className="relative min-h-screen bg-[#080808] flex flex-col">
      {/* Billboard de vídeo (estilo área de membros) */}
      <section className="relative w-full overflow-hidden h-[40vh] min-h-[260px] max-h-[420px] md:h-[45vh] md:min-h-[320px] md:max-h-[480px]">
        <video
          src="/membros-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-[#080808]/30" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col justify-end pb-6 md:pb-10">
          <h1
            className="font-gta uppercase leading-none drop-shadow-2xl select-none text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center md:text-left"
            style={{ letterSpacing: "0.02em" }}
          >
            Treinamento de <span style={{ color: "#a855f7" }}>X1</span>
          </h1>
        </div>
      </section>

      {/* Card de login — flui abaixo do banner, centralizado, sem sobreposição */}
      <div className="flex-1 flex items-start justify-center px-4 -mt-8 md:-mt-12 pb-12 relative z-10">
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
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

          <button
            onClick={sendReset}
            disabled={resetLoading}
            className="w-full mt-2 text-xs text-gray-400 hover:text-[#00ff88] disabled:opacity-60"
          >
            {resetLoading ? "Enviando..." : "Esqueci minha senha"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Acesso restrito a alunos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembrosLogin;
