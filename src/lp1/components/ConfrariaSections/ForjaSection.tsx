import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ForjaSection = () => {
  const modules = [
    {
      id: 1,
      title: "Aula 00 – Está preparado?",
      imageUrl: "https://flowtech.cloud/CHINESA%201.png"
    },
    {
      id: 2,
      title: "Módulo 1 – Construa uma Renda",
      subtitle: "Oferta, Mineração, Campanhas, Tipos de Contingência",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(2).png"
    },
    {
      id: 3,
      title: "Módulo 2 – Masculinidade",
      subtitle: "Menino X Homem, Mentalidade, Ação",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(1).png"
    },
    {
      id: 4,
      title: "Módulo 3 – Família",
      subtitle: "Construa sua própria família, Seu papel, Financeiro",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(3).png"
    }
  ];

  return (
    <div className="w-full">
      {/* Product Banner */}
      <Card className="w-[300px] h-[400px] bg-card border-border hover:border-primary/50 transition-all mx-auto mb-8">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <img 
              src="https://flowtech.cloud/MODELREAL.png" 
              alt="A Forja"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-2">A Forja</h2>
            <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
              O início da jornada. Construa disciplina e ganhe dinheiro na internet.
            </p>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
              Acessar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules Carousel */}
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {modules.map((module) => (
              <CarouselItem key={module.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="w-[300px] h-[400px] bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <img 
                        src={module.imageUrl} 
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 bg-card">
                      <h3 className="font-bold text-foreground mb-1 text-sm">{module.title}</h3>
                      {module.subtitle && (
                        <p className="text-xs text-foreground/60 line-clamp-2">{module.subtitle}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default ForjaSection;
