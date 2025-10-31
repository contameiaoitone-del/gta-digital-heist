import realLifeAcademyHero from "@/assets/real-life-academy-hero.png";

export const About = () => {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Subtle grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-neon-pink/20 blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <img 
              src={realLifeAcademyHero} 
              alt="Real Life Academy - Transforme sua vida digital"
              className="relative rounded-lg shadow-2xl w-full animate-fade-in"
            />
          </div>

          {/* Content Side */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Sua jornada para a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary animate-glow-pulse">
                liberdade financeira
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Real Life Academy não é apenas mais um curso. É uma comunidade, um ecosistema completo e testado para te guiar do absoluto zero até os seus primeiros resultados na internet. Sem balela e sem enrolação, nada de curso de vender curso, ou outras porcárias do mercado; o Real Life Academy é feito para quem não sabe absolutamente nada sobre o mercado digital e mesmo quem já ganha algum dinheiro escalar seus ganhos. Com 2 pilares base sendo eles:
            </p>

            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-lg mb-2">1. Prestação de Serviço</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Aprender e dominar uma de diversas habilidades digitais altamente procuradas, e conseguir clientes cobrando por isso, é o caminho mais fácil para sair do zero sem gastar absolutamente nada e efetivamente ganhar dinheiro na internet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-lg mb-2">2. Infoprodutos</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Entenda o melhor caminho para efetivamente criar o seu próprio produto digital e como vender ele com um método validado que vai encurtar o seu caminho e fazer você ganhar dinheiro pra ontem sem ter que investir rios de dinheiro. E não, "Fundo de Funil" nada de curso de vender curso, afiliação, lowticket, lowticket na gringa, nutra, e outras porcarias que até funcionam mas você tem que gastar rios de dinheiro pra validar. Tudo que você já conhece do mercado vai ser exposto com as melhores estratégias e o que realmente está funcionando em tempo real, sempre focando em te entregar pronto o que já funciona para que você gaste pouco e consiga escalar infoprodutos no digital como nunca.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
