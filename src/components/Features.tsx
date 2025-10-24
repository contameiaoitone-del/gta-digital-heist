import { TrendingUp, ShoppingCart, Megaphone, Sparkles, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import laptopImage from "@/assets/gta-laptop-growth.png";
const features = [{
  icon: Megaphone,
  title: "Tráfego Pago",
  description: "Domine Facebook Ads, Google Ads e TikTok Ads. Aprenda a escalar campanhas que realmente convertem.",
  result: "→ Você vai saber exatamente como transformar R$100 em R$500+ todo dia",
  color: "neon-pink"
}, {
  icon: TrendingUp,
  title: "Infoprodutos",
  description: "Crie e venda produtos digitais com estratégias de lançamento, perpétuo e vendas no WhatsApp.",
  result: "→ Crie produtos digitais do zero e venda no automático 24/7",
  color: "neon-purple"
}, {
  icon: ShoppingCart,
  title: "E-commerce",
  description: "Monte e escale sua loja virtual do zero. Estratégias para dropshipping e produtos próprios.",
  result: "→ Monte sua loja em 48h e comece a vender sem estoque",
  color: "neon-cyan"
}, {
  icon: Sparkles,
  title: "IA & Automação",
  description: "Use Inteligência Artificial para criar sites, copy, criativos e automatizar seu negócio.",
  result: "→ Trabalhe 2h/dia enquanto a IA faz o trabalho pesado pra você",
  color: "neon-orange"
}, {
  icon: Users,
  title: "Prestação de Serviços",
  description: "Aprenda a oferecer serviços digitais e construir uma agência lucrativa do zero.",
  result: "→ Capture seu primeiro cliente em até 7 dias e cobre R$3k+/mês",
  color: "neon-pink"
}, {
  icon: DollarSign,
  title: "Monetização Total",
  description: "Múltiplas fontes de renda. Aprenda todas as formas de ganhar dinheiro online.",
  result: "→ Tenha 3-5 fontes de renda diversificadas e blindadas",
  color: "neon-cyan"
}];
export const Features = () => {
  return <section className="py-16 sm:py-20 md:py-32 relative overflow-hidden painted-texture">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background"></div>
      <div className="atmospheric-haze opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 sm:mb-16 animate-fade-in">
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">
              O que você vai aprender
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-4 sm:mb-6">
              <span className="text-neon-pink">TUDO</span> Sobre o{" "}
              <span className="text-neon-cyan">Mercado Digital</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
              Um treinamento completo com todas as habilidades necessárias para você conquistar sua liberdade financeira
            </p>
          </div>
          <div className="relative animate-slide-up order-1 md:order-2" style={{
          animationDelay: "0.2s"
        }}>
            
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {features.map((feature, index) => <Card key={index} className="p-5 sm:p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 group relative" style={{
          animationDelay: `${index * 0.1}s`,
          boxShadow: '0 8px 32px hsl(var(--primary) / 0.15), 0 0 60px hsl(var(--primary) / 0.08)'
        }}>
              <div className={`inline-flex p-3 rounded-lg bg-${feature.color}/10 mb-4 group-hover:scale-110 transition-transform duration-500`} style={{
            filter: 'drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor)'
          }}>
                <feature.icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-3">
                {feature.description}
              </p>
              <p className="text-primary font-semibold text-sm">
                {feature.result}
              </p>
            </Card>)}
        </div>
      </div>
    </section>;
};