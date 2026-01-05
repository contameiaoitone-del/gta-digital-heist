import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CheckCircle2, XCircle, PlayCircle, Bot, MessageSquare, Rocket, Repeat, Shield, Clock, Award, Zap, Target, TrendingUp, Sparkles, Package, DollarSign, Megaphone, BarChart3, HandCoins } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";
import module1Cover from "@/assets/rp-zap-module-1.png";
import module2Cover from "@/assets/rp-zap-module-2.png";
import module3Cover from "@/assets/rp-zap-module-3.png";
import module4Cover from "@/assets/rp-zap-module-4.png";

const moduleCovers = [
  { image: module1Cover, title: "Seja Bem Vindo" },
  { image: module2Cover, title: "Estruturando Tudo" },
  { image: module3Cover, title: "Criando seu Produto" },
  { image: module4Cover, title: "Meta Ads Parte 1" },
];
const RPZap = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Função para pausar o vídeo do PandaVideo
  const pauseVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: 'pause' }, '*');
    }
  };

  // Pausar quando a página perde visibilidade (troca de aba)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const { getCheckoutUrl } = useCheckoutUrl();
  const checkoutUrl = getCheckoutUrl("https://pay.cakto.com.br/3dsuw79_671863");
  const modules = [{
    icon: Sparkles,
    title: "Seja Bem Vindo",
    description: "Entenda a metodologia completa e prepare sua mentalidade para a operação"
  }, {
    icon: Package,
    title: "Estruturando a Operação",
    description: "Configure toda sua estrutura de vendas do zero, passo a passo"
  }, {
    icon: Target,
    title: "Criando Oferta",
    description: "Crie seu infoproduto de lowticket usando Inteligência Artificial"
  }, {
    icon: Megaphone,
    title: "Campanhas",
    description: "Monte suas campanhas no Meta Ads que convertem de verdade"
  }, {
    icon: BarChart3,
    title: "Hacks do ROI",
    description: "Otimize suas campanhas e escale seus resultados com estratégias avançadas"
  }];
  const forWho = ["Quem quer começar no digital com pouco investimento", "Quem quer criar e vender seu próprio infoproduto", "Quem quer aprender tráfego pago do zero", "Quem quer uma metodologia validada de vendas no WhatsApp"];
  const notForWho = ["Quem busca esquemas de dinheiro fácil", "Quem não está disposto a aprender tráfego pago", "Quem quer resultados sem executar as aulas", "Quem não tem R$20-50/dia para investir em tráfego inicial"];
  const faqs = [{
    question: "Quanto preciso investir em tráfego para começar?",
    answer: "Recomendo começar com R$20-50 por dia em tráfego. Com essa verba você já consegue validar sua oferta e começar a ter resultados. Conforme for vendendo, você reinveste e escala."
  }, {
    question: "Funciona mesmo entregando o produto antes de receber?",
    answer: "Sim! A estratégia Pay After Delivery quebra completamente a objeção do cliente. Ele recebe o produto, vê o valor, e paga com confiança. A taxa de pagamento é altíssima quando você entrega valor real."
  }, {
    question: "Preciso de experiência com Meta Ads?",
    answer: "Não! O treinamento ensina do zero. Você vai aprender a criar campanhas mesmo nunca tendo mexido no gerenciador de anúncios. Tudo passo a passo."
  }, {
    question: "Quanto tempo leva pra criar meu infoproduto com IA?",
    answer: "Com as ferramentas e prompts que eu ensino, você consegue criar seu infoproduto em 1-3 dias. Nada de meses desenvolvendo conteúdo."
  }, {
    question: "Por que receber no Pix e não em plataformas?",
    answer: "Recebendo direto no Pix você não paga taxas de plataforma (que podem chegar a 10-15%). 100% do dinheiro vai pra você. Isso faz diferença enorme na margem."
  }];
  const methodology = [{
    icon: Package,
    step: "01",
    title: "Crie",
    description: "Infoproduto com IA"
  }, {
    icon: Megaphone,
    step: "02",
    title: "Atraia",
    description: "Tráfego via Meta Ads"
  }, {
    icon: MessageSquare,
    step: "03",
    title: "Venda",
    description: "WhatsApp + Pay After Delivery"
  }, {
    icon: HandCoins,
    step: "04",
    title: "Receba",
    description: "Direto no Pix"
  }];
  return <div className="min-h-screen bg-black scroll-smooth">
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
              ⚡ RP Zap
            </Badge>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-gta uppercase leading-tight animate-fade-in">
              <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_hsl(var(--gta-magenta)/0.5)]">LOWTICKET NO WHATSAPP</span>
              <br />
              <span className="text-white">AUTOMATICO E DIRETO NO PIX</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
              Crie seu próprio infoproduto de lowticket com I.A e venda no WhatsApp com a estratégia <span className="text-[hsl(var(--gta-magenta))] font-semibold">Pay After Delivery</span> - recebendo direto no Pix
            </p>

            {/* VSL Video */}
            <div className="relative max-w-sm mx-auto aspect-[9/16] rounded-lg overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(212,0,166,0.2)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <iframe 
                ref={iframeRef}
                id="panda-4dcc2c5f-e6aa-4fa7-bd4f-838928028135" 
                src="https://player-vz-a0225c98-3ba.tv.pandavideo.com.br/embed/?v=4dcc2c5f-e6aa-4fa7-bd4f-838928028135" 
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" 
                allowFullScreen
              />
            </div>

            {/* CTA Button */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/50 blur-xl rounded-lg animate-pulse" />
              <Button size="lg" className="relative text-sm md:text-lg px-6 md:px-8 py-5 md:py-6 mt-4 md:mt-8 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_hsl(var(--gta-magenta)/0.4)]" asChild>
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={pauseVideo}
                  data-gtm-category="checkout"
                  data-gtm-action="click"
                  data-gtm-label="rp-zap-hero"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Entrar no RP Zap agora!
                </a>
              </Button>
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
              <span className="text-[hsl(var(--gta-magenta))]">Já tentou</span> <span className="text-white">tráfego direto, dropshipping,</span>
              <br className="hidden sm:block" />
              <span className="text-white">encapsulados e outras coisas</span> <span className="text-[hsl(var(--gta-magenta))]">sem sucesso?</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400">
              Se identificou com algum desses problemas?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {["Não sabe como criar um infoproduto que venda", "Gasta dinheiro demais com tráfego sem ter retorno", "Não consegue escalar porque demora pra sacar das plataformas", "Outros negócios precisam de muito dinheiro pra começar"].map((problem, i) => <Card key={i} className="bg-zinc-900/80 border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(239,68,68,0.3)] group" style={{
            animationDelay: `${i * 100}ms`
          }}>
                <CardContent className="pt-5 md:pt-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1 group-hover:animate-pulse" />
                  <p className="text-white text-sm md:text-base">{problem}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Solution Section - 3 Pillars */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        {/* Magenta atmospheric gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gta-magenta)/0.1)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <Badge variant="outline" className="border-[hsl(var(--gta-orange))] text-[hsl(var(--gta-orange))] px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-transparent">
              🚀 A Metodologia
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-gta uppercase">
              <span className="text-white">Os 3 Pilares do</span>{" "}
              <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_20px_hsl(var(--gta-magenta)/0.5)]">RP Zap</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
              A metodologia que me permite vender lowticket no automático todos os dias
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[{
            icon: Sparkles,
            title: "Infoproduto com IA",
            desc: "Crie seu produto em minutos, não meses"
          }, {
            icon: HandCoins,
            title: "Pay After Delivery",
            desc: "Entregue primeiro, receba depois - sem objeções"
          }, {
            icon: DollarSign,
            title: "Direto no Pix",
            desc: "Sem taxas de plataforma, 100% pra você"
          }].map((item, i) => <Card key={i} className="bg-zinc-900/80 border-zinc-800 text-center hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_hsl(var(--gta-magenta)/0.3)] group" style={{
            animationDelay: `${i * 150}ms`
          }}>
                <CardContent className="pt-6 md:pt-8 pb-6 md:pb-8 space-y-3 md:space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <item.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto text-[hsl(var(--gta-magenta))] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-gta text-lg md:text-xl text-white">{item.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Methodology Visual Section */}
      <section className="py-12 md:py-20 px-4 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--gta-magenta)/0.08)_0%,transparent_60%)]" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gta uppercase text-white px-2">
              Como <span className="text-[hsl(var(--gta-magenta))]">Funciona</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400">
              4 passos simples para vender no automático
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {methodology.map((step, i) => <div key={i} className="relative group">
                {/* Connection line */}
                {i < methodology.length - 1 && <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-[hsl(var(--gta-magenta))]/50 to-transparent transform translate-x-1/2 -translate-y-1/2 z-0" />}
                
                <Card className="bg-zinc-900/80 border-zinc-800 text-center hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:-translate-y-2 relative z-10">
                  <CardContent className="pt-6 pb-6 space-y-3">
                    <div className="text-[hsl(var(--gta-magenta))] font-gta text-2xl md:text-3xl opacity-50">
                      {step.step}
                    </div>
                    <div className="relative inline-block">
                      <step.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto text-[hsl(var(--gta-magenta))] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-gta text-lg md:text-xl text-white">{step.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </div>)}
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
            <p className="text-base md:text-xl text-gray-400">
              5 módulos direto ao ponto para você começar a vender
            </p>
          </div>

          {/* Module Covers Carousel */}
          <div className="mb-10 md:mb-14 px-4 md:px-12">
            <Carousel
              opts={{ align: "center", loop: true }}
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {moduleCovers.map((module, index) => (
                  <CarouselItem key={index} className="pl-3 md:pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="relative group cursor-pointer">
                      <div className="aspect-[2/3] overflow-hidden rounded-xl border-2 border-zinc-800 group-hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 shadow-lg">
                        <img 
                          src={module.image} 
                          alt={module.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800 text-white" />
              <CarouselNext className="hidden md:flex -right-10 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800 text-white" />
            </Carousel>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {modules.map((module, i) => <Card key={i} className="bg-zinc-900/80 border-zinc-800 hover:border-[hsl(var(--gta-magenta))]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_hsl(var(--gta-magenta)/0.25)] group" style={{
            animationDelay: `${i * 100}ms`
          }}>
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
              </Card>)}
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
                {forWho.map((item, i) => <div key={i} className="flex items-start gap-3 group" style={{
                animationDelay: `${i * 100}ms`
              }}>
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>)}
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
                {notForWho.map((item, i) => <div key={i} className="flex items-start gap-3 group" style={{
                animationDelay: `${i * 100}ms`
              }}>
                    <XCircle className="w-5 h-5 text-[hsl(var(--gta-orange))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-gray-400 text-sm md:text-base">{item}</p>
                  </div>)}
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
                <p className="text-sm text-gray-500 line-through">De R$ 497,00</p>
                <p className="text-4xl md:text-5xl font-gta text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_15px_hsl(var(--gta-magenta)/0.4)]">R$ 97,00</p>
                <p className="text-gray-400 text-sm md:text-base">ou 12x de R$ 11,36</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                {["Acesso vitalício ao treinamento completo", "Método de criação de infoproduto com IA", "Estratégias de campanhas no Meta Ads", "Metodologia Pay After Delivery", "Scripts de vendas testados para WhatsApp"].map((item, i) => <div key={i} className="flex items-center gap-3 group" style={{
                animationDelay: `${i * 50}ms`
              }}>
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gta-magenta))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-white text-sm md:text-base">{item}</p>
                  </div>)}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/40 blur-xl rounded-lg animate-pulse" />
                <Button size="lg" className="relative w-full text-sm md:text-lg py-5 md:py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-[1.02] transition-all duration-300" asChild>
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={pauseVideo}
                    data-gtm-category="checkout"
                    data-gtm-action="click"
                    data-gtm-label="rp-zap-pricing"
                  >
                    <Target className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Entrar no RP Zap agora!
                  </a>
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
                  Se você assistir as aulas, aplicar a metodologia e não gostar, devolvemos 100% do seu dinheiro. 
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
            {faqs.map((faq, i) => <AccordionItem key={i} value={`item-${i}`} className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 md:px-6 hover:border-[hsl(var(--gta-magenta))]/30 transition-colors duration-300 data-[state=open]:border-[hsl(var(--gta-magenta))]/50">
                <AccordionTrigger className="text-left text-white hover:text-[hsl(var(--gta-magenta))] transition-colors text-sm md:text-base py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm md:text-base pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 px-4 relative bg-black overflow-hidden">
        {/* Dramatic gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--gta-magenta)/0.2)_0%,transparent_70%)]" />
        
        <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-gta uppercase px-2 animate-fade-in">
            <span className="text-white">Pronto Para Criar Seu</span>
            <br />
            <span className="text-[hsl(var(--gta-magenta))] drop-shadow-[0_0_30px_hsl(var(--gta-magenta)/0.5)]">Negócio de Lowticket?</span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Crie seu infoproduto com IA, rode tráfego e venda no automático recebendo direto no Pix
          </p>
          
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[hsl(var(--gta-magenta))]/50 blur-2xl rounded-lg animate-pulse" />
            <Button size="lg" className="relative text-sm md:text-lg px-8 md:px-12 py-5 md:py-6 bg-[hsl(var(--gta-magenta))] hover:bg-[hsl(var(--gta-magenta))]/90 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_hsl(var(--gta-magenta)/0.5)]" asChild>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={pauseVideo}
                data-gtm-category="checkout"
                data-gtm-action="click"
                data-gtm-label="rp-zap-final-cta"
              >
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Entrar no RP Zap agora!
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default RPZap;