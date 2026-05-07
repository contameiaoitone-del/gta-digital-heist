import { 
  Zap,
  ShieldCheck,
  Wallet,
  Target,
  TrendingUp,
  Sparkles
} from "lucide-react";
import ScrollAnimation from "@/components/ui/scroll-animation";

const Features = () => {
  const reasons = [
    {
      icon: Wallet,
      name: "Começa com R$15 por dia",
      description: "Você não precisa de orçamento absurdo. R$15 já gera tráfego, ativa o funil e traz Pix na conta.",
      highlight: "Baixo investimento",
    },
    {
      icon: ShieldCheck,
      name: "Zero reembolso",
      description: "O cliente recebe o produto antes de pagar. Não tem o que devolver, não tem o que contestar.",
      highlight: "Sem dor de cabeça",
    },
    {
      icon: Zap,
      name: "Liquidez imediata",
      description: "Cada venda cai direto no Pix na hora. Sem checkout segurando seu dinheiro por 15 ou 30 dias.",
      highlight: "Pix na hora",
    },
    {
      icon: Target,
      name: "Funil 100% automático",
      description: "O funil atende, entrega e cobra sozinho. Você não precisa estar presente o dia inteiro.",
      highlight: "Roda 24/7",
    },
    {
      icon: TrendingUp,
      name: "Campanha que vira máquina",
      description: "Com o pixel configurado, o Meta Ads otimiza para o público que tem perfil de comprador.",
      highlight: "Otimização real",
    },
    {
      icon: Sparkles,
      name: "Do zero a R$1k/dia",
      description: "Operação rápida e altamente escalável. Reinveste o Pix e cresce em poucas semanas.",
      highlight: "Escala rápida",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12 sm:mb-16 px-1">
            <span className="text-purple text-xs sm:text-sm font-semibold uppercase tracking-wider">Por que funciona</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-[1.2] sm:leading-tight tracking-tight">
              O método que{" "}
              <span className="text-purple">muda o jogo</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              O cliente recebe primeiro, paga depois. Conversão de 20 a 45% — até 10x mais que modelos convencionais.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reasons.map((feature, index) => (
            <ScrollAnimation key={index} delay={index * 0.05}>
              <div 
                className="group relative bg-gradient-card border border-border rounded-2xl p-5 sm:p-6 hover:border-purple/50 transition-all duration-300 hover:shadow-glow/50 h-full"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-purple/10 border border-purple/30 rounded-full px-3 py-1 text-[10px] sm:text-xs text-purple whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {feature.highlight}
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple/20 transition-colors">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-purple" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-3 leading-tight">{feature.name}</h3>
                  <p className="text-muted-foreground text-[11px] leading-snug sm:text-base sm:leading-normal">{feature.description}</p>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
