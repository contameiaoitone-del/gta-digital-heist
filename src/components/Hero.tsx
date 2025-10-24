import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-hero-vice-city.png";
import { GTALogo } from "@/components/GTALogo";
import { PalmTree } from "@/components/decorative/PalmTree";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Real Life Academy - Vice City" className="w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Atmospheric Effects */}
      <div className="atmospheric-haze z-0"></div>
      <div className="god-rays z-0"></div>
      <div className="absolute inset-0 z-0 noise-texture"></div>
      
      {/* Retro Grid Effect - Reduced opacity */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(330_85%_65%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,hsl(270_60%_70%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
      </div>

      {/* Palm Tree Silhouettes - Reduced opacity for cleaner look */}
      <PalmTree size="medium" position="left" opacity={0.08} gradientId="palm1" gradientColor="hsl(270, 60%, 30%)" className="z-0" />
      <PalmTree size="large" position="right" opacity={0.1} gradientId="palm3" gradientColor="hsl(330, 85%, 40%)" className="z-0" />


      {/* Content with Glassmorphism Card */}
      <div className="container mx-auto px-6 sm:px-4 z-10 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Glassmorphism Content Card */}
          <div className="hero-content-card w-full">
            {/* Logo - Centralizada */}
            <div className="mb-8 w-full flex justify-center">
              <GTALogo />
            </div>

            {/* Título Principal */}
            <h1 className="mb-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground font-bold max-w-3xl mx-auto leading-tight animate-slide-up" style={{
              animationDelay: "0.2s",
              textShadow: "0 2px 20px hsl(var(--primary) / 0.3)"
            }}>
              Fazer dinheiro na Internet é uma <span className="text-neon-pink">Habilidade</span>.
            </h1>

            {/* Subtítulo */}
            <p className="mb-10 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{
              animationDelay: "0.3s"
            }}>
              O tempo está passando, o mundo está girando, e a única constante é a mudança implacável.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center w-full sm:w-auto animate-slide-up" style={{
              animationDelay: "0.4s"
            }}>
              <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                COMEÇAR AGORA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0"></div>
    </section>;
};