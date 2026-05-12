import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { ensurePixel } from "@/lib/metaPixel";
import { supabase } from "@/integrations/supabase/client";

const REDIRECT_DELAY_SECONDS = 4;

const Obrigado = () => {
  const [params] = useSearchParams();
  const metodo = params.get("metodo");
  const status = params.get("status");
  const product = params.get("product") || "treinamento";
  const eventId = params.get("eventId") || "";
  const value = Number(params.get("value") || "67");
  const orderId = params.get("orderId") || undefined;
  const isPending = status === "pendente";
  const memberProduct = ["lp2", "lp2_97", "lp2_5"].includes(product) || product.startsWith("mentoria:") ? "treinamento" : product;
  const { trackPurchase } = useTracking();
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [autoLoginState, setAutoLoginState] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [countdown, setCountdown] = useState<number>(REDIRECT_DELAY_SECONDS);

  // 1) Fire Purchase Pixel ASAP on mount (deduped with CAPI via shared eventId)
  useEffect(() => {
    document.title = "Pagamento confirmado — Treinamento";
    if (!isPending && eventId) {
      ensurePixel();
      trackPurchase({ value, eventId, orderId, productName: "Treinamento", currency: "BRL" });
    }
  }, [isPending, eventId, value, orderId, trackPurchase]);

  // 2) Fetch magic link in parallel (do NOT redirect immediately — wait for countdown)
  useEffect(() => {
    if (isPending || !orderId) return;
    let cancelled = false;
    setAutoLoginState("loading");
    (async () => {
      for (let i = 0; i < 6; i++) {
        if (cancelled) return;
        try {
          const { data, error } = await supabase.functions.invoke("auto-login-after-payment", {
            body: { order_id: orderId },
          });
          if (!error && (data as { magic_link?: string })?.magic_link) {
            if (cancelled) return;
            setMagicLink((data as { magic_link: string }).magic_link);
            setAutoLoginState("ready");
            return;
          }
        } catch {
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

  // 3) Countdown timer — runs only when not pending
  useEffect(() => {
    if (isPending) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, isPending]);

  // 4) Auto-redirect when countdown hits 0 AND magic link is ready
  useEffect(() => {
    if (isPending) return;
    if (countdown > 0) return;
    if (magicLink) {
      sessionStorage.setItem("postPaymentRedirect", `/${memberProduct}/membros`);
      window.location.href = magicLink;
    }
  }, [countdown, magicLink, isPending, memberProduct]);

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
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              {autoLoginState === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {countdown > 0 && magicLink
                ? `Redirecionando para a área de membros em ${countdown}s...`
                : countdown > 0
                ? `Liberando seu acesso... (${countdown}s)`
                : autoLoginState === "failed"
                ? "Não conseguimos logar automaticamente. Use o botão abaixo."
                : "Redirecionando..."}
            </div>

            <a
              href={magicLink || `/${encodeURIComponent(memberProduct)}/membros/login`}
              onClick={() => {
                if (magicLink) sessionStorage.setItem("postPaymentRedirect", `/${memberProduct}/membros`);
              }}
              className="inline-block px-6 py-3 rounded-lg font-bold uppercase tracking-wide"
              style={{ backgroundColor: "#00ff88", color: "#000", fontFamily: "'Bebas Neue', cursive" }}
            >
              Acessar área de membros agora
            </a>
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
