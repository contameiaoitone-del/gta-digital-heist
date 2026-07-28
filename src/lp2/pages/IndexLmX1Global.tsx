import { useEffect } from "react";
import { PlayCircle, Layers, Package, Image, Globe, Zap, Users, Award } from "lucide-react";
import HeroLeadMagnet from "@/lp2/components/landing/HeroLeadMagnet";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import FinalCTALeadMagnet from "@/lp2/components/landing/FinalCTALeadMagnet";
import Footer from "@/lp2/components/landing/Footer";

// Lead magnet: aula avulsa "X1 Global" — mesma base visual da /mentoria, sem
// as seções de prova social (Problem/Testimonials) e com checkout via popup
// EFI (pagamento único, R$20, acesso vitalício) em vez de link de redirect.
const VIDEO_ID = "6a68f107f5499b858d0ae496";
const M3U8_ID = "6a68f0ee5eddf74e202138ca";

const IndexLmX1Global = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Venda no X1 Global";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroLeadMagnet
        headline={
          <>
            Venda no <span className="text-purple">x1 Global</span>
          </>
        }
        videoId={VIDEO_ID}
        m3u8Id={M3U8_ID}
        buttonLabel="Adquirir Aula"
      />

      <FinalCTALeadMagnet
        headline={
          <>
            Pronto para vender no X1 em <span className="text-purple">todo o mundo, sem limitações?</span>
          </>
        }
        subtitle="Entre agora e tenha acesso à aula completa para vender no X1 em qualquer país, sem depender de fronteira ou de um único idioma."
        accessItems={[
          { icon: PlayCircle, label: "Acesse a Aula Completa de x1 Global na área de membros" },
          { icon: Layers, label: "Acesso a 2 funis validados, em 2 idiomas diferentes" },
          { icon: Package, label: "Entregáveis Traduzidos" },
          { icon: Image, label: "Criativos Traduzidos e validados" },
          { icon: Globe, label: "Acesso a forma de recebimento global" },
        ]}
        product="lm_x1global"
        productLabel="Aula X1 Global"
        productSubtitle="Acesso vitalício à aula completa"
        buttonLabel="Adquirir Aula"
      />

      <AboutFounder
        highlights={[
          { icon: Zap, text: "6 anos rodando operações no WhatsApp" },
          { icon: Globe, text: "Vendendo X1 fora do Brasil" },
          { icon: Users, text: "Criador do treinamento X1 no Pix" },
          { icon: Award, text: "Método validado com centenas de alunos" },
        ]}
        bioParagraphs={[
          <p key="p1">
            Eu sou <strong className="text-foreground">João Lucas</strong>, criador do treinamento de X1 no Pix.
            Depois de <strong className="text-foreground">6 anos</strong> rodando essa operação no Brasil, montei a
            estrutura para vender X1 em outros países — e é exatamente esse método que você vai aprender nesta aula.
          </p>,
          <p key="p2">
            Não sou guru de palco. Sou operador. Essa é a aula prática que uso para vender no X1 fora do Brasil, sem
            depender de fronteira nem de um único idioma.
          </p>,
          <p key="p3" className="text-purple font-semibold text-lg">
            Se você já sabe vender no Brasil, essa aula te mostra como escalar isso para o mundo todo.
          </p>,
        ]}
      />

      <Footer />
    </div>
  );
};

export default IndexLmX1Global;
