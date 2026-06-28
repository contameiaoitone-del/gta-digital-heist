import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ShareConsume = () => {
  const { product = "treinamento", token } = useParams<{ product?: string; token?: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);
  const productPath = `/${encodeURIComponent(product)}`;

  useEffect(() => {
    if (ranRef.current || !token) return;
    ranRef.current = true;
    (async () => {
      try {
        // Sign out any existing session first to avoid mixing identities
        await supabase.auth.signOut();
        const { data, error } = await supabase.functions.invoke("share-link-consume", { body: { token } });
        if (error || !data?.token_hash) {
          setError(data?.error || "Link inválido ou expirado");
          return;
        }
        const { error: otpErr } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: data.token_hash });
        if (otpErr) {
          setError(otpErr.message);
          return;
        }
        // Store expiry for the expiry watcher
        if (data.expires_at) {
          localStorage.setItem("share_session_expires_at", data.expires_at);
        } else {
          localStorage.removeItem("share_session_expires_at");
        }
        localStorage.setItem("share_session_active", "1");
        navigate(`${productPath}/membros`, { replace: true });
      } catch (e) {
        setError((e as Error).message || "Falha");
      }
    })();
  }, [token, navigate, productPath]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>Link inválido</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate(`${productPath}/membros/login`)} className="text-sm underline text-gray-400">Ir para login</button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default ShareConsume;