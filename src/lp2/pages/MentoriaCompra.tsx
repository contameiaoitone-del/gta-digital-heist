import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { ArrowRight, Check, Users, Video, Calendar, Rocket, ShieldCheck, Rocket as RocketIcon } from "lucide-react";
import t1 from "@/lp2/assets/mentoria-compra/t1.png";
import t2 from "@/lp2/assets/mentoria-compra/t2.png";
import t4 from "@/lp2/assets/mentoria-compra/t4.png";
import t5 from "@/lp2/assets/mentoria-compra/t5.png";
import t6 from "@/lp2/assets/mentoria-compra/t6.png";
import tvideo from "@/lp2/assets/mentoria-compra/tvideo.mp4";
import waLogo from "@/lp2/assets/mentoria-compra/whatsapp-logo.png";

const CHECKOUT_URL = "https://checkout.infinitepay.io/jb-empreendimentoss/YT1rMiHkhl";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
}

function Reveal({ children, as: Tag = "div", className = "", id, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`${className} transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

type BenefitIcon =
  | { kind: "lucide"; icon: typeof RocketIcon }
  | { kind: "image"; src: string; alt: string };

const beneficios: { title: string; desc: string; icon: BenefitIcon }[] = [
  {
    icon: { kind: "lucide", icon: RocketIcon },
    title: "4 ofertas que estou rodando no momento",
    desc: "Acesso liberado às 4 ofertas reais da minha operação agora: funil pronto, entregável e anúncios que estão performando.",
  },
  {
    icon: { kind: "lucide", icon: Video },
    title: "Call toda semana durante o mês inteiro",
    desc: "4 calls ao vivo no mês, com tira-dúvidas, análise de operação e ajuste fino das suas campanhas.",
  },
  {
    icon: { kind: "image", src: waLogo, alt: "WhatsApp" },
    title: "Acompanhamento direto comigo",
    desc: "Você terá acesso ao meu WhatsApp pessoal para tirar dúvidas durante toda a mentoria.",
  },
  {
    icon: { kind: "lucide", icon: Users },
    title: "Grupos de networking",
    desc: "Comunidade fechada dos alunos para trocar oferta, criativo e resultado todos os dias.",
  },
];

const depoimentos = [
  { type: "image" as const, src: t1, alt: "Aluno bateu 10k no mês" },
  { type: "image" as const, src: t2, alt: "Aluno faturou R$14.781,02 em 30 dias" },
  { type: "video" as const, src: tvideo, alt: "Depoimento em vídeo de aluno" },
  { type: "image" as const, src: t4, alt: "Pix recebido de R$60,00" },
  { type: "image" as const, src: t5, alt: "Transferências recebidas via Kiwify" },
  { type: "image" as const, src: t6, alt: "Pix recebido de R$125,00" },
];

function Hero() {
  return (
    <Reveal as="section" className="relative overflow-hidden">
      <div className="absolute inset-0 mc-bg-hero-glow pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-24 pb-10 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mc-border-brand-40 mc-bg-brand-10 mc-text-brand text-[10px] sm:text-xs mb-4 sm:mb-6">
          <span className="w-1.5 h-1.5 rounded-full mc-bg-brand animate-pulse" />
          Turma com apenas 30 vagas
        </div>
        <h1 className="text-[26px] leading-[1.15] sm:text-5xl md:text-6xl font-bold tracking-tight">
          Faça parte da próxima turma de mentoria do{" "}
          <span className="mc-gradient-text">João Lucas</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-[13px] leading-relaxed sm:text-lg mc-text-muted px-1 sm:px-0">
          Aprenda a vender com constância no WhatsApp sem ter problema de estrutura.
        </p>

        <div className="mt-6 sm:mt-8 inline-flex flex-col items-center gap-2 rounded-2xl border mc-border-brand-40 mc-bg-card-60 px-4 sm:px-6 py-4 sm:py-5 mc-shadow-brand max-w-full">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest mc-text-brand text-center">Primeiro lote · 20 vagas</span>
          <div className="flex items-end gap-2">
            <span className="text-3xl sm:text-5xl font-bold">R$ 997</span>
            <span className="mb-1 text-xs sm:text-sm mc-text-muted">à vista</span>
          </div>
          <span className="text-[11px] sm:text-xs mc-text-muted text-center">Depois do 1º lote, as 10 vagas restantes sobem para R$ 1.497</span>
        </div>

        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CHECKOUT_URL}
            className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 rounded-lg mc-bg-gradient-brand mc-text-brand-fg font-semibold mc-shadow-brand hover:mc-shadow-glow transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Quero minha vaga por R$ 997 <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-[10px] sm:text-xs mc-text-muted">
          <span className="flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5 mc-text-brand" /> Início da 1ª call dentro de 7 dias</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 mc-text-brand" /> 30 dias de acompanhamento</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 mc-text-brand" /> Acesso ao grupo na hora</span>
        </div>
      </div>
    </Reveal>
  );
}

function Beneficios() {
  return (
    <Reveal as="section" className="py-12 sm:py-20 border-t mc-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest mc-text-brand">O que você recebe</span>
          <h2 className="mt-3 text-[22px] leading-tight sm:text-4xl font-bold tracking-tight">
            Tudo o que está incluso na{" "}
            <span className="mc-gradient-text">mentoria</span>
          </h2>
          <p className="mt-3 text-[13px] sm:text-base mc-text-muted">
            Acesso ao grupo de alunos imediato. A primeira call acontece dentro de 7 dias.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4">
          {beneficios.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 80}
              className="rounded-2xl border mc-border mc-bg-card p-3.5 sm:p-5 hover:mc-border-brand-50 transition"
            >
              <div className="w-10 h-10 rounded-xl grid place-items-center mc-bg-gradient-brand mc-shadow-brand overflow-hidden">
                {b.icon.kind === "lucide" ? (
                  <b.icon.icon className="w-5 h-5 mc-text-brand-fg" />
                ) : (
                  <img src={b.icon.src} alt={b.icon.alt} className="w-7 h-7 object-contain" />
                )}
              </div>
              <h3 className="mt-3 sm:mt-4 font-semibold text-[14px] sm:text-lg leading-snug">{b.title}</h3>
              <p className="mt-1.5 text-[12.5px] sm:text-sm mc-text-muted leading-relaxed">{b.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-7 sm:mt-8 rounded-2xl border mc-border-brand-30 mc-bg-brand-5 p-4 sm:p-6">
          <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 mc-text-brand" /> Como funciona a entrega
          </h3>
          <ul className="mt-3 space-y-2 text-[13px] sm:text-sm mc-text-muted">
            <li className="flex gap-2"><Check className="w-4 h-4 mc-text-brand shrink-0 mt-0.5" /> Acesso imediato ao grupo de alunos após a confirmação do pagamento.</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mc-text-brand shrink-0 mt-0.5" /> Início da primeira call dentro de 7 dias.</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mc-text-brand shrink-0 mt-0.5" /> 4 calls ao vivo comigo durante o mês, com gravação disponibilizada no grupo.</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mc-text-brand shrink-0 mt-0.5" /> Acompanhamento direto comigo no WhatsApp pessoal durante os 30 dias — funil, entregável e anúncios revisados junto com você.</li>
          </ul>
        </Reveal>
      </div>
    </Reveal>
  );
}

function Depoimentos() {
  return (
    <Reveal as="section" className="py-12 sm:py-20 border-t mc-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest mc-text-brand">Resultados de alunos</span>
          <h2 className="mt-3 text-[22px] leading-tight sm:text-4xl font-bold tracking-tight">
            Quem aplicou está{" "}
            <span className="mc-gradient-text">faturando</span>
          </h2>
          <p className="mt-3 text-[13px] sm:text-base mc-text-muted">
            Prints e mensagens reais de alunos vendendo no WhatsApp.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
          {depoimentos.map((d, i) => (
            <Reveal
              key={i}
              delay={i * 60}
              className="rounded-2xl overflow-hidden border mc-border mc-bg-card mc-shadow-brand"
            >
              {d.type === "video" ? (
                <video
                  src={d.src}
                  controls
                  playsInline
                  preload="none"
                  className="w-full h-auto bg-black block"
                />
              ) : (
                <img
                  src={d.src}
                  alt={d.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function CTAFinal() {
  return (
    <Reveal as="section" className="py-12 sm:py-24 border-t mc-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[24px] leading-tight sm:text-5xl font-bold tracking-tight">
          Bora começar a{" "}
          <span className="mc-gradient-text">vender com constância?</span>
        </h2>
        <p className="mt-4 text-[13px] sm:text-base mc-text-muted">
          Se você quer vender com constância no WhatsApp, essa é a turma.
        </p>

        <div className="mt-7 sm:mt-8 inline-flex flex-col items-center gap-2 rounded-2xl border mc-border-brand-40 mc-bg-card-60 px-4 sm:px-6 py-4 sm:py-5 mc-shadow-glow">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest mc-text-brand">Garanta sua vaga · 1º lote (20 vagas)</span>
          <div className="flex items-end gap-2">
            <span className="text-3xl sm:text-5xl font-bold">R$ 997</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-7">
          <a
            href={CHECKOUT_URL}
            className="inline-flex w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg mc-bg-gradient-brand mc-text-brand-fg font-semibold mc-shadow-brand hover:mc-shadow-glow transition items-center justify-center gap-2 text-sm sm:text-base"
          >
            Garantir minha vaga agora <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="mt-5 text-[11px] sm:text-xs mc-text-muted">
          Pagamento via checkout seguro · Acesso ao grupo imediato · 1ª call em até 7 dias
        </p>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="border-t mc-border py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-[11px] sm:text-xs mc-text-muted">
        © {new Date().getFullYear()} Mentoria João Lucas. Todos os direitos reservados.
      </div>
    </footer>
  );
}

const SCOPED_CSS = `
.mentoria-compra-root {
  --mc-bg: #000000;
  --mc-fg: #fafaf7;
  --mc-muted: #b8b1a6;
  --mc-card: #1c1a17;
  --mc-card-60: rgba(28, 26, 23, 0.6);
  --mc-border: #3b352d;
  --mc-brand: #d95e10;
  --mc-brand-glow: #ee7e2a;
  --mc-brand-fg: #fafaf7;
  --mc-gradient-brand: linear-gradient(135deg, #d95e10, #ee7e2a);
  --mc-gradient-hero: radial-gradient(ellipse at top, rgba(217, 94, 16, 0.25), transparent 60%);
  --mc-shadow-brand: 0 10px 40px -10px rgba(217, 94, 16, 0.5);
  --mc-shadow-glow: 0 0 60px rgba(217, 94, 16, 0.35);
  background-color: var(--mc-bg);
  color: var(--mc-fg);
  font-family: ui-sans-serif, system-ui, -apple-system, "Inter", sans-serif;
}
.mentoria-compra-root .mc-text-brand { color: var(--mc-brand); }
.mentoria-compra-root .mc-text-brand-fg { color: var(--mc-brand-fg); }
.mentoria-compra-root .mc-text-muted { color: var(--mc-muted); }
.mentoria-compra-root .mc-bg-brand { background-color: var(--mc-brand); }
.mentoria-compra-root .mc-bg-brand-10 { background-color: rgba(217, 94, 16, 0.1); }
.mentoria-compra-root .mc-bg-brand-5 { background-color: rgba(217, 94, 16, 0.05); }
.mentoria-compra-root .mc-bg-card { background-color: var(--mc-card); }
.mentoria-compra-root .mc-bg-card-60 { background-color: var(--mc-card-60); }
.mentoria-compra-root .mc-bg-gradient-brand { background-image: var(--mc-gradient-brand); }
.mentoria-compra-root .mc-bg-hero-glow { background-image: var(--mc-gradient-hero); }
.mentoria-compra-root .mc-border { border-color: var(--mc-border); }
.mentoria-compra-root .mc-border-brand-30 { border-color: rgba(217, 94, 16, 0.3); }
.mentoria-compra-root .mc-border-brand-40 { border-color: rgba(217, 94, 16, 0.4); }
.mentoria-compra-root .hover\\:mc-border-brand-50:hover { border-color: rgba(217, 94, 16, 0.5); }
.mentoria-compra-root .mc-shadow-brand { box-shadow: var(--mc-shadow-brand); }
.mentoria-compra-root .mc-shadow-glow { box-shadow: var(--mc-shadow-glow); }
.mentoria-compra-root .hover\\:mc-shadow-glow:hover { box-shadow: var(--mc-shadow-glow); }
.mentoria-compra-root .mc-gradient-text {
  background-image: var(--mc-gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
`;

const MentoriaCompra = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Mentoria João Lucas — Vendas no WhatsApp com constância";
  }, []);
  return (
    <div className="mentoria-compra-root min-h-screen">
      <style>{SCOPED_CSS}</style>
      <Hero />
      <Beneficios />
      <Depoimentos />
      <CTAFinal />
      <Footer />
    </div>
  );
};

export default MentoriaCompra;