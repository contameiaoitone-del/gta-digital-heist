import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, PlayCircle, Bot, MessageSquare, Rocket, Repeat, Shield, Clock, Award, Zap, Target, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-black scroll-smooth">
      {/* Hero Section with VSL */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gta-magenta)/0.15)_0%,transparent_70%)]" />
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container relative z-10 py-8 md:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent animate-pulse">
              ⚡ Sistema de Vendas Automatizado
            </Badge>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-gta uppercase leading-tight animate-fade-in">
              <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_hsl(var(--gta-magenta)/0.5)]">Venda no WhatsApp</span>
              <br />
              <span className="text-white">no Automático</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto px-4">
              Monte seu robô de vendas que trabalha 24/7 e converte leads em clientes enquanto você dorme
            </p>

            {/* VSL Video Placeholder */}
            <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden border border-white/20 bg-black group cursor-pointer hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gta-magenta))]/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center space-y-3 md:space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/30 rounded-full blur-xl animate-pulse" />
                    <PlayCircle className="w-16 h-16 md:w-24 md:h-24 mx-auto text-[hsl(var(--gta-magenta))] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-gray-400 font-semibold text-sm md:text-base">Assista ao Vídeo de Apresentação</p>
                  <p className="text-xs md:text-sm text-gray-500">(Vídeo será adicionado em breve)</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/50 blur-xl rounded-lg animate-pulse" />
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="relative text-sm md:text-lg px-6 md:px-8 py-5 md:py-6 mt-4 md:mt-8 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_hsl(var(--gta-magenta)/0.4)]"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Quero Automatizar Minhas Vendas
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 pt-4">
              <div className="flex items-center justify-center gap-2 hover:text-white transition-colors">
                <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center justify-center gap-2 hover:text-white transition-colors">
                <Clock className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center justify-center gap-2 hover:text-white transition-colors">
                <Award className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Suporte completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        {/* Red atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_70%_50%/0.08)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gta uppercase px-2">
              <span className="text-[hsl(var(--gta-magenta))]">Cansado de responder</span> <span className="text-white">o mesmo o dia todo?</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400">
              Seu tempo vale mais do que isso...
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {[
              "Perder vendas porque não respondeu rápido",
              "Gastar horas respondendo as mesmas perguntas",
              "Não conseguir atender todos os leads",
              "Depender da sua disponibilidade para vender"
            ].map((problem, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900/80 border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(239,68,68,0.3)] group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="pt-5 md:pt-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 group-hover:animate-pulse" />
                  <p className="text-white text-sm md:text-base">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        {/* Magenta atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gta-magenta)/0.1)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <Badge variant="outline" className="border-[hsl(var(--gta-orange))] text-[hsl(var(--gta-orange))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent">
              🤖 A Solução
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_20px_hsl(var(--gta-magenta)/0.5)]">RP Zap</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
              Monte seu robô de vendas e venda 24 horas por dia, 7 dias por semana
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Bot, title: "100% Automatizado", desc: "Configure uma vez, venda sempre" },
              { icon: Rocket, title: "Escalável", desc: "Atenda 10 ou 10.000 leads" },
              { icon: Repeat, title: "Consistente", desc: "Mesma qualidade para todos" }
            ].map((item, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900/80 border-zinc-800 text-center hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_hsl(var(--gta-magenta)/0.3)] group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <CardContent className="pt-6 md:pt-8 pb-6 md:pb-8 space-y-3 md:space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <item.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto text-[hsl(var(--gta-magenta))] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-gta text-lg md:text-xl text-white">{item.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gta uppercase text-white px-2">
              O Que Você Vai <span className="text-[hsl(var(--gta-magenta))]">Aprender</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {modules.map((module, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900/80 border-zinc-800 hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_hsl(var(--gta-magenta)/0.25)] group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="pb-2 md:pb-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-lg border border-[hsl(var(--gta-magenta))]/30 bg-[hsl(var(--gta-magenta))]/10 group-hover:bg-[hsl(var(--gta-magenta))]/20 group-hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300">
                      <module.icon className="w-5 h-5 md:w-6 md:h-6 text-[hsl(var(--gta-magenta))] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg md:text-xl text-white">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm md:text-base">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Who / Not For Who Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* For Who */}
            <Card className="bg-zinc-900/80 border-[hsl(var(--gta-magenta))]/30 hover:border-[hsl(var(--gta-magenta))]/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-gta uppercase text-[hsl(var(--gta-magenta))]">
                  ✓ Este Treinamento é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {forWho.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Not For Who */}
            <Card className="bg-zinc-900/80 border-red-500/30 hover:border-red-500/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-gta uppercase text-red-500">
                  ✗ Este Treinamento NÃO é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notForWho.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <XCircle className="w-5 h-5 text-[hsl(var(--gta-orange))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-gray-400 text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gta-magenta)/0.1)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-2xl mx-auto">
          <Card className="bg-zinc-900/90 border-[hsl(var(--gta-magenta))]/50 relative overflow-hidden hover:border-[hsl(var(--gta-magenta))] transition-all duration-500 hover:shadow-[0_0_60px_-15px_hsl(var(--gta-magenta)/0.5)]">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gta-magenta))]/20 to-transparent animate-pulse" />
            
            <CardHeader className="text-center space-y-4 relative z-10">
              <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm mx-auto bg-transparent animate-pulse">
                ⚡ Oferta Especial
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-gta uppercase">
                <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_20px_hsl(var(--gta-magenta)/0.5)]">RP Zap</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 line-through">De R$ 997,00</p>
                <p className="text-4xl md:text-5xl font-gta text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_15px_hsl(var(--gta-magenta)/0.4)]">R$ 497,00</p>
                <p className="text-gray-400 text-sm md:text-base">ou 12x de R$ 49,70</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                {[
                  "Acesso vitalício ao treinamento completo",
                  "Atualizações gratuitas de estratégias",
                  "Suporte direto para implementação",
                  "Templates prontos de automação",
                  "Comunidade exclusiva de membros",
                  "Bônus: Scripts de conversão testados"
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/40 blur-xl rounded-lg animate-pulse" />
                <Button 
                  onClick={handleCTAClick}
                  size="lg" 
                  className="relative w-full text-sm md:text-lg py-5 md:py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-[1.02] transition-all duration-300"
                >
                  <Target className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Garantir Minha Vaga Agora
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 pt-4 text-xs text-gray-400">
                <div className="flex items-center justify-center gap-2 hover:text-white transition-colors">
                  <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center justify-center gap-2 hover:text-white transition-colors">
                  <Award className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Garantia de 7 Dias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        {/* Green/Magenta atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(142_70%_45%/0.08)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-4xl mx-auto">
          <Card className="bg-zinc-900/80 border-[hsl(var(--gta-magenta))]/30 text-center hover:border-[hsl(var(--gta-magenta))]/60 transition-all duration-300">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--gta-magenta))]/20 border-2 border-[hsl(var(--gta-magenta))] relative group">
                <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/30 rounded-full blur-lg animate-pulse" />
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-[hsl(var(--gta-magenta))] relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-gta uppercase text-[hsl(var(--gta-magenta))] mb-2 drop-shadow-[0_0_15px_hsl(var(--gta-magenta)/0.4)]">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
                  Se você implementar o sistema e não ficar satisfeito, devolvemos 100% do seu dinheiro. 
                  Sem perguntas, sem burocracia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gta uppercase text-white">
              Dúvidas <span className="text-[hsl(var(--gta-magenta))]">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 md:px-6 hover:border-[hsl(var(--gta-magenta))]/30 transition-colors duration-300 data-[state=open]:border-[hsl(var(--gta-magenta))]/50"
              >
                <AccordionTrigger className="text-left text-white hover:text-[hsl(var(--gta-magenta))] transition-colors text-sm md:text-base py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm md:text-base pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Dramatic gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--gta-magenta)/0.2)_0%,transparent_70%)]" />
        
        <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-gta uppercase px-2 animate-fade-in">
            <span className="text-white">Pronto Para Vender</span>
            <br />
            <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_hsl(var(--gta-magenta)/0.5)]">24/7 no Automático?</span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Monte seu sistema de vendas automatizado hoje mesmo
          </p>
          
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/50 blur-2xl rounded-lg animate-pulse" />
            <Button 
              onClick={handleCTAClick}
              size="lg" 
              className="relative text-sm md:text-lg px-8 md:px-12 py-5 md:py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_hsl(var(--gta-magenta)/0.5)]"
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Garantir Acesso Agora
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RPZap;
