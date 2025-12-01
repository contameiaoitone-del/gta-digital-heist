import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, PlayCircle, Target, TrendingUp, Users, Zap, Shield, Clock, Award } from "lucide-react";
import { Footer } from "@/components/Footer";

const RPClose = () => {
  const handleCTAClick = () => {
    window.open("https://pay.cakto.com.br/pcg9vjz_641934", "_blank");
  };

  const modules = [
    {
      icon: Target,
      title: "Fundamentos de Fechamento",
      description: "Aprenda os pilares essenciais para fechar vendas com consistência"
    },
    {
      icon: Users,
      title: "Psicologia do Cliente",
      description: "Entenda o que move seu cliente a tomar a decisão de compra"
    },
    {
      icon: TrendingUp,
      title: "Técnicas de Persuasão",
      description: "Domine as estratégias comprovadas de alta conversão"
    },
    {
      icon: Zap,
      title: "Objeções e Contornos",
      description: "Transforme objeções em oportunidades de fechamento"
    }
  ];

  const forWho = [
    "Vendedores que querem aumentar suas conversões",
    "Prestadores de serviço que perdem vendas na etapa final",
    "Empreendedores que precisam fechar mais negócios",
    "Profissionais que querem dominar o fechamento"
  ];

  const notForWho = [
    "Quem busca fórmulas mágicas sem esforço",
    "Quem não está disposto a praticar e aplicar",
    "Quem quer resultados sem agir",
    "Quem não tem comprometimento com o processo"
  ];

  const faqs = [
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "Os primeiros resultados podem aparecer já na primeira semana de aplicação, mas o domínio completo vem com a prática consistente das técnicas ensinadas."
    },
    {
      question: "Preciso ter experiência prévia em vendas?",
      answer: "Não! O treinamento foi desenvolvido tanto para iniciantes quanto para vendedores experientes que querem melhorar seus resultados."
    },
    {
      question: "Qual o formato do treinamento?",
      answer: "Videoaulas práticas e diretas ao ponto, com exemplos reais e scripts prontos para você aplicar imediatamente."
    },
    {
      question: "Tem suporte?",
      answer: "Sim! Você terá acesso a suporte direto para tirar suas dúvidas durante todo o treinamento."
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
        <div className="absolute inset-0 bg-gradient-to-b from-neon-pink/10 via-neon-purple/5 to-transparent" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[size:100%_4px] animate-[scan_8s_linear_infinite]" />
        </div>

        <div className="container relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-neon-pink/50 text-neon-pink px-4 py-2 text-sm">
              🎯 Treinamento de Alta Conversão
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-gta uppercase leading-tight">
              <span className="text-neon-pink neon-glow">Domine a Arte</span>
              <br />
              <span className="text-foreground">do Fechamento</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transforme suas oportunidades em vendas fechadas com as técnicas que os top closers usam
            </p>

            {/* VSL Video Placeholder */}
            <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-soft-pink gta-card-border bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neon-pink/20 via-neon-purple/20 to-background">
                <div className="text-center space-y-4">
                  <PlayCircle className="w-24 h-24 mx-auto text-neon-pink animate-pulse-neon" />
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
              Quero Dominar o Fechamento Agora
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-cyan" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-cyan" />
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-neon-cyan" />
                <span>Certificado incluso</span>
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
              <span className="text-neon-pink">Você está perdendo</span> vendas?
            </h2>
            <p className="text-xl text-muted-foreground">
              Não é por falta de oportunidades... é por não saber fechar!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Leads qualificados que não fecham",
              "Dificuldade em contornar objeções",
              "Conversas que não avançam",
              "Perda de vendas no final do funil"
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
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-background to-neon-purple/10" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="outline" className="border-neon-cyan/50 text-neon-cyan px-4 py-2">
              💎 A Solução
            </Badge>
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-neon-cyan neon-glow">RP Close</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O treinamento que vai transformar você em um closer de alta performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Técnicas Validadas", desc: "Métodos testados e aprovados" },
              { icon: Zap, title: "Aplicação Imediata", desc: "Scripts prontos para usar" },
              { icon: TrendingUp, title: "Resultados Rápidos", desc: "Veja mudanças em dias" }
            ].map((item, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm gta-card-border text-center">
                <CardContent className="pt-6 space-y-3">
                  <item.icon className="w-12 h-12 mx-auto text-neon-cyan" />
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
              O Que Você Vai <span className="text-neon-pink neon-glow">Aprender</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-neon-pink/50 transition-smooth">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-neon-pink/10">
                      <module.icon className="w-6 h-6 text-neon-pink" />
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
            <Card className="bg-gradient-to-br from-neon-cyan/10 to-card/50 backdrop-blur-sm border-neon-cyan/30">
              <CardHeader>
                <CardTitle className="text-2xl font-gta uppercase text-neon-cyan">
                  ✓ Este Treinamento é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {forWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-background to-neon-purple/10" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-2xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm gta-card-border">
            <CardHeader className="text-center space-y-4">
              <Badge variant="outline" className="border-neon-pink/50 text-neon-pink px-4 py-2 mx-auto">
                🔥 Oferta Especial
              </Badge>
              <CardTitle className="text-4xl font-gta uppercase">
                <span className="text-neon-pink neon-glow">RP Close</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-through">De R$ 997,00</p>
                <p className="text-5xl font-gta text-neon-pink">R$ 497,00</p>
                <p className="text-muted-foreground">ou 12x de R$ 49,70</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Acesso vitalício ao treinamento completo",
                  "Atualizações gratuitas",
                  "Suporte direto",
                  "Certificado de conclusão",
                  "Grupo exclusivo de alunos",
                  "Bônus: Scripts de fechamento"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0" />
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
                  <Shield className="w-4 h-4 text-neon-cyan" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-neon-cyan" />
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
          <Card className="bg-gradient-to-br from-neon-cyan/10 to-card/50 backdrop-blur-sm border-neon-cyan/30 text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan">
                <Shield className="w-10 h-10 text-neon-cyan" />
              </div>
              <div>
                <h3 className="text-3xl font-gta uppercase text-neon-cyan mb-2">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Se você aplicar o conteúdo e não ver resultados, ou simplesmente não gostar, 
                  devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.
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
              Dúvidas <span className="text-neon-pink neon-glow">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-neon-pink transition-colors">
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
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/20 via-neon-purple/20 to-background" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-gta uppercase leading-tight">
            <span className="text-neon-pink neon-glow">Pronto para fechar</span>
            <br />
            <span className="text-foreground">mais vendas?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece hoje a transformar suas oportunidades em vendas fechadas
          </p>

          <Button 
            onClick={handleCTAClick}
            size="lg" 
            variant="hero" 
            className="text-lg px-8 py-6"
          >
            Sim, Quero Dominar o Fechamento Agora
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

export default RPClose;
