import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { ensurePixel } from "@/lib/metaPixel";
import { supabase } from "@/integrations/supabase/client";

const Obrigado = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const metodo = params.get("metodo");
  const status = params.get("status");
  const eventId = params.get("eventId") || "";
  const value = Number(params.get("value") || "67");
  const orderId = params.get("orderId") || undefined;
  const isPending = status === "pendente";
  const { trackPurchase } = useTracking();
  const [autoLoginState, setAutoLoginState] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  useEffect(() => {
    document.title = "Pagamento confirmado — InfoZap";
    if (!isPending && eventId) {
      ensurePixel();
      trackPurchase({ value, eventId, orderId, productName: "InfoZap", currency: "BRL" });
    }
  }, [isPending, eventId, value, orderId, trackPurchase]);

  // Try auto-login: ask edge function for a magic link and redirect.
  useEffect(() => {
    if (isPending || !orderId) return;
    let cancelled = false;
    setAutoLoginState("loading");
    (async () => {
      // Retry a few times since the webhook may not have finished yet.
      for (let i = 0; i < 6; i++) {
        if (cancelled) return;
        try {
          const { data, error } = await supabase.functions.invoke("auto-login-after-payment", {
            body: { order_id: orderId },
          });
          if (!error && (data as { magic_link?: string })?.magic_link) {
            setAutoLoginState("ready");
            window.location.href = (data as { magic_link: string }).magic_link;
            return;
          }
        } catch (_e) {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
      if (!cancelled) setAutoLoginState("failed");
    })();
    return () => {
      cancelled = true;
    };
  }, [isPending, orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#080808" }}>
      <div className="max-w-lg w-full text-center text-white">
        {isPending ? (
          <Clock className="h-16 w-16 mx-auto mb-6" style={{ color: "#ff2d78" }} />
        ) : (
          <CheckCircle2 className="h-16 w-16 mx-auto mb-6" style={{ color: "#00ff88" }} />
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
          {isPending ? "Pagamento em análise" : "Pagamento confirmado!"}
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {isPending
            ? "Seu pagamento está sendo processado pela operadora do cartão. Assim que aprovado, você receberá os dados de acesso no e-mail cadastrado."
            : metodo === "pix"
            ? "Recebemos seu Pix. Estamos liberando sua conta agora..."
            : "Seu pagamento foi aprovado. Estamos liberando sua conta agora..."}
        </p>

        {!isPending && (
          <div className="mb-6">
            {autoLoginState === "loading" && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Liberando seu acesso à área de membros...
              </div>
            )}
            {autoLoginState === "failed" && (
              <button
                onClick={() => navigate("/membros/login")}
                className="px-6 py-3 rounded-lg font-bold uppercase tracking-wide"
                style={{ backgroundColor: "#00ff88", color: "#000", fontFamily: "'Bebas Neue', cursive" }}
              >
                Acessar área de membros
              </button>
            )}
          </div>
        )}

        <div className="rounded-xl border p-6 text-left mb-8" style={{ borderColor: "#222", backgroundColor: "#111" }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#00ff88", fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            Próximos passos
          </h2>
          <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Você será logado automaticamente em instantes.</li>
            <li>Também enviamos seu login e senha no e-mail cadastrado.</li>
            <li>Comece pelo módulo "Seja Bem Vindo".</li>
            <li>Entre no grupo exclusivo do WhatsApp.</li>
          </ol>
        </div>

        <Link to="/" className="text-sm text-gray-400 hover:text-white underline">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default Obrigado;
