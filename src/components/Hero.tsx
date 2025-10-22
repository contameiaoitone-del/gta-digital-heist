import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-beach.png";
import { GTALogo } from "@/components/GTALogo";

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

      {/* Atmospheric Effects */}
      <div className="atmospheric-haze z-0"></div>
      <div className="absolute inset-0 z-0 noise-texture"></div>
      
      {/* Retro Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(330_85%_65%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,hsl(270_60%_70%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
      </div>

      {/* Palm Tree Silhouettes */}
      <div className="absolute bottom-0 left-0 w-64 h-96 opacity-20 z-0 hidden md:block">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="palmGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 60%, 30%)" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path d="M100 300 L105 200 Q108 180 110 160 L108 140 Q107 120 105 100" stroke="url(#palmGradient1)" strokeWidth="4" fill="none"/>
          <path d="M105 120 Q80 100 60 90 Q40 85 20 85" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
          <path d="M105 125 Q90 110 75 105 Q60 102 45 105" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
          <path d="M105 115 Q120 95 140 85 Q160 80 180 82" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
          <path d="M105 120 Q115 105 125 100 Q140 95 155 98" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
          <path d="M105 130 Q95 145 85 155 Q75 165 65 175" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
          <path d="M105 130 Q115 145 125 155 Q135 165 145 175" stroke="url(#palmGradient1)" strokeWidth="3" fill="none"/>
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 w-72 h-[28rem] opacity-15 z-0 hidden lg:block">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="palmGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(330, 85%, 40%)" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path d="M100 300 L95 180 Q92 160 90 140 L92 120 Q93 100 95 80" stroke="url(#palmGradient2)" strokeWidth="5" fill="none"/>
          <path d="M95 100 Q70 80 50 70 Q30 65 10 65" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 105 Q80 90 65 85 Q50 82 35 85" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 95 Q110 75 130 65 Q150 60 170 62" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 100 Q105 85 115 80 Q130 75 145 78" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 110 Q85 125 75 135 Q65 145 55 155" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 110 Q105 125 115 135 Q125 145 135 155" stroke="url(#palmGradient2)" strokeWidth="4" fill="none"/>
          <path d="M95 108 Q100 90 105 80 Q110 70 115 65" stroke="url(#palmGradient2)" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="px-6 py-2 bg-primary/20 border border-primary text-primary rounded-full text-sm font-bold uppercase tracking-wider shadow-soft-pink animate-glow-pulse">
              O Treinamento Mais Completo do Brasil
            </span>
          </div>

          {/* GTA-Style Logo */}
          <GTALogo />

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
