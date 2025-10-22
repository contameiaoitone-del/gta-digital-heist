import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Zap } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 border border-primary rounded-full animate-glow-pulse">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold text-sm uppercase tracking-wider">
              Vagas Limitadas
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up">
            Transforme Sua Vida{" "}
            <span className="text-neon-pink block md:inline">AGORA</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Junte-se a milhares de pessoas que já estão construindo sua{" "}
            <span className="text-neon-cyan font-bold">liberdade financeira</span> através do mercado digital
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 transition-all">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">+5.000</div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
            </div>
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 transition-all">
              <Zap className="h-8 w-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-accent mb-1">+300</div>
              <div className="text-sm text-muted-foreground">Aulas Práticas</div>
            </div>
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 transition-all">
              <Clock className="h-8 w-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-secondary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Acesso Vitalício</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="group text-xl">
              COMEÇAR MINHA JORNADA AGORA
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Acesso imediato ao conteúdo completo • ✓ Garantia de 30 dias
            </p>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-sunset border-2 border-background"></div>
              ))}
            </div>
            <p className="text-muted-foreground">
              <span className="text-neon-cyan font-bold">287 pessoas</span> garantiram sua vaga nas últimas 24 horas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
