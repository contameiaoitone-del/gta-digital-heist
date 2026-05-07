import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Shield, ShieldCheck, Headphones } from "lucide-react";

const benefits = [
  "Grupo de Networking com players do mercado",
  "Mais de 50 aulas de treinamento completo",
  "Acesso às calls ao vivo e gravadas",
  "Zapdata",
];

interface PricingCardProps {
  id?: string;
}

const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(({ id }, ref) => {
  return (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative p-8 rounded-2xl border border-secondary/30 bg-card/30 backdrop-blur-xl shadow-2xl shadow-secondary/10">
        {/* Price Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-xl text-foreground/50 line-through">
              R$ 397
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
              SEMESTRAL
            </span>
          </div>
          
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-lg text-foreground/70">6x de</span>
            <span className="text-5xl md:text-6xl font-bold text-secondary">
              R$ 36,80
            </span>
          </div>
          
          <p className="text-foreground/50 text-sm">
            ou R$ 197,00 à vista
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-secondary/20">
                <Check className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-sm text-foreground/90">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => window.open('https://pay.hub.la/MskZ6wMc6uKbAfpr2Q8M', '_blank')}
          size="lg"
          className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground text-lg py-7 h-auto font-bold shadow-lg shadow-secondary/30 transition-all"
        >
          Garantir Minha Vaga Agora
        </Button>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/30">
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="w-5 h-5 text-foreground/50" />
            <span className="text-xs text-foreground/50">Garantia de 7 dias</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <ShieldCheck className="w-5 h-5 text-foreground/50" />
            <span className="text-xs text-foreground/50">Compra 100% segura</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Headphones className="w-5 h-5 text-foreground/50" />
            <span className="text-xs text-foreground/50">Suporte VIP</span>
          </div>
        </div>
      </div>

      {/* Guarantee Text */}
      <p className="text-center text-xs text-foreground/50 mt-4 flex items-center justify-center gap-2">
        <span>🔒</span>
        Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do seu investimento.
      </p>
    </div>
  );
});

PricingCard.displayName = "PricingCard";

export default PricingCard;
