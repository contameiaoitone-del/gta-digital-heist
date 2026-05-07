import { X, Check, AlertTriangle, TrendingDown, Ban, Frown } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

const Problem = () => {
  const problems = [
    { icon: AlertTriangle, text: '"Já comprei curso, segui tudo, e fiquei na mesma — ou pior."' },
    { icon: TrendingDown, text: '"Tentei drop, afiliado, tráfego direto, encapsulado… só sangrei dinheiro."' },
    { icon: Ban, text: '"Não sei por onde começar de verdade — é informação demais e ação de menos."' },
    { icon: Frown, text: '"Não tenho mais dinheiro pra arriscar. Cada real que sobra é sagrado."' },
  ];

  const solutions = [
    "Produtos validados entregues prontos pra você vender hoje",
    "O cliente recebe primeiro e paga depois — conversão de 20 a 30%",
    "Estrutura de tráfego completa: campanha que vira máquina de venda",
    "Escala sem cair chip — rodízio, múltiplos números e operação blindada",
    "Pix cai direto na sua conta, na hora, todo dia",
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12 sm:mb-16 px-1">
            <span className="text-purple text-xs sm:text-sm font-semibold uppercase tracking-wider">A Verdade Que Ninguém Te Conta</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-[1.2] sm:leading-tight tracking-tight">
              Você sabe que pode ganhar dinheiro com a internet,{" "}
              <span className="text-purple">mas por que não está funcionando? A culpa não foi sua.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Te empurraram drop, afiliado, gestão de tráfego, encapsulado — modelos que nunca foram feitos pra quem está começando do zero com pouco dinheiro no bolso. O X1 no Pix foi.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
          <ScrollAnimation delay={0.1}>
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
              <h3 className="text-base sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                Você está cansado disso?
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <problem.icon className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground">{problem.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div className="bg-card border border-purple/30 rounded-2xl p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-[60px]" />
              <h3 className="text-base sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                Imagine ter acesso a:
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm sm:text-base text-foreground">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default Problem;
