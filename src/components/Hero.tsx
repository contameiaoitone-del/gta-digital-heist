import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-beach.png";
import { GTALogo } from "@/components/GTALogo";
import { PalmTree } from "@/components/decorative/PalmTree";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Real Life Academy Hero" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Atmospheric Effects */}
      <div className="atmospheric-haze z-0"></div>
      <div className="god-rays z-0"></div>
      <div className="absolute inset-0 z-0 noise-texture"></div>
      
      {/* Retro Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(330_85%_65%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,hsl(270_60%_70%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
      </div>

      {/* Palm Tree Silhouettes - Multiple for depth */}
      <PalmTree size="medium" position="left" opacity={0.2} gradientId="palm1" gradientColor="hsl(270, 60%, 30%)" className="z-0" />
      <PalmTree size="small" position="left" opacity={0.12} gradientId="palm2" gradientColor="hsl(280, 55%, 35%)" className="z-0 left-48" />
      <PalmTree size="large" position="right" opacity={0.15} gradientId="palm3" gradientColor="hsl(330, 85%, 40%)" className="z-0" />
      <PalmTree size="medium" position="right" opacity={0.18} gradientId="palm4" gradientColor="hsl(320, 75%, 45%)" className="z-0 right-48" />


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
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 max-w-3xl mx-auto font-semibold animate-slide-up" style={{
          animationDelay: "0.2s"
        }}>
            Domine o Mercado Digital e Construa Sua Liberdade Financeira
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{
          animationDelay: "0.3s"
        }}>
            Tráfego Pago • Infoprodutos • E-commerce • IA • Prestação de Serviços • E muito mais
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{
          animationDelay: "0.4s"
        }}>
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
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm animate-slide-up" style={{
          animationDelay: "0.5s"
        }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gradient-sunset border-2 border-background"></div>)}
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
    </section>;
};