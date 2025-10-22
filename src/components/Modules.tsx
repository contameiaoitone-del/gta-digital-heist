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
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={sunsetImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Conteúdo Completo
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-6">
            <span className="text-neon-purple">+300 AULAS</span> Práticas
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            6 módulos completos com tudo que você precisa para dominar o mercado digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <span className="text-primary text-5xl font-bold opacity-30">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">
                {module.title}
              </h3>
              <ul className="space-y-3">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
