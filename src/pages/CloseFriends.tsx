import { useState, useEffect, useRef } from "react";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const CHECKOUT_BASE_URL = "https://pay.cakto.com.br/2DD1AH4";

const socialItems = [
  { emoji: "🎬", text: "Bastidores reais todo dia" },
  { emoji: "✅", text: "O que funciona agora, não há 6 meses" },
  { emoji: "❌", text: "O que falhou e por quê" },
  { emoji: "📊", text: "Métricas reais da operação" },
  { emoji: "🔒", text: "Só pra quem está dentro" },
];

const stories = [
  { label: "Hoje", title: "Métricas do dia — o que otimizei e por quê", icon: "📊" },
  { label: "Criativo", title: "Novo criativo antes de subir — o raciocínio por trás", icon: "🎬" },
  { label: "Falhou", title: "O que testei essa semana que não funcionou", icon: "❌" },
];

const features = [
  {
    icon: "🎬",
    title: "Bastidores em tempo real",
    desc: "Tudo que rolo na minha operação aparece aqui primeiro — criativos, funis, campanhas, métricas. Antes de virar conteúdo público.",
  },
  {
    icon: "✅",
    title: "O que está funcionando agora",
    desc: "Sem esperar virar tendência. Você vê antes de todo mundo o que está convertendo nessa semana, não o que funcionou há 6 meses.",
  },
  {
    icon: "❌",
    title: "O que falhou — e por quê",
    desc: "Os erros custam dinheiro. Aqui você aprende com os meus sem precisar pagar por eles. Todo teste que não funcionou vira aula.",
  },
  {
    icon: "📊",
    title: "Análise de métricas reais",
    desc: "Você vê os números da operação — CPM, CTR, custo por conversa, ROAS. Aprende a ler métricas vendo uma operação real acontecer.",
  },
  {
    icon: "🔒",
    title: "Conteúdo que não vai a lugar nenhum",
    desc: "Sem feed, sem Reels, sem YouTube. O que está aqui fica aqui. Exclusivo pra quem está dentro do Close Friends.",
  },
];

const forYou = [
  "Você já tem o InfoZap ou Real Zap Academy e quer ver a teoria sendo aplicada na prática todo dia",
  "Você já roda uma operação digital e quer se atualizar com o que está funcionando agora",
  "Você está começando e quer aprender observando uma operação real — sem teoria vazia",
  "Você consome muito conteúdo mas sente que falta o bastidor de verdade — os números, os erros, o processo",
  "Você quer ficar por dentro do que está funcionando no mercado de lowticket no WhatsApp antes de todo mundo",
];

const notForYou = [
  "Você quer um curso com módulos estruturados — pra isso é o InfoZap ou Real Zap Academy",
  "Você não tem interesse em acompanhar bastidores de operação real no dia a dia",
  "Você busca entretenimento — aqui é conteúdo técnico e prático",
];

const valueStack = [
  { name: "Bastidores diários da operação", value: "R$197/mês" },
  { name: "Análise de métricas em tempo real", value: "R$97/mês" },
  { name: "Testes e experimentos exclusivos", value: "R$97/mês" },
];

const faqs = [
  {
    q: "Como funciona o acesso?",
    a: "Após confirmar o pagamento, você recebe o link para seguir o perfil do Caio no Instagram e é adicionado automaticamente ao Close Friends. Acesso imediato.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. É mensal sem fidelidade. Cancela quando quiser, sem multa e sem burocracia.",
  },
  {
    q: "É diferente do que o Caio posta no feed?",
    a: "Completamente diferente. O feed é conteúdo público editado. O Close Friends é bastidor real — o que está acontecendo na operação agora, com números, erros e testes.",
  },
  {
    q: "Já tenho o InfoZap. Preciso do Close Friends também?",
    a: "São complementares. O InfoZap te ensina o modelo. O Close Friends te mantém atualizado com o que está funcionando hoje na prática. Juntos são muito mais poderosos.",
  },
  {
    q: "Precisa ter experiência no digital?",
    a: "Não. Iniciantes aprendem observando. Quem já vende aprende otimizando. O bastidor é valioso em qualquer nível.",
  },
];

