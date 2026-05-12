import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Handles magic link callback. Supabase puts tokens in the URL hash fragment.
const AuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const storedNext = sessionStorage.getItem("postPaymentRedirect");
    // Priorizar destino salvo após pagamento sobre o `next` do magic link,
    // pois o link gerado pelo Supabase pode trazer um produto antigo.
    const next = storedNext || params.get("next") || "/treinamento/membros";
    const productMatch = next.match(/^\/([^/]+)\/membros/);
    const loginFallback = productMatch ? `/${productMatch[1]}/membros/login` : "/treinamento/membros/login";
    if (storedNext) sessionStorage.removeItem("postPaymentRedirect");
    // The Supabase JS client auto-detects the session from the URL hash.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(next, { replace: true });
    });
    // Fallback: check now too
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(next, { replace: true });
    });
    // If no session after 5s, send to login
    const t = setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) navigate(loginFallback, { replace: true });
      });
    }, 5000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, [navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Validando seu acesso...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
