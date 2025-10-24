import { TrendingUp, DollarSign, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import officeImage from "@/assets/gta-office-money.png";
const results = [{
  id: 1,
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  name: "João Pedro",
  result: "R$47.328",
  period: "em 30 dias",
  badge: "Tráfego Pago"
}, {
  id: 2,
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  name: "Mariana Santos",
  result: "R$89.432",
  period: "em 45 dias",
  badge: "E-commerce"
}, {
  id: 3,
  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
  name: "Felipe Oliveira",
  result: "R$156.890",
  period: "em 60 dias",
  badge: "Infoprodutos"
}, {
  id: 4,
  image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
  name: "Beatriz Lima",
  result: "R$23.567",
  period: "em 21 dias",
  badge: "Dropshipping"
}, {
  id: 5,
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  name: "Lucas Ferreira",
  result: "R$95.234",
  period: "em 38 dias",
  badge: "Orgânico"
}, {
  id: 6,
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  name: "Camila Rocha",
  result: "R$67.891",
  period: "em 29 dias",
  badge: "Marketing Digital"
}];
export const Results = () => {
  return <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden bg-card/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-card/50 to-background/50" />
      <div className="atmospheric-haze" />
      <div className="noise-texture" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border-2 border-accent/30 bg-accent/5 backdrop-blur-sm mb-4 sm:mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">
              Resultados Comprovados
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground">
            PRINTS QUE <span className="text-primary">FALAM POR SI</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados reais de alunos reais. Sem photoshop, sem mentira, só dinheiro no bolso.
          </p>
        </div>

        {/* Hero Image - Office Success */}
        <div className="mb-12 sm:mb-16 animate-fade-in" style={{
        animationDelay: "0.2s"
      }}>
          <Card className="overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] transition-all duration-500">
            
          </Card>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/30 text-center hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">R$24M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Gerados pelos alunos</div>
          </Card>
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/30 text-center hover:border-accent/50 transition-all duration-300 hover:scale-105">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1">+5.000</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Alunos ativos</div>
          </Card>
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/30 text-center hover:border-secondary/50 transition-all duration-300 hover:scale-105">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-secondary mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-1">94%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Taxa de sucesso</div>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map((result, index) => <Card key={result.id} className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-accent/50 transition-all duration-500 hover:scale-105 animate-slide-up" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              {/* Result Screenshot */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img src={result.image} alt={`Resultado de ${result.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-90" />

                {/* Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-accent/90 backdrop-blur-sm">
                  <span className="text-xs font-bold text-accent-foreground">
                    {result.badge}
                  </span>
                </div>

                {/* Result Amount */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary neon-glow mb-1">
                    {result.result}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    {result.period}
                  </div>
                  <div className="text-xs sm:text-sm text-foreground mt-2">
                    por <span className="font-bold">{result.name}</span>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
              </div>
            </Card>)}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="inline-block px-6 py-4 rounded-2xl bg-primary/10 backdrop-blur-sm border-2 border-primary/30">
            <p className="text-base sm:text-lg md:text-xl font-bold">
              <span className="text-primary">Esses são apenas alguns exemplos.</span>{" "}
              <span className="text-foreground">
                Todos os dias novos alunos chegam a resultados absurdos. Sua vez é AGORA.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>;
};