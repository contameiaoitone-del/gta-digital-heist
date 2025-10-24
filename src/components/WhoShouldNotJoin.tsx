import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

const notForYou = [
  {
    title: "Você quer ficar rico da noite pro dia",
    description: "Este não é um esquema mágico. É trabalho real que gera resultados reais.",
  },
  {
    title: "Você não está disposto a implementar",
    description: "Assistir aulas não gera resultado. Você precisa AGIR e aplicar o que aprende.",
  },
  {
    title: "Você quer uma fórmula secreta",
    description: "Não existe segredo. Existe método, estratégia e execução consistente.",
  },
  {
    title: "Você adora reclamar e culpar os outros",
    description: "Se você sempre acha desculpas, esse treinamento não é pra você.",
  },
];

export const WhoShouldNotJoin = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-card/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background"></div>
      <div className="atmospheric-haze opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-slide-up">
            <span className="text-destructive font-bold text-sm uppercase tracking-wider">
              Atenção: Importante
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-6">
              A Real Life Academy{" "}
              <span className="text-destructive">NÃO É</span> Para Você Se...
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Seja honesto consigo mesmo. Este treinamento é intenso e exige comprometimento real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {notForYou.map((item, index) => (
              <Card
                key={index}
                className="p-6 bg-card/60 backdrop-blur-sm border-2 border-destructive/30 hover:border-destructive/60 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-primary/10 border-2 border-primary rounded-lg animate-fade-in">
            <p className="text-lg md:text-xl font-semibold text-foreground mb-2">
              Mas se você está pronto para trabalhar duro e mudar de vida...
            </p>
            <p className="text-primary text-2xl md:text-3xl font-bold">
              Então esse é EXATAMENTE o lugar certo para você! 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
