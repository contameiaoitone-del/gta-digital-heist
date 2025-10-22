import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-beach.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Real Life Academy Hero" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Neon Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(328_100%_54%_/_0.3)_50%,transparent_51%)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,hsl(328_100%_54%_/_0.3)_50%,transparent_51%)] bg-[length:40px_40px]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="px-6 py-2 bg-primary/20 border border-primary text-primary rounded-full text-sm font-bold uppercase tracking-wider shadow-neon-pink animate-glow-pulse">
              O Treinamento Mais Completo do Brasil
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none animate-slide-up">
            <span className="block text-neon-pink drop-shadow-[0_0_30px_rgba(255,20,147,0.8)]">
              REAL LIFE
            </span>
            <span className="block text-neon-cyan drop-shadow-[0_0_30px_rgba(0,217,255,0.8)]">
              ACADEMY
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 max-w-3xl mx-auto font-semibold animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Domine o Mercado Digital e Construa Sua Liberdade Financeira
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            Tráfego Pago • Infoprodutos • E-commerce • IA • Prestação de Serviços • E muito mais
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" className="group">
              COMEÇAR AGORA
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="neon" size="xl" className="group">
              <Play className="mr-2 h-5 w-5" />
              ASSISTIR DEMO
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-sunset border-2 border-background"></div>
                ))}
              </div>
              <span className="text-muted-foreground">
                <span className="text-neon-pink font-bold">+5.000</span> alunos ativos
              </span>
            </div>
            <div className="text-muted-foreground">
              ⭐⭐⭐⭐⭐ <span className="text-neon-cyan font-bold">4.9/5</span> de avaliação
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0"></div>
    </section>
  );
};
