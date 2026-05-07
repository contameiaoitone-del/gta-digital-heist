import NetflixLayout from "@/components/NetflixLayout";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import VturbPlayer from "@/components/VturbPlayer";
import VideoWrapper from "@/components/VideoWrapper";
import { useEffect } from "react";
import { appendUtmToUrl, trackPixelEvent } from "@/lib/utm";

const Caminho3 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/69398c16b23ab38acf9d6389/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
              <VturbPlayer videoId="vid-69398c16b23ab38acf9d6389" />
            </VideoWrapper>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-8 relative z-10">
          {/* Description */}
          <div className="mb-8 md:mb-12 bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-6 uppercase tracking-wide">
              O que você vai ter acesso:
            </h2>
            <div className="text-foreground/80 space-y-4 leading-relaxed">
              <p>
                Close Friends conteúdo <strong>100% puro</strong>, falarei tudo que eu quiser sem filtros, e <strong>FODA-SE!</strong>
              </p>
              <p>
                Mostrarei meus problemas, soluções que criei para meus problemas, o que estou fazendo na prática.
              </p>
              <p>
                Deixarei alguns destaques salvos com tutoriais, e caixinhas de perguntas que não abro para o meu perfil aberto.
              </p>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="text-center">
            <div className="mb-6">
              <p className="text-2xl md:text-4xl font-bold text-secondary mb-2">
                R$ 37,00
              </p>
              <p className="text-sm text-foreground/60">Investimento mensal</p>
            </div>
            
            <Button 
              onClick={() => {
                trackPixelEvent('InitiateCheckout', { content_name: 'Close Friends', value: 37, currency: 'BRL' });
                window.open(appendUtmToUrl('https://pay.cakto.com.br/vo6fqyr_654355'), '_blank');
              }}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-14 py-7 h-auto uppercase tracking-widest font-bold shadow-2xl shadow-secondary/50 border-2 border-secondary animate-pulse-button transition-all"
            >
              ENTRAR AGORA
            </Button>
          </div>
        </div>
      </section>
    </NetflixLayout>
  );
};

export default Caminho3;
