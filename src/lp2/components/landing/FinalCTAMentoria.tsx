import { useEffect, useState } from "react";
import { Button } from "@/lp2/components/ui/button";
import { ArrowRight, Zap, Shield, Headphones, Check, X } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import MentoriaVideo from "@/lp2/components/landing/MentoriaVideo";
import { supabase } from "@/integrations/supabase/client";
import { getCookie } from "@/lib/cookies";
import { getSessionId } from "@/hooks/useTracking";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/KAh47hcDL0n92QXKNg3RGP?mode=gi_t";
const VTURB_ACCOUNT_ID = "574be7f8-d9bf-450a-9bfb-e024758a6c13";
const VTURB_VIDEO_ID = "6a03aa75f7dfb345ee3b3dc1";
const VTURB_M3U8_ID = "6a03aa61abc25b8656a251af";

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

const FinalCTAMentoria = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!popupOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPopupOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Otimização VTurb: _plt + preloads + dns-prefetch
    const w = window as unknown as { _plt?: number };
    if (!w._plt) {
      const perf = performance as Performance & { timeOrigin?: number };
      w._plt = perf && perf.timeOrigin ? perf.timeOrigin + perf.now() : Date.now();
    }
    const created: HTMLLinkElement[] = [];
    const addLink = (rel: string, href: string, asAttr?: string) => {
      const sel = `link[data-vturb-opt="1"][href="${href}"][rel="${rel}"]`;
      if (document.head.querySelector(sel)) return;
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (asAttr) link.setAttribute("as", asAttr);
      link.setAttribute("data-vturb-opt", "1");
      document.head.appendChild(link);
      created.push(link);
    };
    addLink("preload", `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${VTURB_VIDEO_ID}/v4/player.js`, "script");
    addLink("preload", "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js", "script");
    addLink("preload", `https://cdn.converteai.net/${VTURB_ACCOUNT_ID}/${VTURB_M3U8_ID}/main.m3u8`, "fetch");
    addLink("dns-prefetch", "https://cdn.converteai.net");
    addLink("dns-prefetch", "https://scripts.converteai.net");
    addLink("dns-prefetch", "https://images.converteai.net");
    addLink("dns-prefetch", "https://api.vturb.com.br");

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [popupOpen]);

  const guarantees = [
    { icon: Zap, text: "Acesso direto ao João Lucas" },
    { icon: Shield, text: "Grupo alinhado no mesmo objetivo" },
    { icon: Headphones, text: "Suporte direto" },
  ];

  const included = [
    "4 produtos validados — com criativos, entregáveis e funil no WhatsApp",
    "Acompanhamento direto comigo (João Lucas) em grupo",
    "Calls ao vivo sem hora pra acabar — até sua dúvida sumir",
    "Grupo de alunos alinhados no mesmo objetivo",
    "Estratégia para escolher o nicho ideal pra você",
    "Estrutura completa de tráfego e funil",
    "Plano para sua primeira venda no menor tempo possível",
  ];

  const handleEnterGroup = async () => {
    try {
      const sessionId = getSessionId();
      const eventId = uuid();
      const pageUrl = window.location.href;
      // Pixel client-side dedup
      fbq("track", "Lead", { content_name: "Mentoria - Lista de espera", source: "popup_whatsapp" }, { eventID: eventId });
      // CAPI server-side com page_source = MENTORIA
      supabase.functions.invoke("meta-capi", {
        body: {
          event_name: "Lead",
          event_id: eventId,
          event_source_url: pageUrl,
          session_id: sessionId,
          fbc: getCookie("_fbc") || "",
          fbp: getCookie("_fbp") || "",
          user_agent: navigator.userAgent,
          content_name: "Mentoria - Lista de espera",
          page_source: "MENTORIA",
        },
      }).catch(() => {});
    } catch {}
    window.open(WHATSAPP_GROUP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="final-cta" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollAnimation>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Pronto para entrar na{" "}
                <span className="text-purple">próxima turma?</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
                Entre para o grupo de espera no WhatsApp e seja avisado em primeira mão quando a próxima turma da mentoria em grupo abrir. Apenas <strong className="text-foreground">20 vagas</strong> por turma.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {guarantees.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="w-5 h-5 text-purple" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-purple/20 to-purple/5 border-2 border-purple rounded-2xl p-6 sm:p-8 mb-8 max-w-lg mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-[60px]" />
                <div className="relative z-10">
                  <span className="text-sm text-purple font-semibold uppercase tracking-wider">Mentoria João Lucas</span>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">Apenas 20 vagas</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    1 turma por mês · só quem está no grupo de espera é avisado primeiro
                  </p>

                  <div className="bg-surface-elevated/50 border border-border/50 rounded-xl p-4 sm:p-5 mb-6 text-left">
                    <h3 className="text-base font-semibold mb-4 text-center">O que você recebe na mentoria:</h3>
                    <div className="space-y-2">
                      {included.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="xl"
                    onClick={() => setPopupOpen(true)}
                    className="group text-lg w-full whitespace-normal h-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                  >
                    <span className="block leading-tight">
                      Entrar para o
                      <br />
                      grupo de espera
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {popupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-card border border-purple/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setPopupOpen(false)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-black">
              <MentoriaVideo videoId={VTURB_VIDEO_ID} accountId={VTURB_ACCOUNT_ID} className="w-full" />
            </div>

            <div className="p-4">
              <Button
                size="xl"
                onClick={handleEnterGroup}
                className="group text-base w-full whitespace-normal h-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
              >
                <span className="block leading-tight">
                  Entrar para o
                  <br />
                  grupo de espera
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinalCTAMentoria;