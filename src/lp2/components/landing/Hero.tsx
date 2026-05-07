import { Button } from "@/lp2/components/ui/button";
import { ArrowRight, Zap, BookOpen, Rocket, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { trackCustomEvent } from "@/lp2/lib/tracking";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Force immediate load and playback as soon as possible
    try {
      v.load();
      const tryPlay = () => v.play().catch(() => {});
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("loadeddata", tryPlay, { once: true });
    } catch {}
  }, []);
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Video Banner - Horizontal at top */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          // @ts-expect-error - non-standard but supported attribute
          fetchpriority="high"
          disableRemotePlayback
          className="w-full h-full object-cover"
        >
          <source src="/hero-video-mobile.mp4" type="video/mp4" media="(max-width: 640px)" />
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </div>

      <div className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-2 bg-purple/20 backdrop-blur-sm border border-purple/40 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Zap className="w-4 h-4 text-purple" />
              <span className="text-sm text-foreground whitespace-nowrap">Método X1 no Pix — Pay After Delivery</span>
            </motion.div>

            <motion.h1 
              className="text-[1.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.15] sm:leading-tight tracking-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="inline">Faça sua </span>
              <span className="text-purple">primeira venda</span>
              <br />
              <span className="inline">em 7 dias no </span>
              <span className="text-purple">WhatsApp</span>
              <br />
              <span className="inline">sem </span>
              <span className="text-foreground">estoque</span>
              <span className="inline">, sem </span>
              <span className="text-foreground">aparecer.</span>
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl px-3 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <strong className="text-foreground">Produtos validados</strong> entregues prontos, <strong className="text-foreground">estrutura de tráfego completa</strong> e o método pra <strong className="text-foreground">escalar sem cair chip</strong>. O cliente recebe primeiro e paga depois — conversão de até 45%.
            </motion.p>

            <motion.div 
              className="flex justify-center gap-4 sm:gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>Produtos validados</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>Tráfego completo</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>Escala sem cair chip</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a 
                href="#final-cta"
                onClick={(e) => {
                  e.preventDefault();
                  trackCustomEvent('ClickCTA', { location: 'hero' });
                  document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Button variant="hero" size="xl" className="group">
                  Quero meu acesso agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>

            <motion.p 
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Acesso imediato após a compra
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
