import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "impersonator_email";

export function ImpersonationBanner() {
  const [impersonator, setImpersonator] = useState<string | null>(null);
  useEffect(() => {
    setImpersonator(localStorage.getItem(KEY));
  }, []);
  if (!impersonator) return null;
  const exit = async () => {
    localStorage.removeItem(KEY);
    await supabase.auth.signOut();
    window.location.href = "/super";
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#d95e10] text-white text-sm px-4 py-2 flex items-center justify-between shadow-lg">
      <span>
        Você está acessando como outro usuário. Original: <strong>{impersonator}</strong>
      </span>
      <button
        onClick={exit}
        className="px-3 py-1 rounded bg-black/30 hover:bg-black/50 text-xs uppercase tracking-wider font-bold"
      >
        Sair e voltar
      </button>
    </div>
  );
}