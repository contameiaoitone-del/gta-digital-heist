import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, PlayCircle, Bot, MessageSquare, Rocket, Repeat, Shield, Clock, Award } from "lucide-react";
import { Footer } from "@/components/Footer";

const RPZap = () => {
  const handleCTAClick = () => {
    window.open("https://pay.cakto.com.br/3dsuw79_671863", "_blank");
  };

  const modules = [
    {
      icon: Bot,
      title: "Automação Inteligente",
      description: "Configure seu sistema de vendas automatizado do zero"
    },
    {
      icon: MessageSquare,
      title: "Scripts de Conversão",
      description: "Mensagens otimizadas que vendem enquanto você dorme"
    },
    {
      icon: Rocket,
      title: "Funil Automatizado",
      description: "Do primeiro contato ao fechamento, tudo no piloto automático"
    },
    {
      icon: Repeat,
      title: "Follow-up Automático",
      description: "Nunca mais perca vendas por falta de acompanhamento"
    }
  ];

  const forWho = [
    "Empreendedores que querem vender 24/7 automaticamente",
    "Profissionais que perdem tempo com mensagens manuais",
    "Quem quer escalar vendas sem aumentar o time",
    "Negócios que precisam de previsibilidade nas vendas"
  ];

  const notForWho = [
    "Quem busca ganhos sem estruturar processos",
    "Quem não está disposto a configurar o sistema",
    "Quem quer resultados sem investir tempo inicial",
    "Quem não tem um produto/serviço para vender"
  ];

  const faqs = [
    {
      question: "Preciso de conhecimento técnico?",
      answer: "Não! O treinamento é 100% prático e feito para qualquer pessoa implementar, mesmo sem experiência técnica. Mostramos tudo passo a passo."
    },
    {
      question: "Funciona para qualquer nicho?",
      answer: "Sim! O sistema é adaptável para diversos tipos de negócios: consultoria, infoprodutos, serviços, agências, e-commerce e muito mais."
    },
    {
      question: "Quanto tempo leva para configurar?",
      answer: "Com dedicação, você consegue ter seu sistema básico funcionando em 1-2 dias. A otimização contínua acontece ao longo das semanas."
    },
    {
      question: "Preciso de ferramentas pagas?",
      answer: "Mostramos opções gratuitas e pagas. É possível começar sem investimento adicional e ir escalando conforme os resultados aparecem."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with VSL */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 via-neon-cyan/5 to-transparent" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[size:100%_4px] animate-[scan_8s_linear_infinite]" />
        </div>

        <div className="container relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-neon-cyan/50 text-neon-cyan px-4 py-2 text-sm">
              ⚡ Sistema de Vendas Automatizado
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-gta uppercase leading-tight">
              <span className="text-neon-cyan neon-glow">Venda no WhatsApp</span>
              <br />
              <span className="text-foreground">no Automático</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Monte seu robô de vendas que trabalha 24/7 e converte leads em clientes enquanto você dorme
            </p>

            {/* VSL Video Placeholder */}
            <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-soft-cyan gta-card-border bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-background">
                <div className="text-center space-y-4">
                  <PlayCircle className="w-24 h-24 mx-auto text-neon-cyan animate-pulse-neon" />
                  <p className="text-muted-foreground font-semibold">Assista ao Vídeo de Apresentação</p>
                  <p className="text-sm text-muted-foreground/70">(Vídeo será adicionado em breve)</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleCTAClick}
              size="lg" 
              variant="hero" 
              className="text-lg px-8 py-6 mt-8"
            >
              Quero Automatizar Minhas Vendas Agora
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-pink" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-pink" />
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-neon-pink" />
                <span>Suporte completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-neon-cyan">Cansado de responder</span> o mesmo o dia todo?
            </h2>
            <p className="text-xl text-muted-foreground">
              Seu tempo vale mais do que isso...
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Perder vendas porque não respondeu rápido",
              "Gastar horas respondendo as mesmas perguntas",
              "Não conseguir atender todos os leads",
              "Depender da sua disponibilidade para vender"
            ].map((problem, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-destructive/50 transition-smooth">
                <CardContent className="pt-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  <p className="text-foreground">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-background to-neon-purple/10" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="outline" className="border-neon-pink/50 text-neon-pink px-4 py-2">
              🤖 A Solução
            </Badge>
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-neon-pink neon-glow">RP Zap</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monte seu robô de vendas e venda 24 horas por dia, 7 dias por semana
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "100% Automatizado", desc: "Configure uma vez, venda sempre" },
              { icon: Rocket, title: "Escalável", desc: "Atenda 10 ou 10.000 leads" },
              { icon: Repeat, title: "Consistente", desc: "Mesma qualidade para todos" }
            ].map((item, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm gta-card-border text-center">
                <CardContent className="pt-6 space-y-3">
                  <item.icon className="w-12 h-12 mx-auto text-neon-pink" />
                  <h3 className="font-gta text-xl text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              O Que Você Vai <span className="text-neon-cyan neon-glow">Aprender</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-neon-cyan/50 transition-smooth">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-neon-cyan/10">
                      <module.icon className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Who / Not For Who Section */}
      <section className="py-20 px-4 relative">
        <div className="container relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Who */}
            <Card className="bg-gradient-to-br from-neon-pink/10 to-card/50 backdrop-blur-sm border-neon-pink/30">
              <CardHeader>
                <CardTitle className="text-2xl font-gta uppercase text-neon-pink">
                  ✓ Este Treinamento é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {forWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-pink flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Not For Who */}
            <Card className="bg-gradient-to-br from-destructive/10 to-card/50 backdrop-blur-sm border-destructive/30">
              <CardHeader>
                <CardTitle className="text-2xl font-gta uppercase text-destructive">
                  ✗ Este Treinamento NÃO é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notForWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-background to-neon-purple/10" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-2xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm gta-card-border">
            <CardHeader className="text-center space-y-4">
              <Badge variant="outline" className="border-neon-cyan/50 text-neon-cyan px-4 py-2 mx-auto">
                ⚡ Oferta Especial
              </Badge>
              <CardTitle className="text-4xl font-gta uppercase">
                <span className="text-neon-cyan neon-glow">RP Zap</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-through">De R$ 997,00</p>
                <p className="text-5xl font-gta text-neon-cyan">R$ 497,00</p>
                <p className="text-muted-foreground">ou 12x de R$ 49,70</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Acesso vitalício ao treinamento completo",
                  "Atualizações gratuitas de estratégias",
                  "Suporte direto para implementação",
                  "Templates prontos de automação",
                  "Comunidade exclusiva de membros",
                  "Bônus: Scripts de conversão testados"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-pink flex-shrink-0" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleCTAClick}
                size="lg" 
                variant="hero" 
                className="w-full text-lg py-6"
              >
                Garantir Minha Vaga Agora
              </Button>

              <div className="flex justify-center gap-8 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neon-pink" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-neon-pink" />
                  <span>Garantia de 7 Dias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 px-4 relative">
        <div className="container relative z-10 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-neon-pink/10 to-card/50 backdrop-blur-sm border-neon-pink/30 text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-pink/20 border-2 border-neon-pink">
                <Shield className="w-10 h-10 text-neon-pink" />
              </div>
              <div>
                <h3 className="text-3xl font-gta uppercase text-neon-pink mb-2">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Se você implementar o sistema e não ficar satisfeito, devolvemos 100% do seu dinheiro. 
                  Sem perguntas, sem burocracia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative">
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              Dúvidas <span className="text-neon-cyan neon-glow">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-neon-cyan transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-background" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-gta uppercase leading-tight">
            <span className="text-neon-cyan neon-glow">Pronto para vender</span>
            <br />
            <span className="text-foreground">no automático?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monte seu robô de vendas hoje e comece a vender 24/7
          </p>

          <Button 
            onClick={handleCTAClick}
            size="lg" 
            variant="hero" 
            className="text-lg px-8 py-6"
          >
            Sim, Quero Automatizar Minhas Vendas Agora
          </Button>

          <p className="text-sm text-muted-foreground">
            Acesso imediato • Garantia de 7 dias • Suporte completo
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RPZap;
