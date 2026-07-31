import { useEffect } from "react";
import { PlayCircle, Unlock, Layers, Image, Package, Zap, DollarSign, Users, Award } from "lucide-react";
import HeroLeadMagnet from "@/lp2/components/landing/HeroLeadMagnet";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import Testimonials from "@/lp2/components/landing/Testimonials";
import FinalCTALeadMagnet from "@/lp2/components/landing/FinalCTALeadMagnet";
import Footer from "@/lp2/components/landing/Footer";

// Lead magnet: aula avulsa "Low Ticket" — mesma base visual/estrutura da
// /lm-x1global, sem as seções de prova social originais (Problem) e com
// checkout via popup EFI (pagamento único, R$20, acesso vitalício) em vez de
// link de redirect. Depoimentos reaproveitados da /lp97-vsl.
const VIDEO_ID = "6a6be49eeca3624392c511b3";
const M3U8_ID = "6a6be48471817d32ae643087";

const IndexLmLow = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Venda Low Ticket no WhatsApp";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroLeadMagnet
        headline={
          <>
            Venda <span className="text-purple">low ticket</span> no WhatsApp
          </>
        }
        videoId={VIDEO_ID}
        m3u8Id={M3U8_ID}
        buttonLabel="Adquirir Aula"
      />

      <Testimonials />

      <FinalCTALeadMagnet
        headline={
          <>
            Pronto para vender low ticket <span className="text-purple">todos os dias no WhatsApp?</span>
          </>
        }
        subtitle="Entre agora e tenha acesso ao aulão completo de low ticket, com ofertas, criativos e entregáveis já validados."
        accessItems={[
          { icon: PlayCircle, label: "Acesso ao aulão completo de low ticket" },
          { icon: Unlock, label: "Como desbloquear as 4 metas de desempenho ocultas" },
          { icon: Layers, label: "Acesso a 5 ofertas" },
          { icon: Image, label: "Acesso a 5 criativos validados" },
          { icon: Package, label: "Acesso a todos os entregáveis" },
        ]}
        product="lm_low"
        productLabel="Aula Low Ticket"
        productSubtitle="Acesso vitalício à aula completa"
        buttonLabel="Adquirir Aula"
      />

      <AboutFounder
        highlights={[
          { icon: Zap, text: "6 anos rodando operações no WhatsApp" },
          { icon: DollarSign, text: "Especialista em low ticket" },
          { icon: Users, text: "Criador do treinamento X1 no Pix" },
          { icon: Award, text: "Método validado com centenas de alunos" },
        ]}
        bioParagraphs={[
          <p key="p1">
            Eu sou <strong className="text-foreground">João Lucas</strong>, criador do treinamento de X1 no Pix.
            Rodo operações de low ticket no WhatsApp há <strong className="text-foreground">6 anos</strong> — e esse
            aulão é o método completo que uso pra vender todos os dias.
          </p>,
          <p key="p2">
            Não sou guru de palco. Sou operador. Essa é a aula prática que uso pra vender low ticket, com ofertas e
            criativos já validados prontos pra usar.
          </p>,
          <p key="p3" className="text-purple font-semibold text-lg">
            Se você quer começar a faturar com pouco investimento, esse aulão te dá o caminho mais curto.
          </p>,
        ]}
      />

      <Footer />
    </div>
  );
};

export default IndexLmLow;
