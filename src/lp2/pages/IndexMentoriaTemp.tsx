import { useEffect } from "react";
import HeroMentoriaTemp from "@/lp2/components/landing/HeroMentoriaTemp";
import Problem from "@/lp2/components/landing/Problem";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import TestimonialsMentoria from "@/lp2/components/landing/TestimonialsMentoria";
import FinalCTAMentoriaTemp from "@/lp2/components/landing/FinalCTAMentoriaTemp";
import FAQMentoriaTemp from "@/lp2/components/landing/FAQMentoriaTemp";
import Footer from "@/lp2/components/landing/Footer";

// Mesmo conteúdo, preço e checkout da /mentoria: R$ 997 cheio, sem desconto
// nem contador, apontando para o mesmo link.
const CHECKOUT_MENTORIA = "https://checkout.infinitepay.io/jb-empreendimentoss/7WrU4PGAWN";

const IndexMentoriaTemp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Mentoria";
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroMentoriaTemp />
      <Problem
        solutions={[
          "O cliente recebe primeiro e paga depois — conversão de 20 a 30%",
          "Estrutura de tráfego completa: campanha que vira máquina de venda",
          "Escala sem cair chip — rodízio, múltiplos números e operação blindada",
          "Pix cai direto na sua conta, na hora, todo dia",
        ]}
      />
      <AboutFounder />
      <TestimonialsMentoria subtitle="Resultados reais de quem já passou pela mentoria em grupo:" />
      <FinalCTAMentoriaTemp
        checkoutUrl={CHECKOUT_MENTORIA}
        preco={997}
        precoDe={null}
        mostrarContador={false}
      />
      <FAQMentoriaTemp respostaPreco="R$ 997, com acesso válido por 3 meses." />
      <Footer />
    </div>
  );
};

export default IndexMentoriaTemp;
