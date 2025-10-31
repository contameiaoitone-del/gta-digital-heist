import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import result1 from "@/assets/result-1.jpeg";
import result2 from "@/assets/result-2.jpeg";
import result3 from "@/assets/result-3.jpeg";
import result4 from "@/assets/result-4.jpeg";
import result5 from "@/assets/result-5.jpeg";
import result6 from "@/assets/result-6.jpeg";
import result7 from "@/assets/result-7.jpeg";

const results = [
  { image: result1, alt: "Resultados de vendas - Bryan Santos" },
  { image: result2, alt: "Dashboard de lucros - R$ 4.055,79" },
  { image: result3, alt: "Pagamentos recebidos - Matheus" },
  { image: result4, alt: "Notificações de vendas - Bryan Santos" },
  { image: result5, alt: "Pagamentos Pix - Natan Piovezan" },
  { image: result6, alt: "Investimentos recebidos - Natan Piovezan" },
  { image: result7, alt: "Extrato de pagamentos recebidos" }
];

export const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Resultados Reais de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              Membros Reais
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como nossos membros estão transformando conhecimento em resultados mensuráveis.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                >
                  <div className="group relative rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 mx-2">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-neon-pink/0 group-hover:from-primary/10 group-hover:to-neon-pink/10 transition-all duration-300" />
                    
                    <div className="relative z-10">
                      <img
                        src={result.image}
                        alt={result.alt}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
