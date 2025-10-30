import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const GuaranteeSection = () => {
  const handleCTAClick = () => {
    window.open("https://pay.kiwify.com.br/6vO97Hd", "_blank");
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Dark background with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Badge Side */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-glow-pulse" />
                
                {/* Badge */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Outer circle with wavy edges effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-neon-pink opacity-90 animate-glow-pulse" 
                       style={{
                         clipPath: "polygon(50% 0%, 60% 5%, 70% 2%, 80% 8%, 88% 5%, 95% 12%, 98% 20%, 100% 30%, 98% 40%, 95% 50%, 98% 60%, 100% 70%, 98% 80%, 95% 88%, 88% 95%, 80% 92%, 70% 98%, 60% 95%, 50% 100%, 40% 95%, 30% 98%, 20% 92%, 12% 95%, 5% 88%, 2% 80%, 0% 70%, 2% 60%, 5% 50%, 2% 40%, 0% 30%, 2% 20%, 5% 12%, 12% 5%, 20% 8%, 30% 2%, 40% 5%)"
                       }}
                  />
                  
                  {/* Inner content */}
                  <div className="relative z-10 text-center">
                    <div className="text-8xl font-black text-white mb-2">7</div>
                    <div className="text-lg font-bold text-white uppercase tracking-wider">Dias</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
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
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Garantia incondicional:</span> Você tem 7 dias completos para testar todo o conteúdo
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Reembolso total:</span> Se não gostar, basta pedir e devolvemos 100% do investimento
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Sem burocracia:</span> Processo simples e rápido, sem perguntas complicadas
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCTAClick}
                size="lg"
                className="text-lg mt-6 animate-glow-pulse"
              >
                Entrar na Real Life Academy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
