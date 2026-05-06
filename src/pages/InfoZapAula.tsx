import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

import { ArrowRight, ChevronRight, X, Shield, Play } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import caioDalcinPhoto from "@/assets/caio-dalcin.jpeg";
import cityBackground from "@/assets/city-background.png";

import infozapMod1 from "@/assets/infozap-mod-1.png";
import infozapMod2 from "@/assets/infozap-mod-2.png";
import infozapMod3 from "@/assets/infozap-mod-3.png";
import infozapMod4 from "@/assets/infozap-mod-4.png";
import infozapMod5 from "@/assets/infozap-mod-5.png";
import infozapModConceitos from "@/assets/infozap-mod-conceitos.png";
import infozapModComunidade from "@/assets/infozap-mod-comunidade.png";
import infozapModMeta1 from "@/assets/infozap-mod-meta1.png";
import infozapModMeta2 from "@/assets/infozap-mod-meta2.png";
import infozapModMeta3 from "@/assets/infozap-mod-meta3.png";
import infozapModTrafego from "@/assets/infozap-mod-trafego.png";
import infozapModMetricas from "@/assets/infozap-mod-metricas.png";
import infozapModEscala from "@/assets/infozap-mod-escala.png";
import infozapModCriativos from "@/assets/infozap-mod-criativos.png";
import infozapModWhatsapp from "@/assets/infozap-mod-whatsapp.png";
import infozapModTrapaca from "@/assets/infozap-mod-trapaca.png";
import infozapModProdutos from "@/assets/infozap-mod-produtos.png";
import infozapModFreetrial from "@/assets/infozap-mod-freetrial.png";

const moduleCovers = [
  { image: infozapMod1, title: "Boas-vindas" },
  { image: infozapModComunidade, title: "Comunidade Exclusiva no WhatsApp" },
  { image: infozapModConceitos, title: "Conceitos do Digital" },
  { image: infozapMod5, title: "Produtos e Nichos" },
  { image: infozapMod2, title: "Estruturando a Operação" },
  { image: infozapMod3, title: "Criando seu Produto" },
  { image: infozapMod4, title: "ZapData" },
  { image: infozapModFreetrial, title: "Free Trial de 3 Dias ZapData" },
  { image: infozapModWhatsapp, title: "Fundamentos de WhatsApp" },
  { image: infozapModMeta1, title: "Meta Ads Parte 1" },
  { image: infozapModMeta2, title: "Meta Ads Parte 2" },
  { image: infozapModMeta3, title: "Meta Ads Parte 3" },
  { image: infozapModTrafego, title: "Tráfego Avançado" },
  { image: infozapModCriativos, title: "Criativos" },
  { image: infozapModMetricas, title: "Análise e Otimização de Métricas" },
  { image: infozapModEscala, title: "Organização para Crescimento" },
  { image: infozapModProdutos, title: "Bônus — Modelos de Produtos" },
];

const GREEN = "#00ff88";
const PINK = "#ff2d78";

const enemyBlocks = [
  { title: "Falta de método claro", desc: "Sem um passo a passo organizado, é difícil saber por onde começar e o que fazer em cada etapa da operação digital." },
  { title: "Dificuldade em interpretar métricas", desc: "Sem entender CPM, CTR e custo por conversa, fica difícil tomar decisões com base em dados em vez de achismo." },
  { title: "Falta de processo de atendimento", desc: "Sem um fluxo definido de atendimento e acompanhamento, a comunicação com o cliente fica desorganizada e inconsistente." },
  { title: "Dificuldade em estruturar oferta", desc: "Definir a oferta, o público e a comunicação certa exige método. Sem isso, a campanha fica genérica." },
  { title: "Falta de organização da rotina", desc: "Operação digital exige rotina de testes, leitura de dados e ajustes. Sem organização, a evolução fica lenta." },
];

