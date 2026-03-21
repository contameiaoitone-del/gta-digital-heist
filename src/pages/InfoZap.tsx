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

const moduleCovers = [
  { image: infozapMod1, title: "Seja Bem Vindo" },
  { image: infozapMod2, title: "Estruturando Tudo" },
  { image: infozapMod3, title: "Criando seu Produto" },
  { image: infozapMod4, title: "ZapData" },
  { image: infozapMod5, title: "Produtos e Nichos" },
];

const CHECKOUT_BASE = "https://pay.cakto.com.br/3dsuw79_671863";

const GREEN = "#00ff88";
const PINK = "#ff2d78";

const painItems = [
  { title: '"Já comprei curso e perdi dinheiro"', desc: "Você assistiu tudo, anotou tudo, seguiu o passo a passo — e no final das contas ficou na mesma ou pior. O guru ficou rico. Você ficou com a conta no vermelho e a autoconfiança destruída." },
  { title: '"Tentei drop, tráfego direto, gestão de tráfego, encapsulado... e só sangrei dinheiro"', desc: "Cada modelo novo que aparecia parecia ser \"o certo\". Você entrava cheio de esperança, gastava em ferramenta, em anúncio, em produto, em curso de gestor — e no fim do mês o resultado era prejuízo. De novo." },
  { title: '"Virei afiliado mas nunca vi um Pix cair"', desc: "Ficou meses criando conteúdo, mandando link, pedindo pra galera comprar — e quando a venda aparecia, a comissão era uma miséria. Trabalho de escravo pra enriquecer o produtor." },
  { title: '"Não sei por onde começar de verdade"', desc: "Tem tanta coisa na internet que no final você não faz nada. Um fala que é tráfego, outro fala que é orgânico, outro fala que é drop. Você consome informação e fica paralisado enquanto o tempo passa." },
  { title: '"Não tenho dinheiro pra arriscar mais"', desc: "Já investiu em curso que não entregou. Já perdeu dinheiro em anúncio sem retorno. Agora cada real que você tem é sagrado — e você não pode errar de novo." },
];

const mechanismBenefits = [
  { emoji: "💸", title: "Começa com R$15 por dia", desc: "Esqueça investir rios de dinheiro antes de ver resultado. Com conversão dessa taxa você não precisa de orçamento absurdo. R$15 já gera tráfego, ativa o funil e traz Pix na conta." },
  { emoji: "🔒", title: "Zero reembolso", desc: "O cliente já recebeu o produto antes de pagar. Não tem o que devolver, não tem o que contestar. O Pix veio, ficou. Na sua conta." },
  { emoji: "💰", title: "Liquidez imediata", desc: "Cada venda cai direto no Pix na hora. Sem checkout segurando seu dinheiro por 15 ou 30 dias. Você vende, recebe, reinveste no mesmo dia e escala mais rápido do que qualquer outro modelo." },
  { emoji: "🤖", title: "Funil 100% automático com IA", desc: "A IA atende o cliente, entrega o produto e cobra — tudo sozinha. Você não precisa estar presente, não precisa responder mensagem, não precisa fazer nada. O funil roda enquanto você dorme." },
  { emoji: "🎯", title: "Campanha que vira máquina de vendas", desc: "Com o pixel do Facebook configurado no WhatsApp, o Meta Ads otimiza automaticamente pro público que tem perfil de comprador. Com o tempo a campanha para de ser anúncio e vira uma máquina — encontra quem compra, entrega o anúncio, fecha a venda sozinha." },
  { emoji: "📈", title: "De zero a R$1.000 por dia em menos de 1 mês", desc: "A operação é rápida e altamente escalável. Com o funil rodando e a campanha otimizando, você reinveste o Pix que caiu e cresce. Tenho alunos que saíram do zero e chegaram a 1k por dia em menos de 30 dias. Não porque são especiais. Porque o modelo foi construído pra isso." },
];

import result1 from "@/assets/result-1.jpeg";
import result2 from "@/assets/result-2.jpeg";
import result3 from "@/assets/result-3.jpeg";
import result4 from "@/assets/result-4.jpeg";
import result5 from "@/assets/result-5.jpeg";
import result6 from "@/assets/result-6.jpeg";
import result7 from "@/assets/result-7.jpeg";

