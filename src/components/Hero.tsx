import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-hero-vice-city.png";
import { GTALogo } from "@/components/GTALogo";
import { PalmTree } from "@/components/decorative/PalmTree";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Real Life Academy - Vice City" className="w-full h-full object-cover opacity-40" />
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
      <PalmTree size="small" position="left" opacity={0.12} gradientId="palm2" gradientColor="hsl(280, 55%, 35%)" className="z-0 left-48 hidden sm:block" />
      <PalmTree size="large" position="right" opacity={0.15} gradientId="palm3" gradientColor="hsl(330, 85%, 40%)" className="z-0" />
      <PalmTree size="medium" position="right" opacity={0.18} gradientId="palm4" gradientColor="hsl(320, 75%, 45%)" className="z-0 right-48 hidden sm:block" />


      {/* Content */}
      <div className="container mx-auto px-6 sm:px-4 z-10 text-center animate-fade-in">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="mb-4 sm:mb-6 inline-block">
            
          </div>

          {/* Logo - Centralizada */}
          <div className="mb-4 w-full flex justify-center">
            <GTALogo />
          </div>

          {/* Título Principal */}
          <p className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/90 max-w-3xl mx-auto font-semibold animate-slide-up" style={{
          animationDelay: "0.2s"
        }}>
            Fazer dinheiro na Internet é uma <span className="text-neon-pink">Habilidade</span>.
          </p>

          {/* Subtítulo */}
          <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{
          animationDelay: "0.3s"
        }}>
            O tempo está passando, o mundo está girando, e a única constante é a mudança implacável.
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 sm:mb-10 flex justify-center items-center w-full sm:w-auto animate-slide-up" style={{
          animationDelay: "0.4s"
        }}>
            <Button variant="hero" size="lg" className="group w-full sm:w-auto">
              COMEÇAR AGORA
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center text-xs sm:text-sm animate-slide-up" style={{
          animationDelay: "0.5s"
        }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-sunset border-2 border-background"></div>)}
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