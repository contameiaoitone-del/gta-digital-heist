import { useEffect } from "react";
import { PlayCircle, Layers, FileText, Sparkles, Zap, Award } from "lucide-react";
import HeroLeadMagnet from "@/lp2/components/landing/HeroLeadMagnet";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import FinalCTALeadMagnet from "@/lp2/components/landing/FinalCTALeadMagnet";
import FAQLeadMagnet from "@/lp2/components/landing/FAQLeadMagnet";
import Footer from "@/lp2/components/landing/Footer";

// Lead magnet: aula avulsa "Foto com IA" — mesma base visual da /mentoria, sem
// as seções de prova social (Problem/Testimonials) e com checkout via popup
// EFI (pagamento único, R$20, acesso vitalício) em vez de link de redirect.
const VIDEO_ID = "6a68f14e70fa6e48a81dc869";
const M3U8_ID = "6a68f13bfb3cd2dfe9f9820c";

const IndexLmFotoIA = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Vendas Foto com IA";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroLeadMagnet
        headline={
          <>
            Vendas foto com <span className="text-purple">IA</span>
          </>
        }
        videoId={VIDEO_ID}
        m3u8Id={M3U8_ID}
        buttonLabel="Adquirir Aula"
      />

      <AboutFounder
        highlights={[
          { icon: Zap, text: "6 anos rodando operações no WhatsApp" },
          { icon: Sparkles, text: "Operação de foto com IA validada" },
          { icon: Award, text: "Método testado com dinheiro real" },
        ]}
        bioParagraphs={[
          <p key="p1">
            Eu sou <strong className="text-foreground">João Lucas</strong>. Rodo operações no WhatsApp há{" "}
            <strong className="text-foreground">6 anos</strong>, e essa aula é o passo a passo que uso para vender
            fotos com IA direto pelo WhatsApp.
          </p>,
          <p key="p2">
            Não sou guru de palco. Sou operador. Cada parte dessa aula já testei com dinheiro real, funcionou na
            prática e continua rodando hoje.
          </p>,
          <p key="p3" className="text-purple font-semibold text-lg">
            Se você quer começar a vender ainda hoje, essa aula te entrega o método completo.
          </p>,
        ]}
      />

      <FinalCTALeadMagnet
        headline={
          <>
            Pronto para vender fotos com IA <span className="text-purple">no WhatsApp?</span>
          </>
        }
        subtitle="Entre agora e tenha acesso à aula completa para vender fotos com IA direto no WhatsApp."
        accessItems={[
          { icon: PlayCircle, label: "Acesse a Aula Completa de Foto Com IA na área de membros" },
          { icon: Layers, label: "Acesso a Funil de foto com IA atualizado" },
          { icon: FileText, label: "Acesso a doc com prompts de diversos nichos" },
        ]}
        product="lm_fotoia"
        productLabel="Aula Foto com IA"
        productSubtitle="Acesso vitalício à aula completa"
        buttonLabel="Adquirir Aula"
      />

      <FAQLeadMagnet
        faqs={[
          {
            question: "Como funciona a aula?",
            answer:
              "É uma aula completa e gravada sobre como vender fotos com IA no WhatsApp. Assim que a compra é aprovada, você recebe o acesso na área de membros e pode assistir quando quiser.",
          },
          {
            question: "Quanto custa?",
            answer: "R$ 20, pagamento único, sem mensalidade.",
          },
          {
            question: "Por quanto tempo eu tenho acesso?",
            answer: "Acesso vitalício — você pode assistir quantas vezes quiser, sem prazo de expiração.",
          },
          {
            question: "O que eu recebo ao comprar?",
            answer:
              "A aula completa de Foto Com IA na área de membros, o funil de foto com IA atualizado, e o documento com prompts de diversos nichos.",
          },
          {
            question: "Preciso ter experiência?",
            answer: "Não. A aula mostra o passo a passo desde o início, incluindo os prompts prontos para usar.",
          },
          {
            question: "Como faço para comprar?",
            answer:
              "É só clicar no botão Adquirir Aula, preencher seus dados e pagar via Pix ou cartão. O acesso é liberado na hora.",
          },
        ]}
      />

      <Footer />
    </div>
  );
};

export default IndexLmFotoIA;
