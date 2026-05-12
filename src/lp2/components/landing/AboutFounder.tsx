import { Zap, Target, Users, Award } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import joaoLucasPhoto from "@/lp2/assets/joao-lucas.jpg";

const AboutFounder = () => {
  const highlights = [
    { icon: Zap, text: "6 anos rodando operações no WhatsApp" },
    { icon: Target, text: "Operador, não guru de palco" },
    { icon: Users, text: "Criador do treinamento X1 no Pix" },
    { icon: Award, text: "Método validado com centenas de alunos" },
  ];

  return (
    <section id="quem-e-joao" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-purple text-xs sm:text-sm font-semibold uppercase tracking-wider">Quem Está Por Trás</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 leading-tight">
              Conheça o <span className="text-purple">João Lucas</span>
            </h2>
          </div>
        </ScrollAnimation>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* Photo Area */}
            <ScrollAnimation delay={0.1} className="md:col-span-2">
              <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-card border border-border overflow-hidden">
                  <img 
                    src={joaoLucasPhoto} 
                    alt="João Lucas - Criador do treinamento X1 no Pix"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-purple/5 rounded-3xl blur-2xl -z-10" />
              </div>
            </ScrollAnimation>

            {/* Bio Content */}
            <ScrollAnimation delay={0.2} className="md:col-span-3">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  {highlights.map((item, index) => (
                    <div 
                      key={index}
                      className="inline-flex items-center gap-2 bg-purple/10 border border-purple/20 rounded-full px-3 py-1.5 text-sm"
                    >
                      <item.icon className="w-4 h-4 text-purple" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Eu sou <strong className="text-foreground">João Lucas</strong>, criador do treinamento de X1 no Pix.
                    Rodo operações no WhatsApp há <strong className="text-foreground">6 anos</strong>, e meu objetivo é te entregar
                    o método completo para você ter resultado de verdade.
                  </p>
                  <p>
                    Não sou guru de palco. Sou operador. Cada aula que você vai assistir é algo que já testei
                    com dinheiro real, que já funcionou na prática e que continua rodando hoje.
                  </p>
                  <p className="text-foreground font-medium border-l-4 border-purple pl-4">
                    Minha metodologia é para pessoas sérias que estão aqui para fazer disto um negócio.
                    De forma alguma é aceitável não ter venda todos os dias.
                  </p>
                  <p className="text-purple font-semibold text-lg">
                    Se você não tiver resultado, não é por falta de método. Será por falta de execução.
                    Eu te entrego tudo que você precisa.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounder;
