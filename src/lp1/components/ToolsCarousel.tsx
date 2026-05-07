import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import geradorFunilX1 from "@/assets/tools/gerador-funil-x1.png";
import organizadorNumeros from "@/assets/tools/organizador-numeros.png";
import trackOfertas from "@/assets/tools/track-ofertas.png";
import zapSpy from "@/assets/tools/zap-spy.png";
import geradorCriativoImagem from "@/assets/tools/gerador-criativo-imagem.png";
import geradorCriativoVideo from "@/assets/tools/gerador-criativo-video.png";
import geradorEntregavel from "@/assets/tools/gerador-entregavel.png";
import geradorAudio from "@/assets/tools/gerador-audio.png";
import transcricaoAudio from "@/assets/tools/transcricao-audio.png";
import analisadorCriativo from "@/assets/tools/analisador-criativo.png";
import automacaoWhatsapp from "@/assets/tools/automacao-whatsapp.png";
import maturadorWhatsapp from "@/assets/tools/maturador-whatsapp.png";
import etiquetadorWhatsapp from "@/assets/tools/etiquetador-whatsapp.png";
import analiseMetricasIa from "@/assets/tools/analise-metricas-ia.png";

const tools = [
  { id: 1, image: geradorFunilX1, name: "Gerador de Funil de X1" },
  { id: 2, image: organizadorNumeros, name: "Organizador de Números" },
  { id: 3, image: trackOfertas, name: "Track Ofertas" },
  { id: 4, image: zapSpy, name: "Zap Spy" },
  { id: 5, image: geradorCriativoImagem, name: "Gerador de Criativo em Imagem" },
  { id: 6, image: geradorCriativoVideo, name: "Gerador de Criativo em Vídeo" },
  { id: 7, image: geradorEntregavel, name: "Gerador de Entregável" },
  { id: 8, image: geradorAudio, name: "Gerador de Áudio" },
  { id: 9, image: transcricaoAudio, name: "Transcrição de Áudio" },
  { id: 10, image: analisadorCriativo, name: "Analisador de Criativo" },
  { id: 11, image: automacaoWhatsapp, name: "Automação de WhatsApp" },
  { id: 12, image: maturadorWhatsapp, name: "Maturador de WhatsApp" },
  { id: 13, image: etiquetadorWhatsapp, name: "Etiquetador de WhatsApp" },
  { id: 14, image: analiseMetricasIa, name: "Análise de Métricas com IA" },
];

const ToolsCarousel = () => {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {tools.map((tool) => (
            <CarouselItem 
              key={tool.id} 
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-secondary/50">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 bg-secondary/20 border-secondary/50 hover:bg-secondary/40" />
        <CarouselNext className="hidden md:flex -right-4 bg-secondary/20 border-secondary/50 hover:bg-secondary/40" />
      </Carousel>
    </div>
  );
};

export default ToolsCarousel;
