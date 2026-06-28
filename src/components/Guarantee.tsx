import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import luxuryImage from "@/assets/guarantee-hero.webp";

export const Guarantee = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Ocean Gradient Background */}
      <div className="absolute inset-0 bg-gradient-ocean opacity-20"></div>
      <div className="atmospheric-haze opacity-60"></div>
      
      {/* Water Reflections */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 opacity-30"
        style={{
          background: 'linear-gradient(0deg, hsl(185 85% 70% / 0.15) 0%, transparent 100%)',
          animation: 'water-shimmer 4s ease-in-out infinite'
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-sunset opacity-20 rounded-2xl blur-3xl"></div>
              <div className="relative">
                <img 
                  src={luxuryImage} 
                  alt="Garantia" 
                  className="relative rounded-2xl shadow-2xl"
                  style={{
                    border: '4px solid transparent',
                    background: 'linear-gradient(hsl(240 8% 12%), hsl(240 8% 12%)) padding-box, linear-gradient(135deg, hsl(185 85% 70%), hsl(330 100% 70%), hsl(270 85% 60%)) border-box',
                    boxShadow: '0 0 60px hsl(185 85% 70% / 0.4), 0 20px 60px rgba(0, 0, 0, 0.4)'
                  }}
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary rounded-full">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-primary font-bold text-sm uppercase tracking-wider">
                  Garantia Incondicional
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-neon-pink">TÁ PREPARADO</span> pra{" "}
                <span className="text-neon-cyan">TRABALHAR DE VERDADE</span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Ganhar dinheiro é uma habilidade. Como qualquer outra habilidade, ela pode ser aprendida, e a velocidade com que isso acontece depende do seu esforço, dos seus coaches e do ambiente de aprendizagem em que você aprende.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Nossos coaches usam os modelos de negócios que ensinam, sabem o que é preciso para ser lucrativo e são os primeiros a identificar e utilizar novas tecnologias e estratégias disruptivas sempre que elas surgem.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Não há lugar melhor no planeta para aprender a ganhar dinheiro online hoje em dia.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-foreground/80">
                    <span className="font-bold text-foreground">Sem perguntas:</span> Um único email e você recebe 100% de volta em até 24h
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-foreground/80">
                    <span className="font-bold text-foreground">Risco zero:</span> Todo o risco é nosso. Ou você ama, ou não paga nada
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-foreground/80">
                    <span className="font-bold text-foreground">Suporte VIP:</span> Acesso direto ao time por WhatsApp 24/7
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-foreground/80">
                    <span className="font-bold text-foreground">Você só perde se não tentar:</span> O único erro é ficar parado
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button variant="hero" size="xl" className="group">
                  GARANTIR MINHA VAGA AGORA
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