const statsCards = [
  { number: "+140", desc: "Alunos já aplicando o método" },
  { number: "20-30%", desc: "Taxa de conversão nos funis" },
  { number: "R$0", desc: "Reembolso com o modelo Pay After" },
  { number: "R$500.000", desc: "Faturamento gerado pelos alunos" },
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

const modules = [
  { num: "01", title: "Bem-vindo ao InfoZap — Entendendo o Modelo", subs: ["Como funciona a operação lowticket", "Exemplo real do funil rodando", "Mapa da jornada do zero ao primeiro Pix"] },
  { num: "02", title: "O que você vai precisar — Setup Completo", subs: ["3 ferramentas: WhatsApp + ZapData + Meta Ads", "Configurando WhatsApp do zero", "Free trial ZapData — como ativar"] },
  { num: "03", title: "Criando seu Produto — Do Zero ao Funil", subs: ["Criar infoproduto sem experiência", "Mineração de oferta que vende", "Configurando funil completo no ZapData"] },
  { num: "04", title: "IA de WhatsApp com ZapData — Automação Completa", subs: ["IA pra responder, entregar e cobrar", "Funil 24h automático no WhatsApp", "ZapData do zero ao avançado"] },
  { num: "05", title: "Primeiros Anúncios no Meta — Tráfego Pago", subs: ["Criando campanha do zero com R$15/dia", "Segmentação para lowticket", "Otimização e escala de resultados"] },
  { num: "06", title: "Funis Prontos pra Copiar e Colar", subs: ["3 produtos digitais já validados no mercado", "3 funis completos prontos pra importar no ZapData", "Criativos dos funis inclusos"] },
];

const bonuses = [
  { emoji: "⚡", title: "Free Trial 3 Dias ZapData", desc: "Teste a IA de WhatsApp sem pagar nada por 3 dias.", value: "R$47", resolves: "Medo de investir em ferramenta sem testar" },
  { emoji: "📦", title: "3 Produtos Validados + Funis Prontos", desc: "3 infoprodutos já validados no mercado com funil completo pronto pra importar direto no ZapData. Copia, cola e anuncia.", value: "R$197", resolves: "Não saber o que vender nem como montar o funil" },
];

const valueStack = [
  { item: "InfoZap — Treinamento Completo", value: "R$297" },
  { item: "Módulo ZapData Completo", value: "R$97" },
  { item: "3 Funis Prontos + Produtos Validados", value: "R$197" },
  { item: "Free Trial ZapData 3 dias", value: "R$47" },
];

const notForYouItems = [
  "Acha que vai ter resultado sem investir pelo menos R$15/dia em anúncio",
  "Quer resultado em 24h sem configurar funil, produto e campanha",
  "Já desistiu de tudo que começou antes de ver resultado",
  "Não está disposto a seguir um método do zero ao fim sem pular etapa",
];

const faqs = [
  { q: "Preciso ter experiência?", a: "Não. O InfoZap foi feito exatamente pra quem tentou outros modelos e não teve resultado, ou pra quem nunca vendeu nada online. O método é passo a passo, do absoluto zero." },
  { q: "Quanto preciso investir em anúncio?", a: "Dá pra começar com R$15/dia. Com a taxa de conversão do Pay After Delivery você não precisa de orçamento absurdo pra ter retorno. Tenho alunos que começaram com R$15/dia e chegaram a R$500/dia em menos de 30 dias." },
  { q: "Precisa de site ou plataforma cara?", a: "Não. A operação inteira roda com WhatsApp + ZapData. Sem site, sem plataforma de curso, sem estoque, sem nada além disso." },
  { q: "Por quanto tempo tenho acesso?", a: "Acesso vitalício. Comprou uma vez, é seu para sempre — incluindo todas as atualizações futuras sem custo adicional." },
  { q: "E se eu não gostar?", a: "Garantia incondicional de 7 dias. Entrou, assistiu, não gostou — manda mensagem e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia, sem enrolação. O risco é 100% nosso." },
  { q: "Quando recebo o acesso?", a: "Imediatamente após confirmação do pagamento. Pix é instantâneo — seu acesso também." },
];

const marqueeItems = [
  "+140 alunos já aplicando o método",
  "Pix caindo direto na conta",
  "Acesso imediato após pagamento",
  "Garantia de 7 dias",
  "Funciona só com celular e WhatsApp",
];

const InfoZap = () => {
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

  const scrollToCheckout = () => {
    document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth" });
  };

  const CTAButton = ({ small = false }: { small?: boolean }) => (
    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
      <Button
        className={`bg-[${GREEN}] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-[0.97] ${small ? "w-full sm:w-auto h-10 px-4 sm:px-6 text-sm" : "w-full md:w-auto h-12 md:h-14 px-4 md:px-10 text-base md:text-lg"} rounded-lg`}
        style={{ backgroundColor: GREEN }}
      >
        {small ? "Quero acessar — R$97" : "🔥 QUERO MEU ACESSO AGORA — R$97"}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </a>
  );

  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: "#080808", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      {/* HERO */}
      <section ref={heroRef} className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={cityBackground} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.50)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Pill */}
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ color: GREEN, borderColor: GREEN, backgroundColor: "rgba(0,255,136,0.08)" }}>
            ⚡ Método InfoZap
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}>
            Do zero ao primeiro Pix{" "}
            <span style={{ color: PINK }}>em até 7 dias</span>{" "}
            vendendo infoproduto de Lowticket direto no WhatsApp
          </h1>

          <div className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed space-y-2 flex flex-col items-center">
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>⚡ Funil 100% automático com IA — sem atender nenhum cliente</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>💸 Vendas direto no Pix</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>📦 Produtos prontos pra copiar e colar</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>📱 Sem bloqueio de WhatsApp</p>
          </div>

          {/* Foto do Caio - Hero */}

          <CTAButton />

          <p className="mt-4 text-sm text-gray-300" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            🔒 Garantia de 7 dias · Acesso imediato · Sem mensalidade
          </p>
        </div>
        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
      </section>

      {/* PAIN */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: PINK }}>O Problema</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Você reconhece <span style={{ color: PINK }}>alguma dessas?</span>
          </h2>
          <p className="text-gray-400 text-sm mb-10">Se qualquer uma dessas frases já passou pela sua cabeça, você está exatamente no lugar certo.</p>
          <div className="space-y-4">
            {painItems.map((item, i) => (
              <div key={i} className="rounded-xl p-5 border relative" style={{ borderColor: "rgba(255,45,120,0.2)", backgroundColor: "rgba(255,45,120,0.04)" }}>
                <X className="h-5 w-5 absolute top-4 right-4" style={{ color: PINK }} />
                <p className="font-bold text-white mb-1">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-6 text-gray-400 text-[17px] leading-relaxed">
            <p>
              <strong className="text-white">A culpa não foi sua.</strong> Você foi vendido modelos que nunca foram feitos pra quem está começando.
            </p>
            <p>
              <strong style={{ color: GREEN }}>Drop</strong> exige capital alto pra comprar estoque, lidar com produto físico, frete, devolução, reclamação — e no final a margem é uma miséria pra tanto trabalho.
            </p>
            <p>
              <strong style={{ color: GREEN }}>Afiliado</strong> é uma armadilha dos dois lados. Se tentar no orgânico, você trabalha feito escravo criando conteúdo todo dia, mandando link pra todo mundo, implorando por atenção — pra no final receber uma comissão que mal paga o seu tempo. E se for com tráfego pago, você tem o mesmo trabalho, gasta dinheiro em anúncio e ainda toma prejuízo por cima. Nos dois casos o resultado é o mesmo: você se mata trabalhando. O produtor enriquece.
            </p>
            <p>
              <strong style={{ color: GREEN }}>Tráfego direto</strong> exige uma fortuna pra testar — e quando finalmente funciona, você descobre que o dinheiro fica preso no checkout por 15, 30 dias. Você vende, vende, vende e não consegue escalar porque o caixa não gira.
            </p>
            <p>
              <strong style={{ color: GREEN }}>Gestão de tráfego</strong> exige portfólio pra conseguir cliente, e prospecção orgânica não funciona mais. O mercado está abarrotado de agência grande com estrutura, time e preço que você nunca vai conseguir competir. O oceano azul secou.
            </p>
            <p>
              Nenhum desses modelos foi feito pra quem está começando do zero com pouco dinheiro no bolso.
            </p>
            <p className="font-bold text-lg" style={{ color: GREEN }}>
              O InfoZap foi.
            </p>
            <p>
              Sem estoque. Sem produto físico. Sem checkout cheio de taxa te engolindo a margem. Sem dinheiro preso esperando liberação. Sem prospectar cliente nenhum. Sem atender ninguém — a IA faz isso por você. E o melhor: <strong className="text-white">o Pix cai direto na sua conta. Na hora. Todo dia.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 5. MECHANISM */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Mecanismo</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Por que o InfoZap funciona quando tudo mais falhou?
          </h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-10">
            <p>
              A maioria dos modelos de venda online tem um problema que nunca te contam: <strong className="text-white">o cliente tem medo de pagar antes de receber.</strong> É por isso que a conversão é baixa, o reembolso é alto e você fica queimando dinheiro em anúncio sem resultado.
            </p>
            <p className="font-bold text-white text-base">
              O InfoZap inverte essa lógica completamente.
            </p>
            <p>
              Você entrega o infoproduto primeiro. O cliente recebe, consome, e só depois paga direto no Pix. Sem medo. Sem objeção. Sem hesitação. É o único modelo onde o cliente paga depois de já ter recebido o que comprou.
            </p>
            <p>
              O resultado disso é absurdo: <strong style={{ color: GREEN }}>taxa de conversão de 20 a 30%</strong>. Enquanto modelos convencionais convertem 1 a 3%, o Pay After Delivery converte até 10 vezes mais — porque você removeu o único motivo que fazia o cliente não comprar.
            </p>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            E as consequências disso mudam tudo:
          </h3>
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

      {/* RESULTADOS REAIS */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Resultados Reais</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Não é promessa. É o que já está acontecendo.
          </h2>
          <p className="text-gray-400 text-base mb-10">Alunos reais. Resultados reais. Sem edição, sem seleção, sem mentira.</p>

          {/* Bloco 1 — Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {statsCards.map((s, i) => (
              <div key={i} className="rounded-xl p-6 border text-center" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>{s.number}</p>
                <p className="text-gray-400 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Bloco 2 — Depoimentos em vídeo */}
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

          {/* Bloco 3 — Prints de resultado */}
          <h3 className="text-2xl font-bold text-white mb-8">Prints de resultado</h3>
          <div className="relative mb-16">
            <button
              onClick={scrollPrintsPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
              style={{ backgroundColor: GREEN, color: "#000" }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollPrintsNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
              style={{ backgroundColor: GREEN, color: "#000" }}
              aria-label="Próximo"
            >
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

          {/* Fechamento */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm leading-relaxed italic">
              Essas pessoas estavam exatamente onde você está agora. Sem experiência, sem audiência, sem capital alto.{" "}
              <span className="text-white font-bold not-italic">A diferença entre eles e você é uma decisão.</span>
            </p>
          </div>
        </div>
      </section>

      {/* QUEM VAI TE ENSINAR */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={cityBackground} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.50)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Quem Vai Te Ensinar</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            O método que você vai aprender é o mesmo que eu rodo todo dia
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 flex items-center justify-center" style={{ borderColor: GREEN, backgroundColor: "#141414" }}>
                <img src={caioDalcinPhoto} alt="Caio Dalcin" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            {/* Text */}
            <div className="text-gray-200 text-base leading-relaxed space-y-4 p-6 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              <p>5 anos no digital. Comecei do zero como gestor de tráfego, passei por infoproduto, agência, encapsulado, drop — fiz tudo. Errei muito. Aprendi mais ainda.</p>
              <p>Hoje tenho uma empresa de infoprodutos e coproduções rodando, e o modelo que uso no dia a dia é exatamente o que ensino no InfoZap.</p>
              <p>Não sou guru de palco. Sou operador. Cada aula que você vai assistir é algo que já testei com dinheiro real, que já funcionou na prática e que continua rodando hoje.</p>
            </div>
          </div>
          {/* Stats */}
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

      {/* 6. MODULES */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Que Você Aprende</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Tudo que você precisa pra sair do zero e receber Pix hoje
          </h2>

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
                        <img
                          src={mod.image}
                          alt={mod.title}
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

          <div className="max-w-3xl mx-auto">
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
              🔥 Quero meu acesso agora — R$97
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p className="mt-3 text-xs text-gray-500">Pagamento único · Acesso imediato · Garantia 7 dias</p>
        </div>
      </section>

      {/* 7. BONUS */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Bônus Exclusivos</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            E ainda leva isso sem custo adicional
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {bonuses.map((b, i) => (
              <div key={i} className="rounded-xl p-8 border relative" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                {/* Badge */}
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: GREEN, color: "#000" }}>
                  BÔNUS
                </span>
                <div className="text-3xl mb-4 mt-2">{b.emoji}</div>
                <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{b.desc}</p>
                {/* Separator */}
                <div className="h-px w-full mb-4" style={{ backgroundColor: "#2a2a2a" }} />
                <p className="font-bold text-xl" style={{ color: GREEN }}>Valor: <span className="line-through">{b.value}</span></p>
                <p className="text-xs text-gray-500 italic mt-2">Resolve: {b.resolves}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VALUE STACK */}
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
              <span className="text-gray-500 line-through font-bold text-lg">R$638</span>
            </div>
            <div className="flex justify-between items-center px-6 py-5">
              <span className="font-bold text-lg">Você paga hoje</span>
              <span className="font-bold text-3xl" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>R$97</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <CTAButton />
            <p className="mt-3 text-xs text-gray-500">Pagamento único · Sem mensalidade · Acesso vitalício</p>
          </div>
        </div>
      </section>

      {/* 9. COST OF INACTION */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-xl p-8 border" style={{ backgroundColor: "rgba(255,200,0,0.04)", borderColor: "rgba(255,200,0,0.3)" }}>
          <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#ffc800", fontFamily: "'Bebas Neue', cursive" }}>
            ⚠️ O custo de não fazer nada
          </h3>
          <div className="text-gray-400 text-sm leading-relaxed space-y-4">
            <p>Cada mês que passa sem uma renda digital funcionando é mais um mês dependendo de emprego, de chefe, de horário fixo.</p>
            <p>Daqui a 6 meses você vai estar exatamente no mesmo lugar — sem renda extra, dependendo do mesmo salário, vendo outras pessoas faturando enquanto você continua adiando.</p>
            <p>Não é questão de tempo. É questão de modelo. Você já tem o celular. Você já tem o WhatsApp. O único ingrediente que falta é esse aqui.</p>
            <p>Por R$97 — menos que um jantar fora — você tem acesso à operação completa.</p>
            <p className="font-bold text-white">O custo de continuar parado é muito maior do que R$97.</p>
          </div>
        </div>
      </section>

      {/* 10. NOT FOR YOU */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-xl p-8 border" style={{ backgroundColor: "rgba(255,45,120,0.04)", borderColor: "rgba(255,45,120,0.3)" }}>
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
            Agora, se você está disposto a dedicar tempo, seguir o passo a passo e colocar em prática — o InfoZap foi feito pra você.
          </p>
        </div>
      </section>

      {/* 11. GUARANTEE */}
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
                Se por qualquer motivo você sentir que o InfoZap não é pra você, basta pedir o reembolso em até 7 dias e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia, sem letras miúdas. Simples assim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            A única pergunta que importa agora:
          </h2>
          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            Daqui a 30 dias você vai estar exatamente onde está agora — ou vai estar com Pix caindo todo dia, com uma operação rodando e com o controle da sua própria renda. A diferença é essa decisão aqui.
          </p>
          <CTAButton />
        </div>
      </section>

      {/* 13. FAQ */}
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

      {/* 14. FOOTER */}
      <footer className="py-10 px-4 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-xs mb-3">© 2025 InfoZap. Todos os direitos reservados.</p>
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

      {/* 15. STICKY CTA BAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md transition-all duration-300 ${showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ backgroundColor: "rgba(8,8,8,0.92)", borderColor: "#222" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="hidden sm:block">
            <span className="text-sm text-gray-400">InfoZap por apenas </span>
            <span className="font-bold text-lg" style={{ color: GREEN }}>R$97</span>
          </div>
          <CTAButton small />
        </div>
      </div>
    </div>
  );
};

export default InfoZap;
