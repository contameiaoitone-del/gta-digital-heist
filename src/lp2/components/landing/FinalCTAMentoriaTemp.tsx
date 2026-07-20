import { Video, Clock } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import EntrarMentoriaButton from "@/lp2/components/landing/EntrarMentoriaButton";
import CountdownDesconto from "@/lp2/components/landing/CountdownDesconto";
import { supabase } from "@/integrations/supabase/client";
import { getCookie } from "@/lib/cookies";
import { getSessionId } from "@/hooks/useTracking";

// Defaults = o que a /mentoria-temp já exibe. A /mentoria reaproveita este
// componente passando outro checkout e preço cheio, sem desconto nem contador.
const CHECKOUT_URL_PADRAO = "https://checkout.infinitepay.io/jb-empreendimentoss/BxLpe73dya";
const PRECO_PADRAO = 797;
const PRECO_DE_PADRAO = 997;

type FinalCTAProps = {
  checkoutUrl?: string;
  /** valor efetivamente cobrado */
  preco?: number;
  /** valor riscado; `null` = sem desconto */
  precoDe?: number | null;
  mostrarContador?: boolean;
};

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...a: unknown[]) => void };
  if (typeof w.fbq === "function") w.fbq(...args);
}

// Ícone de marca do WhatsApp (lucide não traz ícones de marca).
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const FinalCTAMentoriaTemp = ({
  checkoutUrl = CHECKOUT_URL_PADRAO,
  preco = PRECO_PADRAO,
  precoDe = PRECO_DE_PADRAO,
  mostrarContador = true,
}: FinalCTAProps = {}) => {
  const handleEnter = async () => {
    try {
      const sessionId = getSessionId();
      const eventId = uuid();
      const pageUrl = window.location.href;
      // O botão agora leva a um checkout pago, então o evento correto é
      // InitiateCheckout (com o valor já com desconto), e não Lead.
      fbq(
        "track",
        "InitiateCheckout",
        // `source` sai da rota para distinguir /mentoria de /mentoria-temp no relatório.
        { content_name: "Mentoria - Entrada", value: preco, currency: "BRL", source: window.location.pathname.replace(/^\//, "") || "mentoria" },
        { eventID: eventId },
      );
      supabase.functions.invoke("meta-capi", {
        body: {
          event_name: "InitiateCheckout",
          event_id: eventId,
          event_source_url: pageUrl,
          session_id: sessionId,
          fbc: getCookie("_fbc") || "",
          fbp: getCookie("_fbp") || "",
          user_agent: navigator.userAgent,
          content_name: "Mentoria - Entrada",
          value: preco,
          currency: "BRL",
          page_source: "MENTORIA",
        },
      }).catch(() => {});
    } catch { /* tracking best-effort */ }
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="final-cta" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Pronto para <span className="text-purple">entrar na mentoria?</span>
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2 leading-relaxed">
              Entre agora e tenha acesso direto ao João Lucas e à comunidade de mentorados para destravar as suas vendas no WhatsApp.
            </p>

            <div className="bg-gradient-to-br from-purple/20 to-purple/5 border-2 border-purple rounded-2xl p-6 sm:p-8 mb-8 max-w-lg mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <span className="text-sm text-purple font-semibold uppercase tracking-wider">Mentoria João Lucas</span>

                <h3 className="text-base font-semibold mt-3 mb-5">O que você vai ter acesso:</h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="bg-surface-elevated/50 border border-border/50 rounded-xl p-4 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-600/15 flex items-center justify-center">
                      <WhatsAppIcon className="w-7 h-7 text-green-500" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                      Grupo de Networking com mentorados
                    </span>
                  </div>
                  <div className="bg-surface-elevated/50 border border-border/50 rounded-xl p-4 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple/15 flex items-center justify-center">
                      <Video className="w-7 h-7 text-purple" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                      Call todo sábado às 14h
                    </span>
                  </div>
                </div>

                <div className="mb-6 pt-5 border-t border-border/50">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Investimento
                  </span>

                  {precoDe != null && (
                    <div className="flex items-center justify-center gap-2.5 mb-1.5">
                      <span className="text-lg sm:text-xl text-muted-foreground line-through decoration-2">
                        R$ {precoDe}
                      </span>
                      <span className="rounded-full bg-green-600/15 border border-green-600/30 px-2.5 py-0.5 text-xs sm:text-sm font-semibold text-green-500">
                        −R$ {precoDe - preco}
                      </span>
                    </div>
                  )}

                  <span className="block text-4xl sm:text-5xl font-bold text-foreground leading-none">
                    R$ {preco}
                  </span>
                </div>

                {mostrarContador && <CountdownDesconto />}

                <EntrarMentoriaButton onClick={handleEnter} />

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Acesso válido por 3 meses
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FinalCTAMentoriaTemp;
