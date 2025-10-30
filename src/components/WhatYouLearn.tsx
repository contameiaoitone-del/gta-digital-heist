import { DollarSign, Megaphone, Sparkles, Users, Video, Package } from "lucide-react";

const modules = [
  {
    icon: DollarSign,
    title: "Escale do Zero a R$10k/mês",
    description: "Escale do zero a R$10k/mês o mais rápido possível"
  },
  {
    icon: Megaphone,
    title: "Domine Tráfego Pago Completamente",
    description: "Meta Ads, Google Ads, Tiktok Ads 100% avançado com tudo que você precisa saber e atualizado. Aprenda e já comece a monetizar isso"
  },
  {
    icon: Sparkles,
    title: "Aprenda a Fazer Sites com IA",
    description: "Domine as ferramentas de IA para criar sites profissionais e lucrativos"
  },
  {
    icon: Users,
    title: "Networking com Alunos de Resultado",
    description: "Tenha acesso a uma comunidade exclusiva no whatsapp com alunos que já estão ganhando dinheiro de verdade e tenha acesso ao que funciona em tempo real"
  },
  {
    icon: Video,
    title: "Acompanhamento Semanal ao Vivo",
    description: "Entre em call 2x por semana e tenha um direcionamento personalizado tirando todas as suas dúvidas"
  },
  {
    icon: Package,
    title: "Infoprodutos",
    description: "Tenha acesso a estratégias e funis validados que estão funcionando no momento, funis de x1 do whatsapp, tráfego direto, tudo"
  }
];

export const WhatYouLearn = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-neon-pink/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que você vai
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              dominar
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                
                <p className="text-muted-foreground">
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