const mechanismBenefits = [
  { emoji: "🎯", title: "Clareza da oferta", desc: "Aprenda a estruturar uma oferta clara, com público, dor e proposta de valor bem definidos." },
  { emoji: "💬", title: "Atendimento estruturado", desc: "Um processo de atendimento organizado para conduzir conversas com qualidade e consistência." },
  { emoji: "📦", title: "Entrega organizada", desc: "Como organizar a entrega do conteúdo de forma simples para o cliente ter uma boa experiência." },
  { emoji: "🔁", title: "Acompanhamento", desc: "Rotina de acompanhamento e relacionamento para entender o uso e a percepção do cliente." },
  { emoji: "📊", title: "Leitura de métricas", desc: "Como interpretar métricas básicas para tomar decisões com base em dados, não em achismo." },
  { emoji: "🛠️", title: "Melhoria contínua", desc: "Ciclos de teste, leitura e ajuste para evoluir a operação ao longo do tempo." },
];

const statsCards = [
  { number: "+140", desc: "Alunos no treinamento" },
  { number: "11", desc: "Módulos completos" },
  { number: "Vitalício", desc: "Acesso ao conteúdo" },
  { number: "7 dias", desc: "Garantia de reembolso" },
];

const videoTestimonials = [
  { name: "Saulo", result: "Sobre como começou a aplicar o método", videoId: "bf2cbaf3-11c9-4f66-a9b7-0b8db5a7ccbf" },
  { name: "Gilson", result: "Sobre o processo de aprendizado no início", videoId: "a963887a-0124-4bb2-989c-ffaf393baf3a" },
  { name: "Eric", result: "Sobre organizar a operação passo a passo", videoId: "bf8fb158-3a94-4da0-81c5-9fdaf2f8ba3c" },
  { name: "Comunidade", result: "Sobre a troca dentro do grupo de alunos", videoId: "7a1f82b2-8752-443d-ac10-0246361aca6b" },
];

const baseModules = [
  { num: "01", title: "Boas-vindas — Entendendo o Modelo", subs: ["Como funciona a operação completa de lowticket no WhatsApp", "Visão geral do funil", "Mapa da jornada de aprendizado"] },
  { num: "02", title: "O que você vai precisar — Setup Completo", subs: ["As 3 ferramentas: WhatsApp + ZapData + Meta Ads", "Configurando o WhatsApp do zero", "Free trial ZapData — como ativar"] },
  { num: "03", title: "Criando seu Produto — Do Zero ao Funil", subs: ["Como estruturar um infoproduto", "Pesquisa e construção de oferta", "Configurando o funil completo no ZapData"] },
  { num: "04", title: "IA de WhatsApp com ZapData — Automação", subs: ["IA para apoiar atendimento e entrega", "Funil 24h automático no WhatsApp", "ZapData do básico ao avançado"] },
  { num: "05", title: "Fundamentos de Meta Ads — Tráfego Pago", subs: ["Estruturando uma campanha do zero", "Segmentação para ofertas de baixo ticket", "Boas práticas de otimização"] },
  { num: "06", title: "Modelos de Funil para Estudo", subs: ["3 estruturas de produto digital para estudo", "3 modelos de funil para importar no ZapData", "Materiais de criativo de referência"] },
];

const advancedModules = [
  { num: "07", title: "Tráfego Avançado", subs: ["Fluxograma da estrutura de tráfego", "Metodologia de campanhas", "Como marcar vendas no gerenciador", "Como pegar o Post ID do anúncio"] },
  { num: "08", title: "Análise e Otimização de Métricas", subs: ["Organização de colunas de métricas", "Métricas personalizadas", "Análise de métricas na prática", "Fluxograma de tomada de decisões"] },
  { num: "09", title: "Organização para Crescimento", subs: ["Boas práticas de operação multicanal", "Organização de chips e números", "Processo para múltiplos WhatsApps", "Pré-organização e crescimento gradual"] },
  { num: "10", title: "Criativos", subs: ["Módulo completo de criativos", "Ângulos, variações e testes", "Boas práticas de criação"] },
  { num: "11", title: "Estratégias Avançadas e Boas Práticas", subs: ["Aprofundamento em estratégias de operação", "Práticas que operadores experientes adotam"] },
];

