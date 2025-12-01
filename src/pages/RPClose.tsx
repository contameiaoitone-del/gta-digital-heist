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
      title: "Estratégias de Tráfego",
      description: "Como realmente fazer tráfego da forma correta, e escalar da forma certa."
    },
    {
      icon: Users,
      title: "X1 no WhatsApp",
      description: "Como eu rodo meus funis 100% no automatico e faço vendas todos os dias literalmente sem atender nenhum lead."
    },
    {
      icon: TrendingUp,
      title: "Testes em Tempo Real",
      description: "O que deu certo E o que deu errado - acesso aos meus testes sem filtro"
    },
    {
      icon: Zap,
      title: "A Verdade Sobre o Digital",
      description: "Bastidores reais, não apenas resultados bonitinhos - a realidade das operações"
    }
  ];

  const forWho = [
    "Quem quer aprender tráfego pago na prática",
    "Empreendedores que querem escalar suas operações",
    "Quem quer ver os bastidores do que realmente funciona",
    "Profissionais que querem acesso a conteúdo exclusivo e direto"
  ];

  const notForWho = [
    "Quem busca teoria sem aplicação prática",
    "Quem não tem interesse em tráfego ou vendas",
    "Quem quer conteúdo superficial e genérico",
    "Quem não está disposto a investir em conhecimento"
  ];

  const faqs = [
    {
      question: "Como funciona o acesso?",
      answer: "Você entra no meu close friends do Instagram e tem acesso a todo conteúdo exclusivo que eu posto diariamente sobre tráfego, vendas, bastidores e estratégias."
    },
    {
      question: "Que tipo de conteúdo vou encontrar?",
      answer: "Bastidores reais das minhas operações, dicas de tráfego pago, estratégias de X1 no WhatsApp, stories destacados com cases e resultados, e muito mais conteúdo prático."
    },
    {
      question: "É uma assinatura recorrente?",
      answer: "Sim, é uma assinatura mensal. Você pode cancelar quando quiser, sem burocracia."
    },
    {
      question: "Preciso ter experiência com tráfego?",
      answer: "Não! Compartilho desde o básico até estratégias avançadas. O conteúdo é direto e aplicável, seja você iniciante ou já experiente."
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
              🔥 Close Friends Exclusivo
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-gta uppercase leading-tight">
              <span className="text-[hsl(var(--gta-magenta))]">Acesso aos Bastidores</span>
              <br />
              <span className="text-white">do Que Realmente Funciona</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              Acesso aos meus testes em tempo real - o que funciona, o que falha, e a verdade sobre o digital sem filtro
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
              Quero Acesso aos Bastidores Agora
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
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">Cansado de Conteúdo</span> <span className="text-white">Superficial?</span>
            </h2>
            <p className="text-xl text-gray-400">
              Todo mundo promete resultados, mas ninguém mostra os bastidores reais...
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Cursos genéricos que não mostram a realidade",
              "Gurus que vendem sonhos mas não mostram processos",
              "Conteúdo superficial que não gera resultado",
              "Falta de acesso ao que realmente funciona na prática"
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
              🎯 A Solução
            </Badge>
            <h2 className="text-4xl md:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">RP Close</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Testes em tempo real, resultados verdadeiros e bastidores sem filtro - o que funciona e o que falha
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Transparência Total", desc: "Eu mostro o que funciona e também o que deu errado" },
              { icon: Zap, title: "Testes em Tempo Real", desc: "Acesso aos bastidores das operações" },
              { icon: TrendingUp, title: "Sem Filtro", desc: "A verdade sobre o digital, não só resultados bonitos" }
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
                🔥 Oferta Especial
              </Badge>
              <CardTitle className="text-4xl font-gta uppercase">
                <span className="text-[hsl(var(--gta-magenta))]">RP Close</span>
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
                  "Acesso ao close friends do Instagram",
                  "Testes em tempo real - o que funciona e o que falha",
                  "Bastidores sem filtro das operações",
                  "Estratégias de tráfego e X1 no WhatsApp",
                  "A verdade sobre o digital, não apenas resultados bonitinhos",
                  "Stories destacados com cases reais e aprendizados"
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
                  Se você não gostar do conteúdo nos primeiros 7 dias, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.
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
            <span className="text-white">Pronto Para Ter Acesso</span>
            <br />
            <span className="text-[hsl(var(--gta-magenta))]">Aos Bastidores?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Entre agora no close friends e veja o que realmente funciona
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

export default RPClose;
