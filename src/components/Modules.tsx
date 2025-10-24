import { CheckCircle2 } from "lucide-react";
import sunsetImage from "@/assets/gta-sunset.png";

const modules = [
  {
    title: "Fundamentos do Marketing Digital",
    topics: [
      "Mindset Empreendedor",
      "Nichos Lucrativos",
      "Construção de Marca Pessoal",
      "Posicionamento de Autoridade",
    ],
  },
  {
    title: "Tráfego Pago Avançado",
    topics: [
      "Facebook & Instagram Ads Completo",
      "Google Ads & YouTube Ads",
      "TikTok Ads do Zero",
      "Otimização e Escala de Campanhas",
    ],
  },
  {
    title: "Infoprodutos & Lançamentos",
    topics: [
      "Criação de Produtos Digitais",
      "Estratégia de Lançamento",
      "Funil Perpétuo Automatizado",
      "Vendas no WhatsApp",
    ],
  },
  {
    title: "E-commerce & Dropshipping",
    topics: [
      "Montagem de Loja Virtual",
      "Fornecedores e Produtos Vencedores",
      "Logística e Atendimento",
      "Escala de E-commerce",
    ],
  },
  {
    title: "IA & Ferramentas",
    topics: [
      "ChatGPT para Negócios",
      "Criação de Sites com IA",
      "Copy com Inteligência Artificial",
      "Automação de Processos",
    ],
  },
  {
    title: "Agência & Prestação de Serviços",
    topics: [
      "Como Montar sua Agência",
      "Captação de Clientes",
      "Precificação de Serviços",
      "Gestão de Projetos",
    ],
  },
];

export const Modules = () => {
  return (
    <section className="py-16 sm:py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={sunsetImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>
      
      {/* Urban Skyline */}
      <div className="absolute inset-0 opacity-[0.04] z-0">
        <svg viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 85%, 60%)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <rect x="50" y="100" width="80" height="300" fill="url(#skylineGradient)"/>
          <rect x="150" y="180" width="100" height="220" fill="url(#skylineGradient)"/>
          <rect x="270" y="250" width="70" height="150" fill="url(#skylineGradient)"/>
          <rect x="360" y="50" width="90" height="350" fill="url(#skylineGradient)"/>
          <rect x="470" y="140" width="85" height="260" fill="url(#skylineGradient)"/>
          <rect x="580" y="270" width="120" height="130" fill="url(#skylineGradient)"/>
          <rect x="720" y="120" width="60" height="280" fill="url(#skylineGradient)"/>
        </svg>
      </div>
      
      <div className="atmospheric-haze opacity-30 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Conteúdo Completo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-4 sm:mb-6">
            <span className="text-neon-purple">+300 AULAS</span> Que Valem <span className="text-neon-cyan">+R$50K</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            O passo a passo EXATO para você sair do zero e bater sua primeira meta de <span className="text-primary font-bold">R$10K/mês</span> em até 90 dias
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur-sm border-2 border-border rounded-lg p-5 sm:p-6 hover:border-primary/50 transition-all duration-500 hover:scale-105 animate-fade-in relative overflow-hidden group"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 8px 32px hsl(var(--primary) / 0.1)'
              }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(330 100% 70% / 0.1), hsl(270 85% 60% / 0.1), hsl(185 85% 70% / 0.1))',
                  filter: 'blur(20px)'
                }}
              ></div>
              <div className="relative z-10">
              <div className="mb-4">
                <span className="text-primary text-4xl sm:text-5xl font-bold opacity-30 neon-glow">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-primary">
                {module.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm sm:text-base">{topic}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