const CloseFriends = () => {
  const { getCheckoutUrl } = useCheckoutUrl();
  const checkoutUrl = getCheckoutUrl(CHECKOUT_BASE_URL);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setStickyVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CTAButton = ({ small = false }: { small?: boolean }) => (
    <Button variant="hero" size={small ? "default" : "xl"} asChild className={
      small
        ? "w-full sm:w-auto bg-[#ff2d78] hover:bg-[#cc1f5a] from-[#ff2d78] to-[#cc1f5a] rounded-[3px]"
        : "w-full md:w-auto bg-[#ff2d78] hover:bg-[#cc1f5a] from-[#ff2d78] to-[#cc1f5a] rounded-[3px] px-4 md:px-12 text-base md:text-lg"
    }>
      <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
        🔥 {small ? "Entrar agora →" : "Quero entrar no Close Friends — R$37/mês"}
      </a>
    </Button>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] font-body overflow-x-hidden relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`
      }} />

      {/* Top Bar */}
      <div className="bg-[#ff2d78] text-white text-center py-2.5 px-5 font-black text-[13px] tracking-wider uppercase z-10 relative">
        🔥 Close Friends — Bastidores exclusivos · Cancela quando quiser
      </div>

      {/* Social Marquee Bar */}
      <div className="bg-[#141414] border-y border-white/[0.07] py-5 overflow-hidden relative z-10">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...socialItems, ...socialItems].map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 text-sm text-[#888] flex-shrink-0">
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="py-16 md:py-20 text-center relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <span className="inline-block bg-[#ff2d78]/10 border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-sm mb-8">
            🔥 Acesso exclusivo
          </span>

          <h1 className="font-heading text-[clamp(46px,8vw,82px)] leading-[0.95] tracking-tight mb-3">
            Chega de conteúdo{" "}
            <span className="text-[#ff2d78]">que não te leva</span>{" "}
            <span className="text-[#ff2d78]">a lugar nenhum.</span>
          </h1>

          <p className="text-[clamp(17px,2.5vw,21px)] text-[#bbb] max-w-[580px] mx-auto mt-6 mb-10 leading-relaxed">
            Entra no Close Friends e acompanha em tempo real os bastidores da minha operação —{" "}
            <strong className="text-[#f5f5f5]">o que estou testando, o que está convertendo e o que falhou</strong>.
            Sem filtro, sem roteiro, sem teoria.
          </p>

          <CTAButton />
          <span className="block mt-3 text-[13px] text-[#888] tracking-wide">
            🔒 Acesso via Instagram · Cancela quando quiser · Sem fidelidade
          </span>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#ff2d78] to-transparent" />
      </section>

      {/* O Problema */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">O problema</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-6">
            Você consome conteúdo{" "}
            <span className="text-[#ff2d78]">todo dia</span> mas ainda{" "}
            <span className="text-[#ff2d78]">não saiu do lugar?</span>
          </h2>

          <p className="text-lg text-[#bbb] leading-relaxed mb-6">
            O problema não é falta de informação. É <strong className="text-[#f5f5f5]">excesso de teoria sem prática real</strong>.
          </p>
          <p className="text-lg text-[#bbb] leading-relaxed mb-6">
            Você vê Reels de estratégia, assiste vídeo no YouTube, lê thread no Twitter — mas na hora de executar, algo falta. Porque conteúdo público é sempre genérico, sempre sem contexto, sempre sem os números reais por trás.
          </p>
          <p className="text-lg text-[#bbb] leading-relaxed mb-6">
            O que realmente muda o jogo é <strong className="text-[#f5f5f5]">ver uma operação funcionando de dentro</strong>. Ver o criativo antes de subir, ver a métrica em tempo real, ver o erro antes de ele acontecer com você.
          </p>
          <p className="text-lg text-[#bbb] leading-relaxed">
            É exatamente isso que o Close Friends entrega.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* O que você vai ver — Story Cards */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">O que você vai ver</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-3">
            Bastidores que{" "}
            <span className="text-[#ff2d78]">não vão pro feed</span>
          </h2>
          <p className="text-lg text-[#bbb] leading-relaxed mb-10">
            Tudo que aparece aqui é o que está acontecendo agora na operação — não o que funcionou no passado.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stories.map((s, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[9/16] flex flex-col justify-end p-4 bg-[#141414]">
                <div className="absolute inset-[-2px] rounded-[13px] bg-gradient-to-br from-[#ff2d78] to-[#ffe600] -z-10" />
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-15">{s.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85 z-[1]" />
                <div className="relative z-[2]">
                  <p className="text-xs font-bold text-[#ff2d78] uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-sm font-bold text-white leading-snug">{s.title}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-lg text-[#bbb] leading-relaxed mt-10">
            Você aprende mais em uma semana de bastidores do que em meses consumindo conteúdo público. Porque aqui você vê <strong className="text-[#f5f5f5]">o processo, não o resultado editado</strong>.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* O que você recebe */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">O que você recebe</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            Tudo que tem{" "}
            <span className="text-[#ff2d78]">dentro do Close Friends</span>
          </h2>

          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-6 bg-[#141414] rounded border-l-[3px] border-l-[#ff2d78]">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h4 className="font-bold text-[17px] mb-1.5">{f.title}</h4>
                  <p className="text-[15px] text-[#888] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Para quem é */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">Para quem é</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            O Close Friends é{" "}
            <span className="text-[#ff2d78]">pra você se:</span>
          </h2>

          <div className="space-y-0">
            {forYou.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 py-4 border-b border-white/[0.07] text-[17px] text-[#ccc]">
                <span className="text-[#ff2d78] text-xl flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Not for you */}
          <div className="mt-10 bg-[#ff2d78]/5 border border-[#ff2d78]/20 rounded p-8">
            <h3 className="font-heading text-[32px] text-[#ff2d78] mb-4">Não é pra você se:</h3>
            <ul className="space-y-2">
              {notForYou.map((item, i) => (
                <li key={i} className="text-[#999] text-base pl-6 relative">
                  <span className="absolute left-0 text-[#ff2d78]">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Value Stack */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">O valor real</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            Por R$37 por mês{" "}
            <span className="text-[#ff2d78]">você tem acesso a:</span>
          </h2>

          <table className="w-full border-collapse my-8">
            <tbody>
              {valueStack.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.07]">
                  <td className="py-3.5 text-base">{row.name}</td>
                  <td className="py-3.5 text-base text-right text-[#888] line-through">{row.value}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-white/[0.07]">
                <td className="py-3.5 text-lg font-bold">Valor Real</td>
                <td className="py-3.5 text-lg text-right text-[#888] line-through font-bold">R$391/mês</td>
              </tr>
              <tr>
                <td className="py-3.5 font-heading text-[28px] text-[#ff2d78]">Você paga</td>
                <td className="py-3.5 font-heading text-[28px] text-right text-[#ff2d78]">R$37/mês</td>
              </tr>
            </tbody>
          </table>

          {/* Price block */}
          <div className="bg-[#141414] border border-white/[0.07] rounded-md p-10 text-center">
            <p className="text-sm text-[#888] uppercase tracking-widest mb-2">Acesso mensal</p>
            <p className="font-heading text-[72px] text-[#ff2d78] leading-none mb-1">R$37</p>
            <p className="text-base text-[#888] mb-8">por mês · cancela quando quiser</p>
            <CTAButton />
            <span className="block mt-3 text-[13px] text-[#888]">
              🔒 Acesso via Instagram · Sem fidelidade · Cancela quando quiser
            </span>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Custo da inação */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-gradient-to-br from-[#ffe600]/5 to-[#ff2d78]/5 border border-[#ffe600]/15 rounded p-10 text-center">
            <h3 className="font-heading text-[38px] text-[#ffe600] mb-4">
              ⚠️ O custo de continuar de fora
            </h3>
            <p className="text-lg text-[#bbb] leading-relaxed">
              Cada semana que passa sem saber o que está funcionando agora no mercado é uma semana testando às cegas. Enquanto você gasta dinheiro em teste, quem está no Close Friends já sabe o resultado. Por R$37 — <strong className="text-[#f5f5f5]">menos que um delivery</strong> — você acessa o que está funcionando hoje, antes de todo mundo.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Garantia */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-[#141414] border-2 border-[#ff2d78] rounded-md p-10 text-center relative overflow-hidden">
            <span className="absolute right-[-10px] top-[-30px] text-[180px] text-[#ff2d78]/[0.04] leading-none pointer-events-none">∞</span>
            <h3 className="font-heading text-[42px] text-[#ff2d78] mb-3">
              🛡️ Sem risco. Cancela quando quiser.
            </h3>
            <p className="text-[17px] text-[#bbb] max-w-[500px] mx-auto leading-relaxed">
              É uma assinatura mensal sem fidelidade. Se em qualquer momento achar que não está valendo — cancela com um clique. Sem multa, sem burocracia, sem pergunta. Mas quem entra raramente sai. Porque o conteúdo não para.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* CTA Final */}
      <section className="py-16 md:py-20 text-center relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">Decisão</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-6">
            Continua consumindo{" "}
            <span className="text-[#ff2d78]">conteúdo público</span>{" "}
            ou entra de verdade?
          </h2>
          <p className="text-lg text-[#bbb] leading-relaxed mb-10">
            Por R$37 por mês você para de adivinhar o que funciona e começa a ver em tempo real. A decisão é simples.
          </p>
          <CTAButton />
          <span className="block mt-3 text-[13px] text-[#888]">
            🔒 R$37/mês · Acesso via Instagram · Cancela quando quiser
          </span>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* FAQ */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="max-w-[780px] mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#ff2d78] mb-4">Dúvidas</p>
          <h2 className="font-heading text-[clamp(36px,6vw,60px)] leading-none tracking-tight mb-8">
            Perguntas frequentes
          </h2>

          <Accordion type="single" collapsible className="space-y-0">
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

      {/* Footer */}
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

      {/* Sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#080808]/95 border-t border-white/[0.07] py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 z-50 backdrop-blur-lg transition-transform duration-300 ${stickyVisible ? "translate-y-0" : "translate-y-full"}`}>
        <span className="text-[15px] text-[#bbb]">Close Friends — Acesso mensal</span>
        <span className="font-heading text-2xl text-[#ff2d78]">R$37/mês</span>
        <CTAButton small />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CloseFriends;
