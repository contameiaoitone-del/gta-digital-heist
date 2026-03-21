import { useState, useEffect, useRef, useCallback } from "react";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import result1 from "@/assets/result-1.jpeg";
import result2 from "@/assets/result-2.jpeg";
import result3 from "@/assets/result-3.jpeg";
import result4 from "@/assets/result-4.jpeg";
import result5 from "@/assets/result-5.jpeg";
import result6 from "@/assets/result-6.jpeg";
import result7 from "@/assets/result-7.jpeg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import caioDalcinWorkspace from "@/assets/caio-dalcin-workspace.jpeg";
import cityBackgroundCf from "@/assets/city-background-cf.png";

const CHECKOUT_BASE_URL = "https://pay.cakto.com.br/2DD1AH4";

const enemyBlocks = [
  {
    icon: "📱",
    title: "Reels e conteúdo de feed",
    text: "São feitos pra viralizar, não pra ensinar. O criador escolhe o que parece impressionante, corta o que é chato, edita o que é difícil. Você vê o resultado, nunca o processo. Conteúdo público é vitrine — não bastidor.",
  },
  {
    icon: "🎥",
    title: "YouTube e lives genéricas",
    text: "Longa demais, rasa demais, atrasada demais. O que está sendo ensinado hoje no YouTube funcionava há 6 meses. O mercado de tráfego e WhatsApp muda toda semana. Quem depende de conteúdo público está sempre um passo atrás.",
  },
  {
    icon: "👨‍🏫",
    title: "Cursos gravados",
    text: "Você assiste, anota, termina — e na hora de executar percebe que o mercado mudou, o algoritmo mudou, o que estava no curso não funciona mais igual. Conteúdo gravado envelhece. Operação em tempo real não.",
  },
];

const insideCards = [
  { icon: "📊", title: "Campanhas ao vivo", desc: "Você vê as campanhas sendo criadas, otimizadas e escaladas em tempo real. CPM, CTR, custo por conversa — os números reais da operação, não os números bonitos de print de guru." },
  { icon: "📱", title: "Escala de WhatsApp", desc: "Como estou escalando chips, rodízio de número, múltiplos WhatsApps. O que está funcionando essa semana — não o que funcionava mês passado." },
  { icon: "🎯", title: "Testes de criativos", desc: "Cada criativo novo que subo aparece aqui antes de qualquer lugar. O raciocínio por trás, o ângulo escolhido, o resultado depois." },
  { icon: "📈", title: "Otimização de métricas", desc: "Quando uma campanha trava, quando um número fica feio — você vê a decisão sendo tomada com os dados na tela. Análise real, não teoria de análise." },
  { icon: "🔒", title: "O que falhou — sem filtro", desc: "Todo teste que não funcionou vira aula. Cada erro que cometo aparece aqui — porque aprender com erro alheio é mais barato do que aprender com o próprio." },
  { icon: "🚀", title: "Lançamentos e estratégias", desc: "Cada novo produto, nova oferta, novo funil que rodo — você acompanha do zero. A ideia, a execução, o resultado." },
  { icon: "📖", title: "Stories Exclusivos dos Melhores Amigos", desc: "Tudo que posto nos stories vai primeiro pro Close Friends — antes de qualquer outra pessoa ver. Bastidores, testes, resultados e erros em tempo real direto no seu feed do Instagram." },
  { icon: "🎬", title: "Publicações e Reels Exclusivos", desc: "Conteúdo que não vai pro feed público. Posts e Reels produzidos só pra quem está dentro — análises mais profundas, estratégias completas e conteúdo que nunca vira público." },
];

const stats = [
  { value: "+140", label: "Membros ativos" },
  { value: "Toda semana", label: "Conteúdo novo exclusivo" },
  { value: "R$37", label: "Por mês — menos que um almoço" },
];

