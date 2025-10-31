import { Button } from "@/components/ui/button";
import { Check, Shield, Headphones } from "lucide-react";

export const SimplePricing = () => {
  const handleCTAClick = () => {
    window.open("https://pay.kirvano.com/c5dc9a65-1621-4ae1-825e-6ed36793fb6c", "_blank");
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Neon background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-neon-pink/5 to-primary/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-primary font-semibold">🔥 Oferta Exclusiva</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comece sua jornada
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
                hoje mesmo
              </span>
            </h2>
          </div>

          {/* Pricing Card */}
          <div className="relative group animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-neon-pink to-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl border border-primary/20 p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl text-muted-foreground line-through">
                    R$ 1.997
                  </span>
                  <div className="px-3 py-1 rounded-full bg-destructive/20 border border-destructive">
                    <span className="text-destructive font-bold text-sm">-70% OFF</span>
                  </div>
                </div>
                
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-2xl text-muted-foreground">12x de</span>
                  <span className="text-5xl md:text-6xl font-bold text-primary">
                    R$ 49,70
                  </span>
                </div>
                
                <p className="text-muted-foreground">
                  ou R$ 497,00 à vista
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Acesso vitalício ao treinamento completo",
                  "Aulas práticas e diretas ao ponto",
                  "Grupo exclusivo de alunos",
                  "Suporte especializado",
                  "Atualizações gratuitas"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleCTAClick}
                variant="hero"
                size="lg"
                className="w-full text-lg py-6 mb-6"
              >
                Garantir Minha Vaga Agora
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">Garantia de 7 dias</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Check className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">Compra 100% segura</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Headphones className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">Suporte VIP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Text */}
          <p className="text-center text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
            🔒 Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do seu investimento.
          </p>
        </div>
      </div>
    </section>
  );
};
