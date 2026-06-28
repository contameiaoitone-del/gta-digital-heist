import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";

export const GuaranteeSection = () => {
  const { getCheckoutUrl } = useCheckoutUrl();
  const checkoutUrl = getCheckoutUrl("https://pay.cakto.com.br/35g8dhq_697665");
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Dark background with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Badge Side */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative w-72 h-72">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-neon-pink/40 blur-3xl rounded-full animate-glow-pulse" />
                
                {/* Badge Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Outer decorative ring with stamp effect */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-80"
                    style={{
                      background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--neon-pink)), hsl(var(--primary)), hsl(var(--neon-pink)), hsl(var(--primary)))',
                      animation: 'spin 20s linear infinite'
                    }}
                  />
                  
                  {/* Middle ring - creates stamp border effect */}
                  <div className="absolute inset-3 rounded-full bg-background/95 backdrop-blur-sm" />
                  
                  {/* Main gradient circle */}
                  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary via-neon-pink to-primary shadow-2xl shadow-primary/50" 
                       style={{
                         animation: 'pulse 3s ease-in-out infinite'
                       }}
                  />
                  
                  {/* Inner glow circle */}
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="text-8xl font-black text-white mb-1 drop-shadow-2xl" style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
                      7
                    </div>
                    <div className="text-xl font-bold text-white uppercase tracking-[0.3em] drop-shadow-lg">
                      Dias
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6 animate-fade-in text-center md:text-left" style={{ animationDelay: "200ms" }}>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Garantia de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
                  7 Dias
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Se não estiver 100% satisfeito, devolvemos seu dinheiro sem complicações.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3 text-left">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Garantia incondicional:</span> Você tem 7 dias completos para testar todo o conteúdo
                  </p>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Reembolso total:</span> Se não gostar, basta pedir e devolvemos 100% do investimento
                  </p>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Sem burocracia:</span> Processo simples e rápido, sem perguntas complicadas
                  </p>
                </div>
              </div>

              <div className="flex justify-center md:justify-start">
                <Button
                  variant="hero"
                  size="lg"
                  className="text-lg mt-6"
                  asChild
                >
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-gtm-category="checkout"
                    data-gtm-action="click"
                    data-gtm-label="guarantee-cta"
                  >
                    Entrar na Real Life Academy
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
