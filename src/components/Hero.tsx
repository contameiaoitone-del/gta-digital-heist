import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/gta-hero-vice-city.png";
import { GTALogo } from "@/components/GTALogo";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Real Life Academy - Vice City" 
          className="w-full h-full object-cover opacity-20 object-[35%_center] md:object-[5%_center]" 
        />
        {/* Neon Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,hsl(var(--background)/0.6)_100%)]"></div>
        {/* Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>

      {/* Animated Color Glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-pink/5 animate-pulse"></div>

      {/* Atmospheric Effects */}
      <div className="absolute inset-0 z-0 noise-texture opacity-30"></div>
      
      {/* Retro Grid Effect - Increased opacity */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(330_85%_65%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,hsl(270_60%_70%_/_0.2)_50%,transparent_51%)] bg-[length:80px_80px]"></div>
      </div>


      {/* Content with Glassmorphism Card */}
      <div className="container mx-auto px-6 sm:px-4 z-10 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Content without card background */}
          <div className="w-full">
            {/* Logo - Centralizada */}
            <div className="mb-8 w-full flex justify-center">
              <GTALogo />
            </div>

            {/* Título Principal */}
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground font-bold max-w-3xl mx-auto leading-tight animate-slide-up" style={{
              animationDelay: "0.2s",
              textShadow: "0 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8), 0 4px 30px hsl(var(--primary) / 0.6), 2px 2px 4px rgba(0,0,0,1)"
            }}>
              Fazer dinheiro na Internet é uma <span className="text-neon-pink">Habilidade</span>.
            </h1>

            {/* Subtítulo */}
            <p className="mb-12 text-lg sm:text-xl md:text-2xl text-foreground/95 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{
              animationDelay: "0.3s",
              textShadow: "0 0 30px rgba(0,0,0,0.95), 0 0 15px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,1)"
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