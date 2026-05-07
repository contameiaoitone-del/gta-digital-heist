import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Module {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
}

const UnifiedModulesCarousel = () => {
  const allModules: Module[] = [
    // A Forja
    {
      id: "forja-00",
      title: "Aula 00 – Está preparado?",
      category: "A Forja",
      imageUrl: "https://flowtech.cloud/A%20FORJA02.jpg"
    },
    {
      id: "forja-01",
      title: "Módulo 1 – Construa uma Renda",
      subtitle: "Oferta, Mineração, Campanhas, Tipos de Contingência",
      category: "A Forja",
      imageUrl: "https://flowtech.cloud/A%20FORJA03.jpg"
    },
    {
      id: "forja-02",
      title: "Módulo 2 – Masculinidade",
      subtitle: "Menino X Homem, Mentalidade, Ação",
      category: "A Forja",
      imageUrl: "https://flowtech.cloud/A%20FORJA04.jpg"
    },
    {
      id: "forja-03",
      title: "Módulo 3 – Família",
      subtitle: "Construa sua própria família, Seu papel, Financeiro",
      category: "A Forja",
      imageUrl: "https://flowtech.cloud/A%20FORJA05.jpg"
    },
    // O Patriarcado
    {
      id: "patriarcado-00",
      title: "Aula 00 – Sente e ouça",
      category: "O Patriarcado",
      imageUrl: "https://flowtech.cloud/A%20FORJA07.jpg"
    },
    {
      id: "patriarcado-01",
      title: "Módulo 1 – Não cometa erros de iniciante",
      subtitle: "Segunda Fonte de Renda, O Básico, Conteúdo",
      category: "O Patriarcado",
      imageUrl: "https://flowtech.cloud/A%20FORJA08.jpg"
    },
    {
      id: "patriarcado-02",
      title: "Módulo 2 – Família",
      subtitle: "Compromisso, Blindagem Financeira",
      category: "O Patriarcado",
      imageUrl: "https://flowtech.cloud/A%20FORJA09.jpg"
    },
    {
      id: "patriarcado-03",
      title: "Módulo 3 – Os Patriarcas",
      subtitle: "Regras, Networking",
      category: "O Patriarcado",
      imageUrl: "https://flowtech.cloud/A%20FORJA10.jpg"
    },
    // O Conselho
    {
      id: "conselho-01",
      title: "Close Friends",
      category: "O Conselho",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(10).png"
    },
    {
      id: "conselho-02",
      title: "Call Mensal",
      category: "O Conselho",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(11).png"
    }
  ];

  return (
    <section className="py-20 bg-background">
      {/* Decorative Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-16"></div>
      
      <div className="container mx-auto px-4">
        {/* Introduction Text */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 uppercase tracking-wide">
            Os pilares que forjam homens de verdade.
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light">
            Da disciplina da Forja, à expansão do Patriarcado, até a proximidade do Conselho. 
            Aqui estão os módulos que moldam o homem provedor, líder e construtor de legado.
          </p>
        </div>

        {/* Unified Carousel */}
        <div className="relative max-w-7xl mx-auto px-4">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {allModules.map((module) => (
                <CarouselItem key={module.id} className="pl-2 md:pl-4 basis-[70%] sm:basis-[50%] md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 flex justify-center">
                    <Card className="w-[200px] h-[300px] md:w-[300px] md:h-[400px] bg-card border-2 border-primary/30 hover:border-primary transition-all group">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="flex-1 overflow-hidden">
                          <img 
                            src={module.imageUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 md:p-4 bg-card border-t-2 border-primary/20">
                          <div className="text-xs text-secondary mb-1 uppercase tracking-wider font-bold">
                            {module.category}
                          </div>
                          <h3 className="text-sm md:text-lg font-bold text-primary mb-1 uppercase tracking-wide line-clamp-2">
                            {module.title}
                          </h3>
                          {module.subtitle && (
                            <p className="text-xs text-foreground/60 leading-tight line-clamp-2">
                              {module.subtitle}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </div>

        {/* Bottom Decorative Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-16"></div>
      </div>
    </section>
  );
};

export default UnifiedModulesCarousel;