const bonuses = [
  { emoji: "⚡", title: "Free Trial 3 Dias ZapData", desc: "Teste a IA de WhatsApp por 3 dias antes de decidir.", value: "R$47" },
  { emoji: "📦", title: "3 Modelos de Produto + Funis", desc: "3 estruturas de infoproduto com modelos de funil para estudo e adaptação no ZapData.", value: "R$197" },
  { emoji: "📊", title: "Planilha de Acompanhamento", desc: "Planilha para acompanhar custos, receitas e entender a saúde da operação.", value: "R$47" },
  { emoji: "🤝", title: "Grupo de Networking", desc: "Acesso a um grupo para troca de aprendizados entre alunos.", value: "R$197" },
  { emoji: "👑", title: "Comunidade VIP InfoZap", desc: "Acesso vitalício à comunidade exclusiva do treinamento.", value: "R$97" },
];

const valueStack = [
  { item: "InfoZap — 11 módulos completos", value: "R$697" },
  { item: "Módulo ZapData Completo", value: "R$97" },
  { item: "3 Modelos de Funil + Produto", value: "R$197" },
  { item: "Free Trial ZapData 3 dias", value: "R$47" },
  { item: "Planilha de Acompanhamento", value: "R$47" },
  { item: "Grupo de Networking", value: "R$197" },
  { item: "Comunidade VIP InfoZap", value: "R$97" },
];

const notForYouItems = [
  "Não está disposto a estudar e aplicar o passo a passo",
  "Espera resultado sem dedicar tempo de estudo e prática",
  "Não quer seguir um método estruturado",
  "Procura promessa de renda garantida (não é o caso aqui)",
];

const faqs = [
  { q: "Preciso ter experiência?", a: "Não. O treinamento parte do zero e foi pensado para quem está começando ou quer estruturar melhor a operação digital." },
  { q: "O treinamento garante resultados?", a: "Não. É um treinamento educacional. Os resultados variam conforme dedicação, contexto, investimento e execução de cada aluno." },
  { q: "Preciso investir em ferramentas ou anúncios?", a: "Algumas aulas abordam ferramentas e tráfego pago. Qualquer investimento é uma decisão do aluno e os retornos não são garantidos." },
  { q: "Precisa de site ou plataforma cara?", a: "Não. O conteúdo é focado em uma operação simples com WhatsApp e ferramentas acessíveis." },
  { q: "Por quanto tempo tenho acesso?", a: "Acesso vitalício, incluindo atualizações futuras sem custo adicional." },
  { q: "E se eu não gostar?", a: "Garantia de 7 dias prevista por lei. Se solicitar reembolso nesse prazo, devolvemos 100% do valor pago." },
  { q: "Quando recebo o acesso?", a: "O acesso é liberado automaticamente após a confirmação do pagamento." },
];

const marqueeItems = [
  "+140 alunos no treinamento",
  "Acesso vitalício",
  "Garantia de 7 dias",
  "11 módulos completos",
  "Comunidade exclusiva",
];

