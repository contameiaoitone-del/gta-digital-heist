import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";

const Obrigado = () => {
  const [params] = useSearchParams();
  const metodo = params.get("metodo");
  const status = params.get("status");
  const eventId = params.get("eventId") || "";
  const value = Number(params.get("value") || "67");
  const orderId = params.get("orderId") || undefined;
  const isPending = status === "pendente";
  const { trackPurchase } = useTracking();

  useEffect(() => {
    document.title = "Pagamento confirmado — InfoZap";
    if (!isPending && eventId) {
      trackPurchase({ value, eventId, orderId, productName: "InfoZap", currency: "BRL" });
    }
  }, [isPending, eventId, value, orderId, trackPurchase]);

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

        <p className="text-gray-300 mb-8 leading-relaxed">
          {isPending
            ? "Seu pagamento está sendo processado pela operadora do cartão. Assim que aprovado, você receberá os dados de acesso no e-mail cadastrado."
            : metodo === "pix"
            ? "Recebemos seu Pix. Em instantes você vai receber os dados de acesso ao InfoZap no e-mail cadastrado."
            : "Seu pagamento foi aprovado. Em instantes você vai receber os dados de acesso ao InfoZap no e-mail cadastrado."}
        </p>

        <div className="rounded-xl border p-6 text-left mb-8" style={{ borderColor: "#222", backgroundColor: "#111" }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#00ff88", fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            Próximos passos
          </h2>
          <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Verifique seu e-mail (incluindo a caixa de spam).</li>
            <li>Acesse a área de membros com o login enviado.</li>
            <li>Entre no grupo exclusivo do WhatsApp.</li>
            <li>Comece pelo módulo "Seja Bem Vindo".</li>
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
