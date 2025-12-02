import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CheckCircle2, XCircle, PlayCircle, Target, TrendingUp, Users, Zap, Shield, Clock, Award } from "lucide-react";
import { Footer } from "@/components/Footer";
import rpCloseResult1 from "@/assets/rp-close-result-1.png";
import rpCloseResult2 from "@/assets/rp-close-result-2.png";
import rpCloseResult3 from "@/assets/rp-close-result-3.png";
import rpCloseResult4 from "@/assets/rp-close-result-4.png";
import rpCloseResult5 from "@/assets/rp-close-result-5.png";
import rpCloseResult6 from "@/assets/rp-close-result-6.png";
import rpCloseResult7 from "@/assets/rp-close-result-7.png";
import rpCloseResult8 from "@/assets/rp-close-result-8.png";

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Atmospheric Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--gta-magenta))]/10 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 py-8 md:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent animate-fade-in animate-pulse">
              🔥 Close Friends Exclusivo
            </Badge>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-gta uppercase leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_rgba(212,0,166,0.4)]">Acesso aos Bastidores</span>
              <br />
              <span className="text-white">do Que Realmente Funciona</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Acesso aos meus testes em tempo real - o que funciona, o que falha, e a verdade sobre o digital sem filtro
            </p>

            {/* VSL Video Placeholder */}
            <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden border border-white/20 bg-gradient-to-br from-zinc-900 to-black shadow-[0_0_50px_rgba(212,0,166,0.2)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm">
                <div className="text-center space-y-3 md:space-y-4">
                  <PlayCircle className="w-16 h-16 md:w-24 md:h-24 mx-auto text-[hsl(var(--gta-magenta))] animate-pulse drop-shadow-[0_0_20px_rgba(212,0,166,0.6)] cursor-pointer hover:scale-110 transition-transform duration-300" />
                  <p className="text-gray-400 font-semibold text-sm md:text-base">Assista ao Vídeo de Apresentação</p>
                  <p className="text-xs md:text-sm text-gray-500">(Vídeo será adicionado em breve)</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 mt-4 md:mt-8 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold shadow-[0_0_40px_rgba(212,0,166,0.4)] hover:shadow-[0_0_60px_rgba(212,0,166,0.6)] transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Quero Acesso aos Bastidores Agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 pt-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                <span>Acesso imediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">Cansado de Conteúdo</span> <span className="text-white">Superficial?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              Todo mundo promete resultados, mas ninguém mostra os bastidores reais...
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {[
              "Cursos genéricos que não mostram a realidade",
              "Gurus que vendem sonhos mas não mostram processos",
              "Conteúdo superficial que não gera resultado",
              "Falta de acesso ao que realmente funciona na prática"
            ].map((problem, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="pt-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 hover:animate-pulse" />
                  <p className="text-white text-sm md:text-base">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <Badge variant="outline" className="border-[hsl(var(--gta-orange))] text-[hsl(var(--gta-orange))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent">
              🎯 A Solução
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase">
              <span className="text-[hsl(var(--gta-magenta))]">RP Close</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Testes em tempo real, resultados verdadeiros e bastidores sem filtro - o que funciona e o que falha
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Target, title: "Transparência Total", desc: "Eu mostro o que funciona e também o que deu errado" },
              { icon: Zap, title: "Testes em Tempo Real", desc: "Acesso aos bastidores das operações" },
              { icon: TrendingUp, title: "Sem Filtro", desc: "A verdade sobre o digital, não só resultados bonitos" }
            ].map((item, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900 border-zinc-800 text-center hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,0,166,0.2)] hover:-translate-y-2 animate-fade-in group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="pt-6 space-y-3">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto text-[hsl(var(--gta-magenta))] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(212,0,166,0.5)]" />
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase text-white">
              O Que Você Vai <span className="text-[hsl(var(--gta-magenta))]">Aprender</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {modules.map((module, i) => (
              <Card 
                key={i} 
                className="bg-zinc-900 border-zinc-800 hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,0,166,0.15)] hover:-translate-y-1 animate-fade-in group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg border border-[hsl(var(--gta-magenta))]/30 bg-[hsl(var(--gta-magenta))]/10 group-hover:bg-[hsl(var(--gta-magenta))]/20 transition-colors duration-300">
                      <module.icon className="w-5 h-5 md:w-6 md:h-6 text-[hsl(var(--gta-magenta))] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg md:text-xl text-white font-normal">{module.title}</CardTitle>
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
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* For Who */}
            <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/30 hover:border-[hsl(var(--gta-magenta))]/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,0,166,0.2)] animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-gta uppercase text-[hsl(var(--gta-magenta))]">
                  ✓ Este Treinamento é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {forWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Not For Who */}
            <Card className="bg-zinc-900 border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-gta uppercase text-red-500">
                  ✗ Este Treinamento NÃO é Para Você
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notForWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <XCircle className="w-5 h-5 text-[hsl(var(--gta-orange))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-gray-400 text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[hsl(var(--gta-magenta))]/5 via-transparent to-transparent opacity-50" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <Badge variant="outline" className="border-[hsl(var(--gta-orange))] text-[hsl(var(--gta-orange))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent">
              💰 Resultados Reais
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase">
              <span className="text-white">O Que os Membros</span>
              <br />
              <span className="text-[hsl(var(--gta-magenta))]">Estão Conquistando</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Prints reais de quem está aplicando o conteúdo do close friends
            </p>
          </div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none hidden md:block" />
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {[
                  rpCloseResult1,
                  rpCloseResult2,
                  rpCloseResult3,
                  rpCloseResult4,
                  rpCloseResult5,
                  rpCloseResult6,
                  rpCloseResult7,
                  rpCloseResult8
                ].map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,0,166,0.2)] hover:-translate-y-1 group">
                        <CardContent className="p-0">
                          <img 
                            src={image} 
                            alt={`Resultado de aluno ${index + 1}`}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--gta-magenta))]/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container relative z-10 max-w-2xl mx-auto">
          <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/50 hover:border-[hsl(var(--gta-magenta))] transition-all duration-500 shadow-[0_0_60px_rgba(212,0,166,0.3)] relative overflow-hidden animate-fade-in">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gta-magenta))]/20 to-transparent animate-pulse" />
            
            <CardHeader className="text-center space-y-4 relative z-10">
              <Badge variant="outline" className="border-[hsl(var(--gta-magenta))] text-[hsl(var(--gta-magenta))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm mx-auto bg-transparent animate-pulse">
                🔥 Oferta Especial
              </Badge>
              <CardTitle className="text-3xl md:text-4xl font-gta uppercase">
                <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_20px_rgba(212,0,166,0.6)]">RP Close</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-xs md:text-sm text-gray-500 line-through">De R$ 97,00/mês</p>
                <p className="text-4xl md:text-5xl font-gta text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_rgba(212,0,166,0.6)]">R$ 37,00</p>
                <p className="text-sm md:text-base text-gray-400">por mês</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                {[
                  "Acesso ao close friends do Instagram",
                  "Testes em tempo real - o que funciona e o que falha",
                  "Bastidores sem filtro das operações",
                  "Estratégias de tráfego e X1 no WhatsApp",
                  "A verdade sobre o digital, não apenas resultados bonitinhos",
                  "Stories destacados com cases reais e aprendizados"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="w-full text-base md:text-lg py-5 md:py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold shadow-[0_0_50px_rgba(212,0,166,0.5)] hover:shadow-[0_0_70px_rgba(212,0,166,0.7)] transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Garantir Minha Vaga Agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4 text-xs text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Garantia de 7 Dias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--gta-orange))]/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative z-10 max-w-4xl mx-auto">
          <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/30 text-center hover:border-[hsl(var(--gta-magenta))]/60 transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,0,166,0.2)] animate-fade-in">
            <CardContent className="pt-6 space-y-4">
              <Shield className="w-16 h-16 md:w-20 md:h-20 mx-auto text-[hsl(var(--gta-magenta))] animate-pulse drop-shadow-[0_0_30px_rgba(212,0,166,0.6)]" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-gta uppercase text-white">
                Garantia Incondicional de <span className="text-[hsl(var(--gta-magenta))]">7 Dias</span>
              </h3>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4">
                Se você não ficar completamente satisfeito com o conteúdo do close friends, basta solicitar o reembolso em até 7 dias e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase text-white">
              Perguntas <span className="text-[hsl(var(--gta-magenta))]">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-zinc-900 border-zinc-800 rounded-lg px-4 md:px-6 hover:border-[hsl(var(--gta-magenta))]/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <AccordionTrigger className="text-white hover:text-[hsl(var(--gta-magenta))] text-left text-sm md:text-base transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Final atmospheric gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[hsl(var(--gta-magenta))]/10 rounded-full blur-[140px]" />
        </div>
        
        <div className="container relative z-10 max-w-4xl mx-auto">
          <Card className="bg-zinc-900 border-[hsl(var(--gta-magenta))]/50 text-center hover:border-[hsl(var(--gta-magenta))] transition-all duration-500 shadow-[0_0_60px_rgba(212,0,166,0.3)] animate-fade-in">
            <CardContent className="pt-8 md:pt-12 pb-8 md:pb-12 space-y-4 md:space-y-6 px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-gta uppercase">
                <span className="text-white">Pronto Para Ver os</span>
                <br />
                <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_rgba(212,0,166,0.6)]">Bastidores Reais?</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Junte-se aos membros que já têm acesso ao que realmente funciona no digital
              </p>
              
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 mt-4 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold shadow-[0_0_50px_rgba(212,0,166,0.5)] hover:shadow-[0_0_70px_rgba(212,0,166,0.7)] transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Garantir Meu Acesso Agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4 text-xs md:text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>7 dias de garantia</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--gta-orange))]" />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RPClose;
