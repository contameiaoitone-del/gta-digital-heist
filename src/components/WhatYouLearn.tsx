import { Brain, Target, TrendingUp, Zap, Users, Rocket } from "lucide-react";

const modules = [
  {
    icon: Brain,
    title: "Mentalidade Vencedora",
    description: "Desenvolva o mindset necessário para alcançar seus objetivos"
  },
  {
    icon: Target,
    title: "Estratégias Validadas",
    description: "Aprenda métodos testados e aprovados que realmente funcionam"
  },
  {
    icon: TrendingUp,
    title: "Crescimento Acelerado",
    description: "Técnicas para escalar seus resultados de forma consistente"
  },
  {
    icon: Zap,
    title: "Ação Imediata",
    description: "Planos de ação práticos para aplicar desde o primeiro dia"
  },
  {
    icon: Users,
    title: "Networking Estratégico",
    description: "Conecte-se com pessoas que pensam grande como você"
  },
  {
    icon: Rocket,
    title: "Lançamento do Seu Negócio",
    description: "Do planejamento até os primeiros resultados financeiros"
  }
];

export const WhatYouLearn = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-neon-pink/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading uppercase tracking-wide mb-4">
            O que você vai
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              dominar
            </span>
          </h2>
          <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: "1.7" }}>
            Um sistema completo com tudo que você precisa para transformar sua vida digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-neon-pink/0 group-hover:from-primary/10 group-hover:to-neon-pink/10 transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <module.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-heading uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                
                <p className="font-body text-muted-foreground">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
