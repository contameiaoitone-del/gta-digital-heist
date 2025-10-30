import gtaLaptopGrowth from "@/assets/gta-laptop-growth.png";

export const About = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Subtle grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-neon-pink/20 blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <img 
              src={gtaLaptopGrowth} 
              alt="Real Life Academy - Transforme sua vida digital"
              className="relative rounded-lg shadow-2xl w-full animate-fade-in"
            />
          </div>

          {/* Content Side */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-heading uppercase tracking-wide">
              Sua jornada para a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary animate-glow-pulse">
                liberdade financeira
              </span>
            </h2>
            
            <p className="text-lg font-body text-muted-foreground" style={{ lineHeight: "1.7" }}>
              Real Life Academy não é apenas mais um curso. É um sistema completo e testado que te guia do zero até os primeiros resultados no marketing digital.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                </div>
                <p className="font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">Método validado</span> por centenas de alunos que já transformaram suas vidas
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                </div>
                <p className="font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">Conteúdo direto ao ponto</span>, sem enrolação ou teoria desnecessária
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                </div>
                <p className="font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">Suporte especializado</span> para te guiar em cada etapa da jornada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