const forYou = [
  "Você já comprou o InfoZap ou Real Zap Academy e quer ver a teoria sendo aplicada na prática todo dia",
  "Você já vende no digital e quer saber o que está funcionando agora — não há 6 meses",
  "Você está começando e quer aprender observando uma operação real — sem teoria vazia",
  "Você consome muito conteúdo mas sente que falta o bastidor de verdade — os números, os erros, o processo real",
  "Você quer estar um passo à frente do mercado antes que vire conteúdo público",
];

const notForYou = [
  "Você quer um curso estruturado com módulos — pra isso é o InfoZap ou Real Zap Academy",
  "Você não tem interesse em acompanhar bastidores de operação real no dia a dia",
  "Você quer entretenimento — aqui é conteúdo técnico e prático",
  "Você acha que vai aprender só assistindo sem aplicar nada",
];

const valueStack = [
  { name: "Bastidores diários da operação", value: "R$197/mês" },
  { name: "Campanhas e métricas em tempo real", value: "R$97/mês" },
  { name: "Testes de criativos ao vivo", value: "R$97/mês" },
  { name: "Estratégias antes de virar público", value: "R$97/mês" },
];

const faqs = [
  { q: "Como funciona o acesso?", a: "Após confirmar o pagamento, você recebe o link pra seguir meu perfil no Instagram e é adicionado automaticamente ao Close Friends. Acesso imediato." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Mensal sem fidelidade. Cancela quando quiser, sem multa e sem burocracia." },
  { q: "É diferente do que você posta no feed?", a: "Completamente diferente. O feed é conteúdo público editado. O Close Friends é bastidor real — campanhas, métricas, testes e estratégias acontecendo agora, sem filtro." },
  { q: "Já tenho o InfoZap. Preciso do Close Friends também?", a: "São complementares. O InfoZap te ensina o método. O Close Friends te mantém atualizado com o que está funcionando hoje na operação real. Juntos são muito mais poderosos." },
  { q: "Quanto conteúdo é postado por semana?", a: "Todo dia tem algo novo nos stories — pode ser uma campanha, uma métrica, um teste, um bastidor. A frequência depende do que está acontecendo na operação, mas é conteúdo constante." },
  { q: "Quando recebo o acesso?", a: "Imediatamente após confirmação do pagamento." },
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

const CloseFriends = () => {
  const { getCheckoutUrl } = useCheckoutUrl();
  const checkoutUrl = getCheckoutUrl(CHECKOUT_BASE_URL);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const [printsRef, printsApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const scrollPrintsPrev = useCallback(() => printsApi?.scrollPrev(), [printsApi]);
  const scrollPrintsNext = useCallback(() => printsApi?.scrollNext(), [printsApi]);

  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setStickyVisible(heroBottom < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CTAButton = ({ small = false }: { small?: boolean }) => (
    <Button
      asChild
      className={
        small
          ? "w-full sm:w-auto h-10 px-6 text-sm font-black uppercase tracking-wider bg-[#ff2d78] hover:bg-[#cc1f5a] hover:shadow-[0_0_30px_rgba(255,45,120,0.4)] transition-all rounded-[3px] text-white border-none"
          : "w-full md:w-auto h-12 md:h-14 px-4 md:px-12 text-base md:text-lg font-black uppercase tracking-wider bg-[#ff2d78] hover:bg-[#cc1f5a] hover:shadow-[0_0_40px_rgba(255,45,120,0.4)] hover:-translate-y-0.5 transition-all rounded-[3px] text-white border-none"
      }
    >
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-gtm-category="close-friends"
        data-gtm-action="click"
        data-gtm-label="cta-close-friends"
      >
        🔥 {small ? "Entrar agora →" : "Quero entrar no Close Friends — R$37/mês"}
      </a>
    </Button>
  );

  const Microcopy = () => (
    <span className="block mt-3 text-[13px] text-[#888] tracking-wide">
      🔒 Acesso via Instagram · Cancela quando quiser · Sem fidelidade
    </span>
  );

  const SectionDivider = () => (
    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
  );

  const SectionLabel = ({ children, green = false }: { children: React.ReactNode; green?: boolean }) => (
    <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 ${green ? "text-[#00ff88]" : "text-[#ff2d78]"}`}>
      {children}
    </p>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] font-body overflow-x-hidden relative">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`
      }} />

      {/* ═══════════ SEÇÃO 1 — HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center text-center z-10">
        <div className="absolute inset-0 bg-[#080808]" />
        <img src={cityBackgroundCf} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />

        <div className="relative z-10 max-w-[820px] mx-auto px-6 py-16 md:py-20">
          <span className="inline-block bg-[#ff2d78]/15 border border-[#ff2d78]/40 text-[#ff2d78] text-xs font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-sm mb-8">
            🔥 Close Friends Exclusivo
          </span>

          <h1 className="font-gta text-[clamp(36px,7vw,72px)] leading-[0.95] tracking-tight mb-4">
            O que eu faço pra ter{" "}
            <span className="text-[#ff2d78]">Pix caindo todo dia</span>{" "}
            com Lowticket no WhatsApp.
          </h1>

          <p className="text-lg md:text-xl text-[#bbb] mb-10 max-w-[600px] mx-auto">
            Os bastidores reais da operação — sem edição, sem roteiro, sem mentira.
          </p>

          <div className="space-y-3 mb-10 max-w-[640px] mx-auto">
            {[
              "📱 Campanhas de lowticket ao vivo — do criativo ao Pix caindo",
              "📊 Escala de WhatsApp, métricas e otimização em tempo real",
              "🔒 O que funciona agora — antes de virar conteúdo público",
              "⚡ Quem está fora consome Reels de guru. Quem está dentro já sabe o que converte essa semana.",
            ].map((line, i) => (
              <p key={i} className="text-base md:text-lg text-[#ddd] bg-black/50 px-4 py-2 rounded-sm inline-block w-full">
                {line}
              </p>
            ))}
          </div>

          <CTAButton />
          <Microcopy />
        </div>
      </section>

      {/* ═══════════ SEÇÃO 2 — O PROBLEMA ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <SectionLabel>O PROBLEMA</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            VOCÊ CONSOME CONTEÚDO <span className="text-[#ff2d78]">TODO DIA.</span>{" "}
            E CONTINUA <span className="text-[#ff2d78]">NO MESMO LUGAR.</span>
          </h2>

          <p className="text-lg text-[#bbb] leading-relaxed mb-6">
            Não é falta de esforço. Não é falta de vontade. É que o conteúdo que você consome foi feito pra parecer útil — não pra te fazer ganhar dinheiro de verdade.
          </p>
          <p className="text-lg text-[#bbb] leading-relaxed mb-6">
            Reels de 60 segundos que explicam estratégia sem mostrar número nenhum. Vídeos no YouTube com título de "como faturar R$10k" que terminam sem te dar nada concreto. Threads de guru contando história de sucesso sem mostrar uma campanha, uma métrica, um erro real.
          </p>
          <p className="text-lg text-[#bbb] leading-relaxed">
            <strong className="text-[#f5f5f5]">Você aprende sobre digital. Mas não aprende a operar.</strong> A diferença entre quem fatura e quem apenas consome é simples: quem fatura viu uma operação real funcionando de dentro. Não em teoria. Na prática, com dinheiro real, erro real e resultado real.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 3 — O INIMIGO ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <h2 className="font-gta text-[clamp(32px,5.5vw,56px)] leading-none tracking-tight mb-10">
            POR QUE O CONTEÚDO PÚBLICO <span className="text-[#ff2d78]">NUNCA VAI TE DAR RESULTADO</span> DE VERDADE
          </h2>

          <div className="space-y-4">
            {enemyBlocks.map((block, i) => (
              <div key={i} className="bg-[#ff2d78]/5 border-l-[3px] border-l-[#ff2d78] p-6 rounded-r">
                <h4 className="font-bold text-[17px] mb-2">{block.icon} {block.title}</h4>
                <p className="text-[15px] text-[#999] leading-relaxed">{block.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-bold text-[#00ff88]">
            É exatamente isso que o Close Friends entrega.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 4 — O QUE TEM DENTRO ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <SectionLabel>O QUE É</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-6">
            CLOSE FRIENDS É O ACESSO AOS <span className="text-[#ff2d78]">MELHORES AMIGOS</span> DO MEU INSTAGRAM.
          </h2>

          <div className="space-y-4 text-lg text-[#ccc] leading-relaxed mb-14">
            <p>No Instagram existe um recurso chamado Close Friends — uma lista restrita onde só quem está dentro consegue ver o conteúdo. Não é público, não aparece pra qualquer um, não vira Reels, não vira feed.</p>
            <p>É o lugar onde eu posto tudo que realmente importa da minha operação — sem filtro, sem roteiro, sem preocupação com algoritmo.</p>
            <p className="font-bold text-[#f5f5f5]">Quem entra no Close Friends do Caio Dalcin tem acesso a:</p>
          </div>

          <SectionLabel>O QUE TEM DENTRO</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-10">
            OS BASTIDORES QUE <span className="text-[#ff2d78]">NINGUÉM VÊ.</span>{" "}
            SÓ QUEM ESTÁ DENTRO.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insideCards.map((card, i) => (
              <div key={i} className="bg-[#141414] border-l-[3px] border-l-[#ff2d78] p-6 rounded-r">
                <h4 className="font-bold text-[17px] mb-2">{card.icon} {card.title}</h4>
                <p className="text-[15px] text-[#888] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 5 — RESULTADOS REAIS ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel green>RESULTADOS REAIS</SectionLabel>
          <h2 className="font-gta text-[clamp(32px,5.5vw,56px)] leading-none tracking-tight mb-4">
            NÃO É CONTEÚDO. É <span className="text-[#00ff88]">OPERAÇÃO REAL.</span>{" "}
            VEJA O QUE OS MEMBROS FALAM.
          </h2>
          <p className="text-[#999] text-base mb-10">Alunos reais. Resultados reais. Sem edição, sem seleção, sem mentira.</p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {stats.map((s, i) => (
              <div key={i} className="bg-[#141414] border border-white/[0.07] rounded-xl p-6 text-center">
                <p className="font-gta text-3xl md:text-4xl text-[#ff2d78] mb-1">{s.value}</p>
                <p className="text-[13px] text-[#888]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Depoimentos em vídeo */}
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
                  <div className="aspect-video flex items-center justify-center bg-[#1a1a1a]">
                    <Play className="w-12 h-12 text-[#555]" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-white text-base font-bold">{v.name}</p>
                  <p className="text-sm font-semibold text-[#00ff88]">{v.result}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prints de resultado */}
          <h3 className="text-2xl font-bold text-white mb-8">Prints de resultado</h3>
          <div className="relative mb-16">
            <button
              onClick={scrollPrintsPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg bg-[#ff2d78] text-white"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollPrintsNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg bg-[#ff2d78] text-white"
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
                      <p className="text-sm font-bold px-4 pb-3 text-[#9ca3af]">{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fechamento */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#bbb] text-lg leading-relaxed">
              Essas pessoas pararam de consumir conteúdo público e começaram a ver uma operação real acontecer.{" "}
              <strong className="text-[#f5f5f5]">A diferença aparece rápido.</strong>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 6 — QUEM VOCÊ VAI ACOMPANHAR ═══════════ */}
      <section className="relative py-16 md:py-20 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <img src={cityBackgroundCf} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />

        <div className="relative z-10 max-w-[780px] mx-auto px-6">
          <SectionLabel>QUEM VOCÊ VAI ACOMPANHAR</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-10">
            NÃO SOU <span className="text-[#ff2d78]">GURU DE PALCO.</span>{" "}
            SOU <span className="text-[#ff2d78]">OPERADOR.</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 border-[3px] border-[#ff2d78] shadow-[0_0_30px_rgba(255,45,120,0.3)]">
              <img src={caioDalcinProfile} alt="Caio Dalcin" className="w-full h-full object-cover" />
            </div>
            <p className="text-lg text-[#ccc] leading-relaxed">
              5 anos no digital. Comecei do zero como gestor de tráfego, passei por infoproduto, agência, encapsulado, drop — fiz tudo. Errei muito. Aprendi mais ainda. Hoje tenho uma empresa de infoprodutos e coproduções rodando. E o que você vai ver no Close Friends é exatamente o que está acontecendo na minha operação agora — não o que aconteceu no passado, não o que eu acho que vai funcionar.{" "}
              <strong className="text-[#f5f5f5]">O que está rodando hoje, com dinheiro real, resultado real.</strong>{" "}
              Cada story que posto no Close Friends é um pedaço da operação real. Sem roteiro, sem edição, sem filtro.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "5 ANOS", label: "No digital" },
              { value: "+140", label: "Membros no Close Friends" },
              { value: "TODO DIA", label: "Conteúdo novo nos stories" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-gta text-2xl md:text-3xl text-[#00ff88]">{s.value}</p>
                <p className="text-[13px] text-[#bbb] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 7 — PARA QUEM É ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <SectionLabel>PARA QUEM É</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            O CLOSE FRIENDS É <span className="text-[#ff2d78]">PRA VOCÊ SE:</span>
          </h2>

          <div className="space-y-0">
            {forYou.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 py-4 border-b border-white/[0.07] text-[17px] text-[#ccc]">
                <span className="text-[#ff2d78] text-xl flex-shrink-0 mt-0.5">✅</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 8 — NÃO É PRA VOCÊ ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-[#ff2d78]/5 border border-[#ff2d78]/20 rounded p-8">
            <h3 className="font-gta text-[32px] text-[#ff2d78] mb-6">ISSO NÃO É PRA VOCÊ SE:</h3>
            <ul className="space-y-3">
              {notForYou.map((item, i) => (
                <li key={i} className="text-[#999] text-base pl-7 relative">
                  <span className="absolute left-0 text-[#ff2d78]">❌</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[#ccc] text-base leading-relaxed">
              Se você está disposto a observar, absorver e aplicar o que vê — <strong className="text-[#f5f5f5]">o Close Friends vai acelerar sua operação mais do que qualquer curso gravado.</strong>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 9 — STACK DE VALOR ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6 text-center">
          <SectionLabel green>O VALOR REAL</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-10">
            POR R$37 POR MÊS <span className="text-[#00ff88]">VOCÊ TEM ACESSO A:</span>
          </h2>

          <table className="w-full border-collapse my-8 text-left">
            <tbody>
              {valueStack.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.07]">
                  <td className="py-3.5 text-base">{row.name}</td>
                  <td className="py-3.5 text-base text-right text-[#888] line-through">{row.value}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-white/[0.07]">
                <td className="py-3.5 text-lg font-bold">Valor Real</td>
                <td className="py-3.5 text-lg text-right text-[#888] line-through font-bold">R$488/mês</td>
              </tr>
              <tr>
                <td className="py-3.5 font-gta text-[28px] text-[#ff2d78]">Você paga</td>
                <td className="py-3.5 font-gta text-[28px] text-right text-[#ff2d78]">R$37/mês</td>
              </tr>
            </tbody>
          </table>

          <CTAButton />
          <Microcopy />
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 10 — CUSTO DA INAÇÃO ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-gradient-to-br from-[#ffe600]/5 to-[#ff2d78]/5 border border-[#ffe600]/15 rounded p-8 md:p-10 text-center">
            <h3 className="font-gta text-[clamp(28px,5vw,38px)] text-[#ffe600] mb-6">
              ⚠️ O CUSTO DE CONTINUAR DE FORA
            </h3>
            <p className="text-lg text-[#bbb] leading-relaxed mb-4">
              Cada semana que passa sem ver o que está funcionando agora é uma semana testando às cegas. Você gasta dinheiro em anúncio tentando descobrir o que já está descoberto. Você perde tempo em estratégia que já foi testada e descartada.
            </p>
            <p className="text-lg text-[#bbb] leading-relaxed mb-4">
              Enquanto você consome conteúdo público que está sempre atrasado, quem está no Close Friends vê em tempo real o que está convertendo essa semana — antes de virar trend, antes de virar curso, antes de todo mundo saber.
            </p>
            <p className="text-lg leading-relaxed">
              <strong className="text-[#f5f5f5]">Por R$37 — menos que um almoço fora — você para de adivinhar e começa a ver.</strong>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 11 — GARANTIA ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-[#141414] border-2 border-[#ff2d78] rounded-md p-8 md:p-10 text-center relative overflow-hidden">
            <span className="absolute right-[-10px] top-[-30px] text-[180px] text-[#ff2d78]/[0.04] leading-none pointer-events-none select-none">∞</span>
            <h3 className="font-gta text-[clamp(28px,5vw,42px)] text-[#ff2d78] mb-4">
              🛡️ SEM RISCO. SEM FIDELIDADE. CANCELA QUANDO QUISER.
            </h3>
            <p className="text-[17px] text-[#bbb] max-w-[560px] mx-auto leading-relaxed">
              É uma assinatura mensal sem compromisso. Se em qualquer momento achar que não está valendo — cancela com um clique. Sem multa, sem burocracia, sem pergunta. Mas quem entra raramente sai. Porque toda semana tem coisa nova acontecendo na operação.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 12 — CTA FINAL ═══════════ */}
      <section className="py-16 md:py-24 text-center relative z-10 bg-[#0d0d0d]">
        <div className="max-w-[780px] mx-auto px-6">
          <h2 className="font-gta text-[clamp(32px,6vw,56px)] leading-none tracking-tight mb-6">
            VOCÊ VAI CONTINUAR CONSUMINDO <span className="text-[#ff2d78]">CONTEÚDO PÚBLICO</span>{" "}
            OU VAI <span className="text-[#ff2d78]">ENTRAR DE VERDADE?</span>
          </h2>
          <p className="text-lg text-[#bbb] leading-relaxed mb-10 max-w-[620px] mx-auto">
            Daqui a 30 dias você vai estar no mesmo lugar consumindo Reels de guru — ou vai ter acompanhado uma operação real rodando por dentro, com números reais, erros reais e resultados reais. A diferença é essa decisão aqui.
          </p>
          <CTAButton />
          <Microcopy />
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ SEÇÃO 13 — FAQ ═══════════ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <SectionLabel green>DÚVIDAS</SectionLabel>
          <h2 className="font-gta text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-10">
            PERGUNTAS FREQUENTES
          </h2>

          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/[0.07]">
                <AccordionTrigger className="py-6 text-[17px] font-bold hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#999] text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-[#888] text-[13px] border-t border-white/[0.07] relative z-10">
        <p>© 2025 Close Friends · Caio Dalcin · Todos os direitos reservados</p>
        <p className="mt-2">
          <a href="#" className="text-[#888] underline">Termos de Uso</a>
          {" · "}
          <a href="#" className="text-[#888] underline">Política de Privacidade</a>
          {" · "}
          <a href="#" className="text-[#888] underline">Contato</a>
        </p>
      </footer>

      {/* STICKY BAR */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#080808]/95 border-t border-white/[0.07] py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 z-50 backdrop-blur-lg transition-transform duration-300 ${stickyVisible ? "translate-y-0" : "translate-y-full"}`}>
        <span className="text-[15px] text-[#bbb]">Close Friends — Acesso mensal</span>
        <span className="font-gta text-2xl text-[#ff2d78]">R$37/mês</span>
        <CTAButton small />
      </div>
    </div>
  );
};

export default CloseFriends;
