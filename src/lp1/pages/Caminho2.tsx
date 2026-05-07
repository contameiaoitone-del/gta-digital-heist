import NetflixLayout from "@/lp1/components/NetflixLayout";
import Header from "@/lp1/components/Header";
import { Button } from "@/lp1/components/ui/button";
import VturbPlayer from "@/lp1/components/VturbPlayer";
import { useEffect } from "react";
import { appendUtmToUrl, trackPixelEvent } from "@/lp1/lib/utm";

const Caminho2 = () => {
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Load VTURB script
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/69022815f5ede15e5c837a44/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <NetflixLayout>
      <Header showBackButton />
      
      <section className="bg-background min-h-screen">
        {/* Video at top with shadow effect */}
        <div className="relative">
          <div className="pt-2">
            <VturbPlayer videoId="vid-69022815f5ede15e5c837a44" />
          </div>
          {/* Bottom shadow/blur effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-8">
          {/* Description */}
          <div className="mb-8 md:mb-12 bg-card border-2 border-primary/30 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-6 uppercase tracking-wide">
              O que você vai aprender:
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 1</strong> - Reduza em até 50% de bloqueio de números</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 2</strong> - Mensagens que utilizo para reestabelecer números</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 3</strong> - Trackeamento além da etiqueta</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 4</strong> - Como destravar COMPRA MENSAGEM da tua conta em 3 dias</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 5</strong> - Como ter vários WhatsApp no iPhone</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 6</strong> - Como eu escalo meus anúncios</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Aula 7</strong> - Como criar um WhatsApp, sem cadastrar chip</span>
              </li>
            </ul>
          </div>

          {/* Price and CTA */}
          <div className="text-center">
            <div className="mb-6">
              <p className="text-2xl md:text-4xl font-bold text-secondary mb-2">
                R$ 147,00
              </p>
              <p className="text-sm text-foreground/60">Investimento único</p>
            </div>
            
            <Button 
              onClick={() => {
                trackPixelEvent('InitiateCheckout', { content_name: 'Caminho 2', value: 147, currency: 'BRL' });
                window.open(appendUtmToUrl('https://pay.hub.la/Lwkg3IQyqGa4IIVBPATv'), '_blank');
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

export default Caminho2;
