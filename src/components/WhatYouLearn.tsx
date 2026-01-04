import { DollarSign, Megaphone, Sparkles, Users, Video, Package } from "lucide-react";
import module1Cover from "@/assets/rla-module-1.png";
import module2Cover from "@/assets/rla-module-2.png";
import module3Cover from "@/assets/rla-module-3.png";
import module4Cover from "@/assets/rla-module-4.png";
import module5Cover from "@/assets/rla-module-5.png";
import module6Cover from "@/assets/rla-module-6.png";
import module7Cover from "@/assets/rla-module-7.png";
import module8Cover from "@/assets/rla-module-8.png";
import module9Cover from "@/assets/rla-module-9.png";
import module10Cover from "@/assets/rla-module-10.png";
import module11Cover from "@/assets/rla-module-11.png";
import module12Cover from "@/assets/rla-module-12.png";
import module13Cover from "@/assets/rla-module-13.png";
import module14Cover from "@/assets/rla-module-14.png";
import module15Cover from "@/assets/rla-module-15.png";
import module16Cover from "@/assets/rla-module-16.png";
import module17Cover from "@/assets/rla-module-17.png";
import module18Cover from "@/assets/rla-module-18.png";
import module19Cover from "@/assets/rla-module-19.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const moduleCovers = [
  { image: module1Cover, title: "Tudo sobre Whatsapp" },
  { image: module2Cover, title: "Conceitos do Digital" },
  { image: module3Cover, title: "Produtos e Nichos" },
  { image: module4Cover, title: "Estruturando Tudo" },
  { image: module5Cover, title: "Criando seu Produto" },
  { image: module6Cover, title: "Meta Ads Parte 1" },
  { image: module7Cover, title: "Meta Ads Parte 2" },
  { image: module8Cover, title: "Códigos de Trapaça" },
  { image: module9Cover, title: "Dúvidas" },
  { image: module10Cover, title: "Tudo sobre Criativos" },
  { image: module11Cover, title: "Análise e Otimização de Métricas" },
  { image: module12Cover, title: "Tudo sobre TikTok Ads" },
  { image: module13Cover, title: "Tudo sobre Google Ads" },
  { image: module14Cover, title: "Tráfego para Negócios Locais" },
  { image: module15Cover, title: "Tráfego para E-commerce" },
  { image: module16Cover, title: "Tráfego para Infoprodutos" },
  { image: module17Cover, title: "Calls ao Vivo" },
  { image: module18Cover, title: "Criando Sites com I.A" },
  { image: module19Cover, title: "Meta Ads Parte 3" },
];

const modules = [
  {
    icon: DollarSign,
    title: "Escale do Zero a R$10k/mês",
    description: "Escale do zero a R$10k/mês o mais rápido possível"
  },
  {
    icon: Megaphone,
    title: "Domine Tráfego Pago Completamente",
    description: "Meta Ads, Google Ads, Tiktok Ads 100% avançado com tudo que você precisa saber e atualizado. Aprenda e já comece a monetizar isso"
  },
  {
    icon: Sparkles,
    title: "Aprenda a Fazer Sites com IA",
    description: "Domine as ferramentas de IA para criar sites profissionais e lucrativos"
  },
  {
    icon: Users,
    title: "Networking com Alunos de Resultado",
    description: "Tenha acesso a uma comunidade exclusiva no whatsapp com alunos que já estão ganhando dinheiro de verdade e tenha acesso ao que funciona em tempo real"
  },
  {
    icon: Video,
    title: "Acompanhamento Semanal ao Vivo",
    description: "Entre em call 2x por semana e tenha um direcionamento personalizado tirando todas as suas dúvidas"
  },
  {
    icon: Package,
    title: "Infoprodutos",
    description: "Tenha acesso a estratégias e funis validados que estão funcionando no momento, funis de x1 do whatsapp, tráfego direto, tudo"
  }
];

export const WhatYouLearn = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-neon-pink/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que você vai
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              dominar
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um sistema completo com tudo que você precisa para transformar sua vida digital
          </p>
        </div>

        {/* Module Covers Carousel */}
        <div className="mb-12 md:mb-16 px-4 md:px-12">
          <Carousel
            opts={{ align: "center", loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {moduleCovers.map((module, index) => (
                <CarouselItem key={index} className="pl-3 md:pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="relative group cursor-pointer">
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border-2 border-border/50 group-hover:border-primary/70 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_hsl(330_85%_65%_/_0.4)]">
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
            <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 border-border hover:bg-primary/20 hover:border-primary" />
            <CarouselNext className="hidden md:flex -right-12 bg-card/80 border-border hover:bg-primary/20 hover:border-primary" />
          </Carousel>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-lg bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_hsl(330_85%_65%_/_0.4),_0_0_60px_hsl(330_85%_65%_/_0.2)] hover:scale-[1.05] animate-fade-in overflow-hidden"
              style={{ 
                animationDelay: `${index * 100}ms`,
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
              }}
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-run" style={{ backgroundSize: "200% 100%" }}></div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-neon-pink/0 group-hover:from-primary/10 group-hover:to-neon-pink/10 transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_hsl(330_85%_65%_/_0.3)] group-hover:shadow-[0_0_40px_hsl(330_85%_65%_/_0.8)] group-hover:animate-neon-flicker">
                  <module.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-gta font-bold mb-2 group-hover:text-neon-pink transition-colors duration-300">
                  {module.title}
                </h3>
                
                <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
