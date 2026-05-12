import { Button } from "@/lp2/components/ui/button";
import { ArrowRight, Users, Crown, Calendar, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const HeroMentoria = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.load();
      const tryPlay = () => v.play().catch(() => {});
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("loadeddata", tryPlay, { once: true });
    } catch {}
  }, []);

  const scrollToCta = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex flex-col overflow-hidden">
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/lp2/hero-poster.jpg"
          // @ts-expect-error - non-standard but supported attribute
          fetchpriority="high"
          disableRemotePlayback
          className="w-full h-full object-cover"
        >
          <source src="/lp2/hero-video-mobile.mp4" type="video/mp4" media="(max-width: 640px)" />
          <source src="/lp2/hero-video.mp4" type="video/mp4" />
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
              <Crown className="w-4 h-4 text-purple" />
              <span className="text-sm text-foreground whitespace-nowrap">Mentoria 1:1 com João Lucas — 1 turma por mês</span>
            </motion.div>

            <motion.h1
              className="text-[1.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.15] sm:leading-tight tracking-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="inline">Entre para a </span>
              <span className="text-purple">lista de espera</span>
              <br />
              <span className="inline">da minha </span>
              <span className="text-purple">mentoria</span>
              <br />
              <span className="inline">e fature com </span>
              <span className="text-foreground">4 produtos validados</span>.
            </motion.h1>

            <motion.p
              className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl px-3 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <strong className="text-foreground">Acesso direto ao João Lucas</strong>. Você recebe <strong className="text-foreground">4 produtos validados</strong>, suporte para escolher seu nicho, montar sua estrutura e dar a primeira venda no <strong className="text-foreground">menor tempo possível</strong>. Apenas <strong className="text-foreground">1 turma por mês</strong>.
            </motion.p>

            <motion.div
              className="flex justify-center gap-4 sm:gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>Mentoria 1:1</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>4 produtos validados</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                <span>1 turma por mês</span>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button variant="hero" size="xl" className="group" onClick={scrollToCta}>
                Entrar para a lista de espera
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.p
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Vagas limitadas — 1 turma nova a cada mês
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMentoria;