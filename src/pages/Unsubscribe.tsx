import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "valid" | "already" | "invalid" | "done" | "error">("loading");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: SUPABASE_ANON },
        });
        const data = await res.json();
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch { setState("error"); }
    })();
  }, [token]);

  const confirm = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success || data.reason === "already_unsubscribed") setState("done");
      else setState("error");
    } catch { setState("error"); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <h1 className="font-gta text-3xl mb-4">Cancelar inscrição</h1>
        {state === "loading" && <p className="text-muted-foreground">Validando...</p>}
        {state === "valid" && (
          <>
            <p className="text-muted-foreground mb-6">
              Confirme para parar de receber emails do Treinamento X1.
            </p>
            <Button onClick={confirm} className="w-full">Confirmar cancelamento</Button>
          </>
        )}
        {state === "already" && <p className="text-muted-foreground">Você já cancelou a inscrição.</p>}
        {state === "done" && <p className="text-muted-foreground">Pronto! Você não receberá mais emails.</p>}
        {state === "invalid" && <p className="text-muted-foreground">Link inválido ou expirado.</p>}
        {state === "error" && <p className="text-destructive">Erro ao processar. Tente novamente.</p>}
      </div>
    </div>
  );
}
