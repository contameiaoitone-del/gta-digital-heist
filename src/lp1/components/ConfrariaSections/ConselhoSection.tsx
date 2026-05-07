import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ConselhoSection = () => {
  const items = [
    {
      id: 1,
      title: "Close Friends",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(10).png"
    },
    {
      id: 2,
      title: "Call Mensal",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(11).png"
    }
  ];

  return (
    <div className="w-full">
      {/* Product Banner */}
      <Card className="w-[300px] h-[400px] bg-card border-border hover:border-primary/50 transition-all mx-auto mb-8">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <img 
              src="https://flowtech.cloud/CHINESA%201%20(12).png" 
              alt="O Conselho"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-2">O Conselho</h2>
            <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
              Proximidade e verdade. Close Friends e call mensal exclusiva.
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
            {items.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
                <Card className="w-[300px] h-[400px] bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 bg-card">
                      <h3 className="font-bold text-foreground text-center text-sm">{item.title}</h3>
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

export default ConselhoSection;
