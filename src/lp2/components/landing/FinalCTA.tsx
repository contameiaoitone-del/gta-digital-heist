import { useState } from "react";
import { Button } from "@/lp2/components/ui/button";
import { ArrowRight, Zap, Shield, Headphones, Check } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

const FinalCTA = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const guarantees = [
    { icon: Zap, text: "Acesso imediato" },
    { icon: Shield, text: "Plataforma segura" },
    { icon: Headphones, text: "Suporte direto" },
  ];

  const included = [
    "+40 aulas do zero ao avançado",
    "3 produtos validados entregues prontos",
    "Método validado para X1 no Pix",
    "Estrutura completa de tráfego pago",
    "Análise e otimização de métricas",
    "Estratégia de escala no WhatsApp",
    "Hacks e atalhos de operadores avançados",
  ];

  return (
    <section id="final-cta" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para{" "}
              <span className="text-purple">ter resultado de verdade?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Entre para o treinamento mais completo de X1 no Pix e tenha o método pronto para começar a faturar.
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
                <span className="text-sm text-purple font-semibold uppercase tracking-wider">Acesso Completo</span>
                <div className="mt-3 mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">R$147</span>
                  <span className="text-muted-foreground ml-2">único</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Acesso a todo o treinamento
                </p>

                <div className="bg-surface-elevated/50 border border-border/50 rounded-xl p-4 sm:p-5 mb-6 text-left">
                  <h3 className="text-base font-semibold mb-4 text-center">O que está incluso:</h3>
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
                  onClick={() => setCheckoutOpen(true)}
                  className="group text-lg w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                >
                  Quero entrar no treinamento
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Acesso imediato após a compra
            </p>
          </div>
        </ScrollAnimation>
      </div>
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        product="lp2"
        priceCents={14700}
        productLabel="Comunidade X1 no Pix"
        productSubtitle="Acesso completo ao treinamento"
      />
    </section>
  );
};

export default FinalCTA;
