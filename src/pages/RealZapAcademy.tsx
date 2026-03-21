import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

import { ArrowRight, ChevronRight, ChevronLeft, X, Shield, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";
import caioDalcinPhoto from "@/assets/caio-dalcin.jpeg";
import cityBackground from "@/assets/city-background.png";

import infozapMod1 from "@/assets/infozap-mod-1.png";
import infozapMod2 from "@/assets/infozap-mod-2.png";
import infozapMod3 from "@/assets/infozap-mod-3.png";
import infozapMod4 from "@/assets/infozap-mod-4.png";
import infozapMod5 from "@/assets/infozap-mod-5.png";

import result1 from "@/assets/result-1.jpeg";
import result2 from "@/assets/result-2.jpeg";
import result3 from "@/assets/result-3.jpeg";
import result4 from "@/assets/result-4.jpeg";
import result5 from "@/assets/result-5.jpeg";
import result6 from "@/assets/result-6.jpeg";
import result7 from "@/assets/result-7.jpeg";

const moduleCovers = [
  { image: infozapMod1, title: "Bem-vindo" },
  { image: infozapMod2, title: "Setup Completo" },
  { image: infozapMod3, title: "Criando Produto" },
  { image: infozapMod4, title: "ZapData" },
  { image: infozapMod5, title: "Meta Ads" },
];

const CHECKOUT_BASE = "https://pay.cakto.com.br/35g8dhq_697665";

const GREEN = "#00ff88";
const PINK = "#ff2d78";

const enemyBlocks = [
  { title: "Começou pelo modelo errado", desc: "Drop exige capital e produto físico. Afiliado exige audiência e paga comissão miserável. Gestão de tráfego exige portfólio e o oceano azul secou. Tráfego direto prende seu dinheiro no checkout por 30 dias. Nenhum desses foi feito pra quem está começando do zero com pouco dinheiro no bolso." },
  { title: "Comprou curso que não entregou", desc: "Você assistiu tudo, anotou tudo, seguiu o passo a passo — e na hora de executar travou. O guru ficou rico. Você ficou com a conta no vermelho e a autoconfiança destruída. Metodologia falha, conteúdo raso, suporte zero." },
  { title: "Não sabe ler métricas e toma decisão no chute", desc: "CPM alto, CTR baixo, custo por conversa subindo — os números estão gritando o que fazer mas você não sabe interpretar. Pausa o que não devia, sobe o que não devia e joga dinheiro fora toda semana sem entender por quê a campanha não evolui." },
  { title: "Tenta escalar e o WhatsApp trava tudo", desc: "Aumenta o volume, o WhatsApp bloqueia o número, o chip queima, a operação para. Sem saber a estrutura certa de chips, rodízio e múltiplos números, a escala vira pesadelo — e você volta pro mesmo volume de antes com dinheiro a menos." },
  { title: "Sem estrutura certa de tráfego, a campanha morre", desc: "O criativo que funcionou semana passada já não converte mais. Você não sabe a metodologia certa de tráfego, não sabe testar, não sabe identificar métricas. A campanha morre, você começa do zero, perde tempo e dinheiro — e o ciclo se repete." },
];

const mechanismBenefits = [
  { emoji: "💸", title: "Começa com R$15/dia", desc: "Não precisa de capital alto pra testar. Com a taxa de conversão do Pay After Delivery você tem retorno rápido e reinveste no mesmo dia." },
  { emoji: "🔒", title: "Zero reembolso", desc: "O cliente recebe o produto antes de pagar. Não tem o que devolver. O Pix vem e fica." },
  { emoji: "💰", title: "Liquidez imediata", desc: "Cada venda cai direto no Pix na hora. Sem checkout segurando seu dinheiro por 30 dias. Você reinveste e cresce." },
  { emoji: "🤖", title: "Funil 100% automático com IA", desc: "A IA atende, entrega e cobra — tudo sozinha. Você não precisa estar presente. O funil roda enquanto você dorme." },
  { emoji: "🎯", title: "Campanha que vira máquina de vendas", desc: "Com o pixel configurado no WhatsApp, o Meta Ads otimiza automaticamente pro público comprador. Com o tempo para de ser anúncio e vira máquina." },
  { emoji: "📈", title: "De zero a R$1.000/dia em menos de 1 mês", desc: "A operação é rápida e altamente escalável. Com o método completo do RZA, alunos saem do zero e chegam a 1k por dia em menos de 30 dias." },
];

const statsCards = [
  { number: "+140", desc: "Alunos já aplicando o método" },
  { number: "R$1.000/dia", desc: "Alcançado em menos de 30 dias" },
  { number: "R$500.000", desc: "Gerado pelos alunos" },
  { number: "R$0", desc: "Reembolso com o modelo Pay After Delivery" },
];

const videoTestimonials = [
  { name: "Saulo", result: "Só com o limite do cartão. Em 7 dias fez R$1.000", videoId: "bf2cbaf3-11c9-4f66-a9b7-0b8db5a7ccbf" },
  { name: "Gilson", result: "Primeiro mês fez R$10.000. Sem experiência, sem aparecer", videoId: "a963887a-0124-4bb2-989c-ffaf393baf3a" },
  { name: "Eric", result: "20 dias de treinamento fez R$8.000 no Pix", videoId: "bf8fb158-3a94-4da0-81c5-9fdaf2f8ba3c" },
  { name: "Alunos comemorando 😂", result: "Pix caindo em tempo real — notificação após notificação", videoId: "7a1f82b2-8752-443d-ac10-0246361aca6b" },
];

const resultPrints = [
  { src: result1, caption: "Primeiro Pix no mesmo dia" },
  { src: result2, caption: "Vendas todos os dias" },
  { src: result3, caption: "Resultado em menos de 1 semana" },
  { src: result4, caption: "Funil rodando no automático" },
  { src: result5, caption: "Pix caindo todo dia" },
  { src: result6, caption: "De zero a R$1k/dia" },
  { src: result7, caption: "Resultado consistente" },
];

const baseModules = [
  { num: "01", title: "Bem-vindo ao Real Zap Academy", subs: ["Como funciona a operação completa de lowticket no WhatsApp", "Exemplo real do funil rodando", "Mapa da jornada do zero ao primeiro Pix"] },
  { num: "02", title: "O que você vai precisar", subs: ["As 3 ferramentas: WhatsApp + ZapData + Meta Ads", "Configurando WhatsApp do zero", "Free trial ZapData — como ativar"] },
  { num: "03", title: "Criando seu produto", subs: ["Criar infoproduto sem experiência", "Mineração de oferta que vende", "Configurando funil completo no ZapData"] },
  { num: "04", title: "IA de WhatsApp com ZapData", subs: ["IA pra responder, entregar e cobrar", "Funil 24h automático no WhatsApp", "ZapData do zero ao avançado"] },
  { num: "05", title: "Primeiros anúncios no Meta", subs: ["Criando campanha do zero com R$15/dia", "Segmentação para lowticket", "Otimização e escala inicial"] },
  { num: "06", title: "Funis prontos pra copiar e colar", subs: ["3 produtos digitais já validados", "3 funis completos prontos pra importar no ZapData", "Criativos dos funis inclusos"] },
];

const advancedModules = [
  { num: "07", title: "Tráfego Avançado", subs: ["Fluxograma da estrutura de tráfego", "Metodologia de campanhas de alta conversão", "Como marcar vendas no gerenciador", "Como pegar o Post ID do anúncio"] },
  { num: "08", title: "Análise e Otimização de Métricas", subs: ["Organização de colunas de métricas", "Métricas personalizadas", "Análise de métricas na prática", "Fluxograma de tomada de decisões"] },
  { num: "09", title: "Tudo sobre Escala", subs: ["Como funciona a escala no WhatsApp", "Chips físicos x virtuais", "Onde comprar chips", "Múltiplos WhatsApps no iPhone", "Rodízio de número", "Pré escala e escala", "Escala de tráfego"] },
  { num: "10", title: "Tudo sobre Criativos", subs: ["Módulo completo de criativos avançados", "Ângulos, variações e testes", "Como criar antes de esgotar"] },
  { num: "11", title: "Códigos de Trapaças", subs: ["Hacks e atalhos exclusivos pra acelerar a operação", "O que só quem opera em alto nível descobre"] },
];

const bonuses = [
  { emoji: "⚡", title: "Free Trial 3 Dias ZapData", desc: "Teste a IA de WhatsApp sem pagar nada por 3 dias.", value: "R$47", resolves: "Medo de investir em ferramenta sem testar" },
  { emoji: "📦", title: "3 Produtos Validados + Funis Prontos", desc: "3 infoprodutos já validados com funil completo pronto pra importar no ZapData.", value: "R$197", resolves: "Não saber o que vender nem como montar o funil" },
  { emoji: "📊", title: "Planilha de Lucro", desc: "Acompanhe faturamento, custos e lucro real em tempo real.", value: "R$47", resolves: "Não saber se está lucrando ou perdendo dinheiro" },
  { emoji: "🤝", title: "Grupo de Networking Exclusivo", desc: "Acesso ao grupo com outros operadores trocando resultado, estratégia e parceria.", value: "R$197", resolves: "Isolamento e falta de networking com quem está no mesmo nível" },
  { emoji: "👑", title: "Comunidade VIP Real Zap Academy", desc: "Acesso vitalício à comunidade exclusiva do RZA.", value: "R$97", resolves: "Falta de suporte e comunidade após o curso" },
];

const valueStack = [
  { item: "Real Zap Academy — 11 módulos completos", value: "R$697" },
  { item: "Módulo ZapData Completo", value: "R$97" },
  { item: "3 Funis Prontos + Produtos Validados", value: "R$197" },
  { item: "Free Trial ZapData 3 dias", value: "R$47" },
  { item: "Planilha de Lucro", value: "R$47" },
  { item: "Grupo de Networking Exclusivo", value: "R$197" },
  { item: "Comunidade VIP Real Zap Academy", value: "R$97" },
];

const notForYouItems = [
  "Quer resultado sem investir pelo menos R$15/dia em anúncio",
  "Busca fórmula mágica sem processo — aqui você vai precisar executar",
  "Já desistiu de tudo que começou antes de ver resultado",
  "Não está disposto a seguir o método do zero ao fim sem pular etapa",
  "Acha que o problema é o modelo — o modelo funciona, o problema é a execução",
];

const faqs = [
  { q: "O Real Zap Academy inclui o conteúdo do InfoZap?", a: "Sim. O RZA inclui 100% do conteúdo do InfoZap mais os módulos avançados. Se você está começando do zero não precisa comprar o InfoZap antes — tudo está aqui." },
  { q: "Qual a diferença do InfoZap pro Real Zap Academy?", a: "O InfoZap é o treinamento base — do zero ao primeiro Pix. O Real Zap Academy é o treinamento completo — do zero a R$1.000/dia — com módulos avançados de tráfego, métricas, escala de WhatsApp, criativos e hacks exclusivos que o InfoZap não tem." },
  { q: "Preciso ter experiência pra comprar?", a: "Não. O RZA foi feito pra quem está começando do zero e pra quem já vende e quer escalar. O método cobre os dois casos do início ao fim." },
  { q: "Quanto preciso investir em anúncio?", a: "Dá pra começar com R$15/dia. Com os módulos avançados de tráfego e métricas você vai saber exatamente quando e como aumentar o orçamento com segurança." },
  { q: "Por quanto tempo tenho acesso?", a: "Acesso vitalício — incluindo todas as atualizações futuras sem custo adicional." },
  { q: "E se eu não gostar?", a: "Garantia incondicional de 7 dias. Devolução total sem perguntas. O risco é 100% nosso." },
  { q: "Quando recebo o acesso?", a: "Imediatamente após confirmação do pagamento. Pix é instantâneo — seu acesso também." },
];

const RealZapAcademy = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const { getCheckoutUrl } = useCheckoutUrl();
  const checkoutUrl = getCheckoutUrl(CHECKOUT_BASE);

  const [printsRef, printsApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrintsPrev = useCallback(() => printsApi?.scrollPrev(), [printsApi]);
  const scrollPrintsNext = useCallback(() => printsApi?.scrollNext(), [printsApi]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const CTAButton = ({ small = false }: { small?: boolean }) => (
    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
      <Button
        className={`bg-[${GREEN}] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-[0.97] ${small ? "w-full sm:w-auto h-10 px-4 sm:px-6 text-sm" : "w-full md:w-auto h-12 md:h-14 px-4 md:px-10 text-base md:text-lg"} rounded-lg`}
        style={{ backgroundColor: GREEN }}
      >
        {small ? "Quero acessar agora" : "🔥 Quero acessar o Real Zap Academy"}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </a>
  );

  const ModuleList = ({ modules, label }: { modules: typeof baseModules; label: string }) => (
    <div className="mb-8">
      <h3 className="text-lg md:text-xl font-bold mb-4 px-2" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
        {label}
      </h3>
      <div className="space-y-3">
        {modules.map((mod, i) => (
          <div key={i} className="border rounded-xl px-5 py-4" style={{ borderColor: "#222", backgroundColor: "#111" }}>
            <div className="flex items-center gap-4 text-left mb-3">
              <span className="text-sm font-bold" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem" }}>
                {mod.num}
              </span>
              <span className="text-white font-semibold text-base">{mod.title}</span>
            </div>
            <div className="space-y-2 pb-2">
              {mod.subs.map((sub, j) => (
                <div key={j} className="flex items-center gap-2 text-gray-400 text-sm">
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GREEN }} />
                  {sub}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: "#080808", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      {/* HERO */}
      <section ref={heroRef} className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#080808]">
          <img src={cityBackground} alt="" className="w-full h-full object-cover opacity-[0.18]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ color: GREEN, borderColor: GREEN, backgroundColor: "rgba(0,255,136,0.08)" }}>
            🏆 Treinamento Completo — Real Zap Academy
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}>
            O treinamento mais completo de LowTicket no WhatsApp —{" "}
            <span style={{ color: PINK }}>do zero a R$1.000/dia.</span>
          </h1>

          <div className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed space-y-2 flex flex-col items-center">
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>⚡ Do primeiro Pix à escala completa — tudo numa operação só</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>📊 Métricas, otimização e decisão com dados — sem mais chute</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>📱 Escala de WhatsApp sem bloqueio — chips, rodízio e múltiplos números</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>🎯 Estrutura de Tráfego completa e infálivel</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>🏆 Comunidade VIP + Grupo de networking exclusivo</p>
          </div>

          <CTAButton />

          <p className="mt-4 text-sm text-gray-300" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            🔒 Acesso imediato · Garantia 7 dias · Sem mensalidade
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
      </section>

      {/* SEÇÃO 2 — IDENTIFICAÇÃO / PAIN */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: PINK }}>O Problema</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Seja você iniciante ou já vende —{" "}
            <span style={{ color: PINK }}>algo está travando você de chegar em R$1.000/dia.</span>
          </h2>

          <div className="space-y-8 mt-10 text-gray-400 text-[17px] leading-relaxed">
            {/* Se está começando */}
            <div className="rounded-xl p-6 border" style={{ borderColor: "rgba(255,45,120,0.2)", backgroundColor: "rgba(255,45,120,0.04)" }}>
              <h3 className="font-bold text-white text-lg mb-3">Se você está começando:</h3>
              <p>Já tentou entender o digital mas tem tanta coisa que não sabe por onde começar. Afiliado, drop, encapsulado, gestão de tráfego — cada um fala de um modelo diferente e nenhum parece simples o suficiente pra funcionar de verdade. Você quer um caminho claro, do zero ao resultado, sem precisar comprar 10 cursos diferentes.</p>
            </div>

            {/* Se já vende */}
            <div className="rounded-xl p-6 border" style={{ borderColor: "rgba(255,45,120,0.2)", backgroundColor: "rgba(255,45,120,0.04)" }}>
              <h3 className="font-bold text-white text-lg mb-3">Se você já vende:</h3>
              <p>Você aprendeu o modelo. Fez as primeiras vendas. O Pix começou a cair. Mas chegou um ponto onde tudo parou de crescer. A campanha que convertia virou prejuízo. O criativo esgotou. Tentou escalar e o WhatsApp bloqueou. Olha pro gerenciador e os números não dizem nada. E o pior: você já provou que o modelo funciona mas continua preso no mesmo patamar todo mês.</p>
            </div>

            <p className="font-bold text-white text-center text-lg">
              Nos dois casos o problema é o mesmo: <span style={{ color: GREEN }}>Falta o método completo. Do básico ao avançado. Numa operação só.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — O INIMIGO */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Por que a maioria não sai do zero —{" "}
            <span style={{ color: PINK }}>ou trava antes de chegar em R$1.000/dia</span>
          </h2>
          <div className="space-y-4 mt-10">
            {enemyBlocks.map((item, i) => (
              <div key={i} className="rounded-xl p-5 border relative" style={{ borderColor: "rgba(255,45,120,0.2)", backgroundColor: "rgba(255,45,120,0.04)" }}>
                <X className="h-5 w-5 absolute top-4 right-4" style={{ color: PINK }} />
                <p className="font-bold text-white mb-1">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-6 text-gray-400 text-[17px] leading-relaxed">
            <p>
              <strong className="text-white">A culpa não foi sua.</strong> Você nunca teve acesso ao método completo — do zero ao avançado — numa operação só.
            </p>
            <p className="font-bold text-lg" style={{ color: GREEN }}>
              O Real Zap Academy foi.
            </p>
            <p>
              Sem modelo complicado. Sem curso raso. Sem métrica que você não entende. Sem escala que quebra o WhatsApp. Sem criativo que esgota sem aviso. <strong className="text-white">Do primeiro Pix a R$1.000/dia — tudo numa operação completa e profissionalizada.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — MECANISMO */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Mecanismo</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Por que o LowTicket no WhatsApp é o modelo mais completo pra qualquer nível
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Não importa se você está começando do zero ou se já vende e quer escalar — o modelo de LowTicket no WhatsApp com Pay After Delivery funciona nos dois casos porque elimina as principais barreiras de qualquer operação digital.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mechanismBenefits.map((b, i) => (
              <div key={i} className="rounded-xl p-6 border" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <div className="text-2xl mb-3">{b.emoji}</div>
                <h4 className="font-bold text-white mb-2">{b.title}</h4>
                <p className="text-gray-400 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — RESULTADOS REAIS */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Resultados Reais</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Não é promessa. É o que já está acontecendo.
          </h2>
          <p className="text-gray-400 text-base mb-10">Iniciantes e quem já vendia. Os dois chegaram no mesmo lugar.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {statsCards.map((s, i) => (
              <div key={i} className="rounded-xl p-6 border text-center" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>{s.number}</p>
                <p className="text-gray-400 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Video Testimonials */}
          <h3 className="text-2xl font-bold text-white mb-8">Depoimentos em vídeo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {videoTestimonials.map((v, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                {v.videoId ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://player-vz-a0225c98-3ba.tv.pandavideo.com.br/embed/?v=${v.videoId}`}
                      className="absolute inset-0 w-full h-full"
                      style={{ border: 'none' }}
                      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
                    <Play className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-white text-base font-bold">{v.name}</p>
                  <p className="text-sm font-semibold" style={{ color: GREEN }}>{v.result}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prints */}
          <h3 className="text-2xl font-bold text-white mb-8">Prints de resultado</h3>
          <div className="relative mb-16">
            <button onClick={scrollPrintsPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg" style={{ backgroundColor: GREEN, color: "#000" }} aria-label="Anterior">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollPrintsNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg" style={{ backgroundColor: GREEN, color: "#000" }} aria-label="Próximo">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="overflow-hidden px-12" ref={printsRef}>
              <div className="flex">
                {resultPrints.map((p, i) => (
                  <div key={i} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%] min-w-0 px-3">
                    <div className="rounded-2xl border overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                      <div className="p-2">
                        <img src={p.src} alt={p.caption} className="w-full h-auto object-contain rounded-xl" />
                      </div>
                      <p className="text-sm font-bold px-4 pb-3" style={{ color: "#9ca3af" }}>{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Closing */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm leading-relaxed italic">
              Essas pessoas estavam exatamente onde você está agora. Sem experiência, sem capital alto, sem saber por onde começar — ou travadas num patamar que não crescia.{" "}
              <span className="text-white font-bold not-italic">A diferença entre eles e você é uma decisão.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — O QUE VOCÊ APRENDE */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Que Você Aprende</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Do primeiro Pix a R$1.000/dia — tudo numa operação só
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            O Real Zap Academy é o único treinamento que cobre a operação completa de LowTicket no WhatsApp — do zero absoluto ao avançado. Não precisa comprar o InfoZap antes. Não vai precisar de mais nada depois. É tudo aqui.
          </p>

          {/* Module Covers Carousel */}
          <div className="mb-12 px-4 md:px-12">
            <Carousel
              opts={{ align: "center", loop: true }}
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {moduleCovers.map((mod, index) => (
                  <CarouselItem key={index} className="pl-3 md:pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="relative group cursor-pointer">
                      <div className="aspect-[2/3] overflow-hidden rounded-xl border-2 border-border/50 group-hover:border-primary/70 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_hsl(330_85%_65%_/_0.4)]">
                        <img src={mod.image} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 border-border hover:bg-primary/20 hover:border-primary" />
              <CarouselNext className="hidden md:flex -right-12 bg-card/80 border-border hover:bg-primary/20 hover:border-primary" />
            </Carousel>
          </div>

          <div className="max-w-3xl mx-auto">
            <ModuleList modules={baseModules} label="📚 MÓDULOS BASE" />
            <ModuleList modules={advancedModules} label="🚀 MÓDULOS AVANÇADOS" />
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIÁRIO */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: "#111" }}>
        <div className="max-w-2xl mx-auto text-center">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button
              className="w-full md:w-auto h-12 md:h-14 px-4 md:px-10 text-base md:text-lg bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-[0.97] rounded-lg"
              style={{ backgroundColor: GREEN }}
            >
              🔥 Quero acessar o Real Zap Academy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p className="mt-3 text-xs text-gray-500">Pagamento único · Acesso imediato · Garantia 7 dias</p>
        </div>
      </section>

      {/* SEÇÃO 7 — BÔNUS */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Bônus Exclusivos</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            E ainda leva isso sem custo adicional
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {bonuses.map((b, i) => (
              <div key={i} className="rounded-xl p-8 border relative" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: GREEN, color: "#000" }}>
                  BÔNUS
                </span>
                <div className="text-3xl mb-4 mt-2">{b.emoji}</div>
                <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{b.desc}</p>
                <div className="h-px w-full mb-4" style={{ backgroundColor: "#2a2a2a" }} />
                <p className="font-bold text-xl" style={{ color: GREEN }}>Valor: <span className="line-through">{b.value}</span></p>
                <p className="text-xs text-gray-500 italic mt-2">Resolve: {b.resolves}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 — VALUE STACK */}
      <section id="comprar" className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block text-center" style={{ color: GREEN }}>O Valor Real</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Quanto vale tudo isso?
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#222", backgroundColor: "#111" }}>
            {valueStack.map((row, i) => (
              <div key={i} className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
                <span className="text-gray-300 text-sm">{row.item}</span>
                <span className="text-gray-500 text-sm font-medium line-through">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
              <span className="text-gray-400 font-semibold">Valor Total</span>
              <span className="text-gray-500 line-through font-bold text-lg">R$1.379</span>
            </div>
            <div className="flex flex-col items-center px-6 py-5 gap-1">
              <span className="font-bold text-lg">Você paga hoje</span>
              <span className="text-gray-400 text-base">12x de</span>
              <span className="font-bold text-4xl" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>R$ 40,34</span>
              <span className="text-gray-500 text-sm mt-1">ou R$397 à vista</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <CTAButton />
            <p className="mt-3 text-xs text-gray-500">🔒 Pagamento único · Acesso imediato · Garantia 7 dias</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 9 — QUEM SOU EU */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#080808]">
          <img src={cityBackground} alt="" className="w-full h-full object-cover opacity-[0.18]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Quem Vai Te Ensinar</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            O método que você vai aprender é o mesmo que eu rodo todo dia
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 flex items-center justify-center" style={{ borderColor: GREEN, backgroundColor: "#141414" }}>
                <img src={caioDalcinPhoto} alt="Caio Dalcin" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <div className="text-gray-200 text-base leading-relaxed space-y-4 p-6 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              <p>5 anos no digital. Comecei do zero como gestor de tráfego, passei por infoproduto, agência, encapsulado, drop — fiz tudo. Errei muito. Aprendi mais ainda.</p>
              <p>Hoje tenho uma empresa de infoprodutos e coproduções rodando. Não ensino teoria. Ensino o que funciona na prática, testado com dinheiro real, todos os dias.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg mx-auto md:mx-0">
            {[
              { number: "5 anos", desc: "Vivendo do digital" },
              { number: "+140", desc: "Alunos formados" },
              { number: "R$500k", desc: "Gerado pelos alunos" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>{s.number}</p>
                <p className="text-gray-300 text-sm mt-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 10 — CUSTO DA INAÇÃO */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-xl p-8 border" style={{ backgroundColor: "rgba(255,200,0,0.04)", borderColor: "rgba(255,200,0,0.3)" }}>
          <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#ffc800", fontFamily: "'Bebas Neue', cursive" }}>
            ⚠️ O custo de continuar sem o método completo
          </h3>
          <div className="text-gray-400 text-sm leading-relaxed space-y-4">
            <p>Se você está começando — cada semana que passa sem o método certo é uma semana testando às cegas, gastando dinheiro em modelo errado, perdendo tempo que não volta.</p>
            <p>Se você já vende — cada mês rodando em R$200/dia é um mês que poderia estar em R$1.000/dia. A diferença não é sorte. É domínio técnico que você ainda não tem.</p>
            <p>Nos dois casos o custo de continuar sem o método completo é muito maior do que R$397. Você já gastou mais do que isso em modelo que não funcionou, em anúncio que não converteu, em curso que não entregou.</p>
            <p>Por R$397 você tem acesso ao método completo — do zero ao avançado — numa operação só. Sem precisar comprar mais nada depois. Sem lacuna. Sem próximo nível.</p>
            <p className="font-bold text-white">O custo de continuar sem isso é muito maior do que R$397.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 11 — NÃO É PRA VOCÊ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-xl p-8 border" style={{ borderColor: "rgba(255,45,120,0.3)", backgroundColor: "rgba(255,45,120,0.04)" }}>
          <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: PINK, fontFamily: "'Bebas Neue', cursive" }}>
            Isso NÃO é pra você se:
          </h3>
          <div className="space-y-3 mb-6">
            {notForYouItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <X className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: PINK }} />
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            Se você está disposto a dedicar tempo, seguir o passo a passo e colocar em prática — seja você iniciante ou quem já vende — o Real Zap Academy foi feito pra você.
          </p>
        </div>
      </section>

      {/* SEÇÃO 12 — GARANTIA */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-8 md:p-10 border relative overflow-hidden" style={{ borderColor: GREEN, backgroundColor: "#141414" }}>
            <div className="absolute -right-6 -top-6 text-[10rem] font-bold leading-none pointer-events-none select-none" style={{ color: "rgba(0,255,136,0.06)", fontFamily: "'Bebas Neue', cursive" }}>
              7
            </div>
            <div className="relative z-10">
              <Shield className="h-8 w-8 mb-4" style={{ color: GREEN }} />
              <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>
                🛡️ Garantia Incondicional de 7 Dias
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Entra, assiste, aplica. Se em 7 dias achar que não foi o que esperava — manda mensagem e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia, sem enrolação. O risco é 100% nosso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 13 — CTA FINAL */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            A única pergunta que importa agora:
          </h2>
          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            Daqui a 30 dias você vai estar no mesmo lugar — sem resultado, sem crescimento, sem domínio da operação — ou vai estar com o método completo rodando, Pix caindo todo dia e uma operação que finalmente escala? A diferença é essa decisão aqui.
          </p>
          <CTAButton />
        </div>
      </section>

      {/* SEÇÃO 14 — FAQ */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Dúvidas</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Perguntas frequentes
          </h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b py-5" style={{ borderColor: "#1a1a1a" }}>
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-xs mb-3">© 2025 Real Zap Academy. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contato</a>
          </div>
          <p className="text-gray-700 text-[10px] max-w-lg mx-auto">
            Aviso legal: Os resultados podem variar de pessoa para pessoa. Não garantimos resultados específicos. Todo negócio envolve riscos e requer dedicação.
          </p>
        </div>
      </footer>

      {/* STICKY CTA BAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md transition-all duration-300 ${showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ backgroundColor: "rgba(8,8,8,0.92)", borderColor: "#222" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="hidden sm:block">
            <span className="text-sm text-gray-400">Real Zap Academy por apenas </span>
            <span className="font-bold text-lg" style={{ color: GREEN }}>R$397</span>
          </div>
          <CTAButton small />
        </div>
      </div>
    </div>
  );
};

export default RealZapAcademy;
