import { 
  BookOpen, 
  Video, 
  Rocket,
  Target,
  BarChart2,
  Sparkles,
  Check,
  PlayCircle,
  TrendingUp
} from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

const WhatYouGet = () => {
  const mainBenefits = [
    {
      icon: BookOpen,
      title: "+40 Aulas Completas",
      description: "Do zero ao avançado. Aprenda a rodar operação X1 no WhatsApp com metodologia testada.",
    },
    {
      icon: Video,
      title: "3 Produtos Validados",
      description: "Entrego 3 produtos validados com fluxo de WhatsApp e entregáveis prontos pra você vender hoje.",
    },
    {
      icon: Target,
      title: "Método Validado",
      description: "O mesmo passo a passo que já gerou resultado pra centenas de alunos.",
    },
    {
      icon: Rocket,
      title: "Do Zero à Escala",
      description: "Do primeiro Pix até R$1.000/dia — tudo dentro de um treinamento só.",
    },
  ];

  const modules = [
    { icon: PlayCircle, name: "Introdução", detail: "Comece por aqui" },
    { icon: Target, name: "Low Ticket", detail: "Produtos entre R$15 a R$25" },
    { icon: BookOpen, name: "Contra Entrega", detail: "COD" },
    { icon: Sparkles, name: "Fotos com IA", detail: "Imagens profissionais com IA" },
    { icon: Video, name: "Música com IA", detail: "Músicas geradas automaticamente" },
    { icon: Rocket, name: "Dicas Avançadas", detail: "Hacks do digital" },
    { icon: TrendingUp, name: "Tráfego Pago", detail: "Estrutura completa" },
    { icon: BarChart2, name: "Escala sem Bloqueio", detail: "Escale sem perder nenhum chip" },
  ];

  const advancedContent = [
    "Tráfego avançado e estrutura de campanhas",
    "Análise e otimização de métricas",
    "Estratégias de escala validadas",
    "Hacks e atalhos de quem opera em alto nível",
  ];

  return (
    <section id="o-que-voce-recebe" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <span className="text-purple text-sm font-semibold uppercase tracking-wider">O Que Você Recebe</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-6">
              <span className="whitespace-nowrap">Tudo que você precisa para</span>{" "}
              <span className="text-purple whitespace-nowrap">ter resultado no X1</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              O treinamento completo de X1 no Pix: aulas, método validado e suporte direto.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
          {mainBenefits.map((benefit, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-purple/50 transition-all duration-300 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple/10 flex items-center justify-center mb-3 sm:mb-4">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation>
          <div className="bg-gradient-card border border-purple/30 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Módulos do treinamento</h3>
                <p className="text-sm text-muted-foreground">Trilha completa do zero ao avançado</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4">
              {modules.map((mod, index) => (
                <div key={index} className="bg-surface-elevated rounded-xl p-2 sm:p-4 text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <mod.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple" />
                  </div>
                  <h4 className="font-medium text-[10px] sm:text-sm mb-0.5 sm:mb-1">{mod.name}</h4>
                  <span className="block text-[8px] sm:text-xs text-muted-foreground mt-0.5">{mod.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Conteúdo Avançado</h3>
                <p className="text-sm text-muted-foreground">Para acelerar seus resultados</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              {advancedContent.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default WhatYouGet;
