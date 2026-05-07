import NetflixLayout from "@/components/NetflixLayout";
import Header from "@/components/Header";
import VturbPlayer from "@/components/VturbPlayer";
import VideoWrapper from "@/components/VideoWrapper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ConsultoriaQuizPopup from "@/components/ConsultoriaQuizPopup";

const Call1Hora = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load main video script
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/69398c4e7e5564766d44fd7d/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    // Load Alisson testimonial video script
    const script2 = document.createElement("script");
    script2.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/693975da21e2de3c6f003d28/v4/player.js";
    script2.async = true;
    document.head.appendChild(script2);

    // Load Jeziel testimonial video script
    const script3 = document.createElement("script");
    script3.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/696801dc1fad4f3937c45330/v4/player.js";
    script3.async = true;
    document.head.appendChild(script3);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
      if (script3.parentNode) script3.parentNode.removeChild(script3);
    };
  }, []);

  const handleOpenQuiz = () => {
    setQuizOpen(true);
  };

  return (
    <NetflixLayout>
      <Header showBackButton />
      
      <section className="bg-background min-h-screen relative">
        {/* Blur effects for modern look */}
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Video at top */}
        <div className="relative z-10">
          <div className="pt-2 px-4 max-w-4xl mx-auto">
            <VideoWrapper>
              <VturbPlayer videoId="vid-69398c4e7e5564766d44fd7d" />
            </VideoWrapper>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-8 relative z-10">
          {/* Price Section */}
          <div className="text-center mb-12">
            <div className="relative w-full max-w-md mx-auto mb-8">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl" />
              <div className="relative bg-card/30 backdrop-blur-xl border border-primary/30 rounded-2xl px-6 sm:px-8 md:px-12 py-6 sm:py-8">
                <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-2">
                  Investimento único
                </p>
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-primary text-lg sm:text-2xl font-bold">R$</span>
                    <span className="text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">497</span>
                  </div>
                  <p className="text-muted-foreground/70 text-xs sm:text-sm mt-3 max-w-xs mx-auto leading-relaxed px-2">
                    Agende uma call comigo sem horário limite, vamos ficar em call até tirar todas suas dúvidas
                  </p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-4 sm:my-6" />
                  <Button 
                    onClick={handleOpenQuiz}
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm sm:text-base md:text-lg px-4 sm:px-8 md:px-14 py-5 sm:py-6 md:py-7 h-auto uppercase tracking-wider sm:tracking-widest font-bold shadow-2xl shadow-secondary/30 border border-secondary/50 animate-pulse-button transition-all rounded-xl"
                  >
                    AGENDAR CALL NO WHATSAPP
                  </Button>
              </div>
            </div>
          </div>

          {/* Alisson Video Testimonial */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide">
              Depoimento do Alisson
            </h3>
            <VideoWrapper>
              <VturbPlayer videoId="vid-693975da21e2de3c6f003d28" />
            </VideoWrapper>
          </div>

          {/* Jeziel Video Testimonial */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide">
              Depoimento Jeziel
            </h3>
            <VideoWrapper>
              <VturbPlayer videoId="vid-696801dc1fad4f3937c45330" />
            </VideoWrapper>
          </div>
        </div>
      </section>

      <ConsultoriaQuizPopup open={quizOpen} onOpenChange={setQuizOpen} />
    </NetflixLayout>
  );
};

export default Call1Hora;