const InfoZapAula = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = () => setCheckoutOpen(true);

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
    <Button
      onClick={openCheckout}
      className={`bg-[${GREEN}] hover:bg-[#00dd77] text-black font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] whitespace-normal ${small ? "w-full sm:w-auto h-auto py-2 px-4 sm:px-6 text-sm" : "w-full md:w-auto h-auto py-3 px-4 md:px-10 text-base md:text-lg"} rounded-lg`}
      style={{ backgroundColor: GREEN }}
    >
      {small ? "Quero acessar — R$67" : "Quero acessar o treinamento — R$67"}
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
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
            Treinamento educacional InfoZap
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}>
            Aprenda a estruturar uma{" "}
            <span style={{ color: PINK }}>operação digital</span>{" "}
            com WhatsApp, automação e tráfego pago
          </h1>

          <div className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed space-y-2 flex flex-col items-center">
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px" }}>Estrutura completa de operação, do básico ao avançado</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px" }}>Leitura de métricas e tomada de decisão com dados</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px" }}>Boas práticas de operação multicanal no WhatsApp</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px" }}>Fundamentos de tráfego pago e estruturação de campanha</p>
            <p className="inline-block rounded-md" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px" }}>Comunidade e grupo de networking entre alunos</p>
          </div>

          <CTAButton />

          <p className="mt-4 text-sm text-gray-300">
            Garantia de 7 dias · Acesso imediato · Pagamento único
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
      </section>

      {/* DIFICULDADES COMUNS */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: PINK }}>Dificuldades comuns</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            O que costuma travar quem está começando
          </h2>
          <p className="text-gray-400 mb-10">Pontos recorrentes entre quem tenta estruturar uma operação digital sem método.</p>

          <div className="space-y-4">
            {enemyBlocks.map((item, i) => (
              <div key={i} className="rounded-xl p-5 border relative" style={{ borderColor: "rgba(255,45,120,0.2)", backgroundColor: "rgba(255,45,120,0.04)" }}>
                <X className="h-5 w-5 absolute top-4 right-4" style={{ color: PINK }} />
                <p className="font-bold text-white mb-1">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 text-gray-400 text-[15px] leading-relaxed">
            <p>O InfoZap propõe uma estrutura organizada para apoiar o estudo e a execução, com módulos sequenciais e exemplos práticos.</p>
            <p className="text-2xl font-bold" style={{ color: GREEN }}>Foco em método, não em promessa.</p>
          </div>
        </div>
      </section>

      {/* MECANISMO */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Método</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Pay After Delivery — uma metodologia de experiência do cliente
          </h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-10">
            <p>
              Pay After Delivery é uma metodologia de organização da experiência do cliente. A proposta é estruturar oferta, atendimento, entrega e acompanhamento de forma clara para que o aluno possa aplicar a operação com mais consistência.
            </p>
            <p className="font-bold text-white text-base">
              É uma forma de organizar processos. Não é uma promessa de resultado.
            </p>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Os 6 pilares do método:
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

      {/* SOBRE O TREINAMENTO */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Sobre o treinamento</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Conteúdo educacional, prático e aplicável
          </h2>
          <p className="text-gray-400 text-base mb-10">Material organizado em módulos sequenciais, com exemplos e materiais de apoio.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {statsCards.map((s, i) => (
              <div key={i} className="rounded-xl p-6 border text-center" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>{s.number}</p>
                <p className="text-gray-400 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Histórias de alunos</h3>
          <p className="text-gray-500 text-xs mb-8 italic">
            Depoimentos representam experiências individuais. Conteúdo educacional, sem garantia de renda, vendas ou resultados.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {videoTestimonials.map((v, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden shadow-xl transition-all duration-300" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
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
        </div>
      </section>

      {/* QUEM VAI TE ENSINAR */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#080808]">
          <img src={cityBackground} alt="" className="w-full h-full object-cover opacity-[0.18]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Quem conduz o treinamento</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Aulas conduzidas por quem opera no dia a dia
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 flex items-center justify-center" style={{ borderColor: GREEN, backgroundColor: "#141414" }}>
                <img src={caioDalcinPhoto} alt="Caio Dalcin" className="w-full h-full rounded-full object-cover" loading="lazy" />
              </div>
            </div>
            <div className="text-gray-200 text-base leading-relaxed space-y-4 p-6 rounded-lg" style={{ background: "rgba(0,0,0,0.4)" }}>
              <p>5 anos atuando no digital, com passagem por gestão de tráfego, infoproduto, agência e dropshipping.</p>
              <p>O conteúdo do treinamento é baseado em práticas que aplica na própria operação de infoprodutos e coproduções.</p>
              <p>Foco em ensino prático, com exemplos reais de aplicação dos temas estudados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ APRENDE */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O que você estuda</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Operação completa de lowticket no WhatsApp
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Treinamento educacional cobrindo desde fundamentos até temas avançados de operação, métricas e tráfego pago.
          </p>

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
                      <div className="aspect-[2/3] overflow-hidden rounded-xl border-2 border-border/50 transition-all duration-300 shadow-lg">
                        <img
                          src={mod.image}
                          alt={mod.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 border-border" />
              <CarouselNext className="hidden md:flex -right-12 bg-card/80 border-border" />
            </Carousel>
          </div>

          <div className="max-w-3xl mx-auto">
            <ModuleList modules={baseModules} label="MÓDULOS BASE" />
            <ModuleList modules={advancedModules} label="MÓDULOS AVANÇADOS" />
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIÁRIO */}
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: "#111" }}>
        <div className="max-w-2xl mx-auto text-center">
          <CTAButton />
          <p className="mt-3 text-xs text-gray-500">Pagamento único · Acesso imediato · Garantia de 7 dias</p>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Bônus inclusos</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Materiais complementares incluídos
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
                <p className="font-bold text-xl" style={{ color: GREEN }}>Valor de referência: <span className="line-through">{b.value}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section id="comprar" className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block text-center" style={{ color: GREEN }}>Investimento</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Tudo que está incluído
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#222", backgroundColor: "#111" }}>
            {valueStack.map((row, i) => (
              <div key={i} className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
                <span className="text-gray-300 text-sm">{row.item}</span>
                <span className="text-gray-500 text-sm font-medium line-through">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
              <span className="text-gray-400 font-semibold">Valor de referência</span>
              <span className="text-gray-500 line-through font-bold text-lg">R$1.379</span>
            </div>
            <div className="flex justify-between items-center px-6 py-5">
              <span className="font-bold text-lg">Você paga hoje</span>
              <span className="font-bold text-3xl" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>R$67</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <CTAButton />
            <p className="mt-3 text-xs text-gray-500">Pagamento único · Sem mensalidade · Acesso vitalício</p>
          </div>
        </div>
      </section>

      {/* NOT FOR YOU */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto rounded-xl p-8 border" style={{ backgroundColor: "rgba(255,45,120,0.04)", borderColor: "rgba(255,45,120,0.3)" }}>
          <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: PINK, fontFamily: "'Bebas Neue', cursive" }}>
            Este treinamento NÃO é para você se:
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
            Se você está disposto a estudar, dedicar tempo e seguir um método, o InfoZap foi pensado para você.
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-8 md:p-10 border relative overflow-hidden" style={{ borderColor: GREEN, backgroundColor: "#141414" }}>
            <div className="absolute -right-6 -top-6 text-[10rem] font-bold leading-none pointer-events-none select-none" style={{ color: "rgba(0,255,136,0.06)", fontFamily: "'Bebas Neue', cursive" }}>
              7
            </div>
            <div className="relative z-10">
              <Shield className="h-8 w-8 mb-4" style={{ color: GREEN }} />
              <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive" }}>
                Garantia de 7 dias
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Garantia legal de 7 dias prevista pelo Código de Defesa do Consumidor. Se solicitar reembolso dentro deste prazo, devolvemos 100% do valor pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* DISCLAIMER */}
      <section className="py-10 px-4" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-3xl mx-auto rounded-xl p-6 border" style={{ borderColor: "#222", backgroundColor: "#111" }}>
          <p className="text-gray-400 text-xs leading-relaxed text-center">
            <strong className="text-white">Aviso importante:</strong> Este é um treinamento educacional. Não garantimos renda, vendas ou resultados específicos. O desempenho varia conforme dedicação, contexto, investimento e execução de cada aluno. Depoimentos representam experiências individuais e não devem ser interpretados como resultado típico. Este material não é vinculado, patrocinado ou endossado por Meta, WhatsApp, TikTok ou qualquer outra plataforma mencionada.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-xs mb-3">© 2025 InfoZap. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
            <a href="/termos" className="hover:text-gray-300 transition-colors">Termos de Uso</a>
            <a href="/privacidade" className="hover:text-gray-300 transition-colors">Política de Privacidade</a>
            <a href="/contato" className="hover:text-gray-300 transition-colors">Contato</a>
          </div>
          <p className="text-gray-700 text-[10px] max-w-lg mx-auto">
            Conteúdo educacional. Resultados variam conforme dedicação, contexto, investimento e execução. Não há garantia de renda ou resultados.
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
            <span className="text-sm text-gray-400">Treinamento por </span>
            <span className="font-bold text-lg" style={{ color: GREEN }}>R$67</span>
          </div>
          <CTAButton small />
        </div>
      </div>
      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
};

export default InfoZapAula;
