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
    <div className="min-h-screen bg-black">
      {/* Hero Section with VSL */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-4 py-2 text-sm bg-transparent">
              ⚡ Sistema de Vendas Automatizado
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-gta uppercase leading-tight">
              <span className="text-[hsl(var(--gta-magenta))]">Venda no WhatsApp</span>
              <br />
              <span className="text-white">no Automático</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              Monte seu robô de vendas que trabalha 24/7 e converte leads em clientes enquanto você dorme
            </p>

            {/* VSL Video Placeholder */}
            <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden border border-white/20 bg-black">
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center space-y-4">
                  <PlayCircle className="w-24 h-24 mx-auto text-[hsl(var(--gta-magenta))]" />
                  <p className="text-gray-400 font-semibold">Assista ao Vídeo de Apresentação</p>
                  <p className="text-sm text-gray-500">(Vídeo será adicionado em breve)</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleCTAClick}
              size="lg" 
              className="text-lg px-8 py-6 mt-8 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold"
            >
              Quero Automatizar Minhas Vendas Agora
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Suporte completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">Cansado de responder</span> <span className="text-white">o mesmo o dia todo?</span>
            </h2>
            <p className="text-xl text-gray-400">
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
              <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-300">
                <CardContent className="pt-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-white">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="outline" className="border-[hsl(var(--gta-orange))] text-[hsl(var(--gta-orange))] px-4 py-2 bg-transparent">
              🤖 A Solução
            </Badge>
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">RP Zap</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Monte seu robô de vendas e venda 24 horas por dia, 7 dias por semana
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "100% Automatizado", desc: "Configure uma vez, venda sempre" },
              { icon: Rocket, title: "Escalável", desc: "Atenda 10 ou 10.000 leads" },
              { icon: Repeat, title: "Consistente", desc: "Mesma qualidade para todos" }
            ].map((item, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 text-center hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300">
                <CardContent className="pt-6 space-y-3">
                  <item.icon className="w-12 h-12 mx-auto text-[hsl(var(--gta-magenta))]" />
                  <h3 className="font-gta text-xl text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase text-white">
              O Que Você Vai <span className="text-[hsl(var(--gta-magenta))]">Aprender</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg border border-[hsl(var(--gta-magenta))]/30 bg-[hsl(var(--gta-magenta))]/10">
                      <module.icon className="w-6 h-6 text-[hsl(var(--gta-magenta))]" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-white">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Who / Not For Who Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Who */}
            <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-gta uppercase text-[hsl(var(--gta-magenta))]">
                  ✓ Este Treinamento é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {forWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 mt-0.5" />
                    <p className="text-white">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Not For Who */}
            <Card className="bg-zinc-900 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-gta uppercase text-red-500">
                  ✗ Este Treinamento NÃO é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notForWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-[hsl(var(--gta-orange))] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-2xl mx-auto">
          <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/50">
            <CardHeader className="text-center space-y-4">
              <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-4 py-2 mx-auto bg-transparent">
                ⚡ Oferta Especial
              </Badge>
              <CardTitle className="text-4xl font-gta uppercase">
                <span className="text-[hsl(var(--gta-magenta))]">RP Zap</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 line-through">De R$ 997,00</p>
                <p className="text-5xl font-gta text-[hsl(var(--gta-magenta))]">R$ 497,00</p>
                <p className="text-gray-400">ou 12x de R$ 49,70</p>
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
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0" />
                    <p className="text-white">{item}</p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="w-full text-lg py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold"
              >
                Garantir Minha Vaga Agora
              </Button>

              <div className="flex justify-center gap-8 pt-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Garantia de 7 Dias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-4xl mx-auto">
          <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/30 text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--gta-magenta))]/20 border-2 border-[hsl(var(--gta-magenta))]">
                <Shield className="w-10 h-10 text-[hsl(var(--gta-magenta))]" />
              </div>
              <div>
                <h3 className="text-3xl font-gta uppercase text-[hsl(var(--gta-magenta))] mb-2">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Se você implementar o sistema e não ficar satisfeito, devolvemos 100% do seu dinheiro. 
                  Sem perguntas, sem burocracia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase text-white">
              Dúvidas <span className="text-[hsl(var(--gta-magenta))]">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-white hover:text-[hsl(var(--gta-magenta))] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-gta uppercase">
            <span className="text-white">Pronto Para Vender</span>
            <br />
            <span className="text-[hsl(var(--gta-magenta))]">24/7 no Automático?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Monte seu sistema de vendas automatizado hoje mesmo
          </p>
          <Button 
            onClick={handleCTAClick}
            size="lg" 
            className="text-lg px-12 py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold"
          >
            Garantir Acesso Agora
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RPZap;
