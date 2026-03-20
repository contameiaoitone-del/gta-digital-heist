import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Smartphone, DollarSign, Zap, ChevronRight, X, Shield } from "lucide-react";
import { useCheckoutUrl } from "@/hooks/useCheckoutUrl";

const CHECKOUT_BASE = "https://pay.cakto.com.br/3dsuw79_671863";

const GREEN = "#00ff88";
const PINK = "#ff2d78";

const painItems = [
  "Já comprei curso, não saiu nada do papel",
  "Tentei drop mas o lucro nunca aparecia",
  "Virei afiliado mas não consegui vender nada",
  "Não sei por onde começar de verdade",
  "Não tenho dinheiro pra arriscar mais",
];

const mechanisms = [
  { icon: Smartphone, emoji: "📱", title: "WhatsApp", desc: "98% de taxa de abertura" },
  { icon: DollarSign, emoji: "💸", title: "Lowticket", desc: "Produto entre R$17 e R$97. Decisão em segundos." },
  { icon: Zap, emoji: "⚡", title: "Pay After", desc: "Entrega primeiro, cobra depois direto no Pix." },
];

const modules = [
  { num: "01", title: "Bem-vindo ao InfoZap", subs: ["Visão geral do método", "Como usar a plataforma", "Mentalidade certa"] },
  { num: "02", title: "O que você vai precisar", subs: ["Ferramentas gratuitas", "Configurações iniciais", "Conta de anúncios"] },
  { num: "03", title: "Criando seu produto", subs: ["Escolhendo o nicho", "Criando com IA", "Página de entrega"] },
  { num: "04", title: "IA de WhatsApp com ZapData", subs: ["Configurando o bot", "Fluxos de conversa", "Automação de cobranças"] },
  { num: "05", title: "Primeiros anúncios no Meta", subs: ["Criando a campanha", "Segmentação", "Otimização de resultados"] },
  { num: "06", title: "Funis prontos pra copiar e colar", subs: ["Templates de mensagens", "Sequências de follow-up", "Scripts de venda"] },
];

const bonuses = [
  { emoji: "📊", title: "Planilha de Lucro", desc: "Controle seus gastos, receitas e lucro real em tempo real.", value: "R$47", resolves: "Não saber se está lucrando ou perdendo dinheiro" },
  { emoji: "⚡", title: "Free Trial 3 Dias ZapData", desc: "Teste a IA de WhatsApp sem pagar nada por 3 dias.", value: "R$47", resolves: "Medo de investir em ferramenta sem testar" },
  { emoji: "🏦", title: "Guia de Bancos pra Receber Pix", desc: "Quais bancos usar pra receber Pix sem problema.", value: "R$27", resolves: "Não saber qual banco usar pra receber" },
];

const valueStack = [
  { item: "InfoZap Treinamento Completo", value: "R$297" },
  { item: "Módulo ZapData Completo", value: "R$97" },
  { item: "3 Funis Prontos + Produtos", value: "R$197" },
  { item: "Planilha de Lucro", value: "R$47" },
  { item: "Free Trial ZapData", value: "R$47" },
  { item: "Guia de Bancos", value: "R$27" },
];

const notForYouItems = [
  "Quer ficar rico sem fazer nada",
  "Não está disposto a dedicar pelo menos 1h por dia",
  "Acha que resultado vem sem investir em anúncio",
  "Não aceita seguir um método comprovado",
];

const faqs = [
  { q: "Preciso ter experiência?", a: "Não. O método foi feito do zero, passo a passo. Mesmo que você nunca tenha vendido nada online." },
  { q: "Quanto preciso investir em anúncio?", a: "Recomendamos começar com R$10 a R$20 por dia. Conforme os resultados aparecem, você escala." },
  { q: "Precisa de site ou plataforma cara?", a: "Não. Tudo funciona com WhatsApp + ferramentas gratuitas ou de baixo custo." },
  { q: "Por quanto tempo tenho acesso?", a: "Acesso vitalício. Comprou uma vez, é seu pra sempre, incluindo atualizações futuras." },
  { q: "E se eu não gostar?", a: "Você tem 7 dias de garantia incondicional. Pediu reembolso, devolvemos 100% sem perguntas." },
  { q: "Quando recebo o acesso?", a: "Imediatamente após a confirmação do pagamento. Pix é instantâneo." },
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
        className={`bg-[${GREEN}] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-[0.97] ${small ? "h-10 px-6 text-sm" : "h-14 px-10 text-lg"} rounded-lg`}
        style={{ backgroundColor: GREEN }}
      >
        {small ? "Quero acessar — R$97" : "🔥 Quero acessar o InfoZap — R$97"}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </a>
  );

  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: "#080808", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
      {/* 1. TOPBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 px-4 text-sm font-semibold" style={{ backgroundColor: GREEN, color: "#000" }}>
        ⚡ Acesso imediato após confirmação · Garantia de 7 dias · Sem assinatura
      </div>

      {/* 2. MARQUEE */}
      <div className="mt-10 border-y" style={{ backgroundColor: "#141414", borderColor: "#222" }}>
        <div className="infozap-marquee py-3 overflow-hidden whitespace-nowrap">
          <div className="infozap-marquee-track inline-flex gap-12">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="text-sm font-medium" style={{ color: i % marqueeItems.length === 0 ? GREEN : "#999" }}>
                {item} <span className="mx-4" style={{ color: GREEN }}>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. HERO */}
      <section ref={heroRef} className="relative py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Pill */}
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ color: GREEN, borderColor: GREEN, backgroundColor: "rgba(0,255,136,0.08)" }}>
            ⚡ Método InfoZap
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.02em" }}>
            Do zero ao primeiro Pix{" "}
            <span style={{ color: PINK }}>em até 7 dias</span>{" "}
            vendendo infoproduto de Lowticket direto no WhatsApp
          </h1>

          <div className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed space-y-1">
            <p>⚡ Funil 100% automático com IA — sem atender nenhum cliente</p>
            <p>💸 Vendas direto no Pix</p>
            <p>📦 Produtos prontos pra copiar e colar</p>
            <p>📱 Sem bloqueio de WhatsApp</p>
          </div>

          <CTAButton />

          <p className="mt-4 text-xs text-gray-500">
            🔒 Acesso imediato · Garantia 7 dias · Sem assinatura
          </p>
        </div>
        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
      </section>

      {/* 4. PAIN */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: PINK }}>O Problema</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Você reconhece <span style={{ color: PINK }}>alguma dessas?</span>
          </h2>
          <div className="space-y-3">
            {painItems.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border-l-4" style={{ borderColor: PINK, backgroundColor: "rgba(255,45,120,0.06)" }}>
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-500 text-sm leading-relaxed">
            A verdade é que a maioria dos modelos de negócio digital foram feitos pra quem já tem capital, audiência ou experiência. O InfoZap foi criado pra quem não tem nada disso — e precisa começar com o mínimo possível.
          </p>
        </div>
      </section>

      {/* 5. MECHANISM */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Mecanismo</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Por que o lowticket no WhatsApp funciona quando tudo mais falhou
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mechanisms.map((m, i) => (
              <div key={i} className="rounded-xl p-6 border-t-2" style={{ backgroundColor: "#141414", borderColor: GREEN }}>
                <div className="text-3xl mb-4">{m.emoji}</div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>{m.title}</h3>
                <p className="text-gray-400 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MODULES */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>O Que Você Aprende</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Tudo que você precisa pra sair do zero e receber Pix hoje
          </h2>
          <Accordion type="multiple" className="space-y-3">
            {modules.map((mod, i) => (
              <AccordionItem key={i} value={`mod-${i}`} className="border rounded-xl px-5" style={{ borderColor: "#222", backgroundColor: "#111" }}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-sm font-bold" style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem" }}>
                      {mod.num}
                    </span>
                    <span className="text-white font-semibold text-base">{mod.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-2">
                    {mod.subs.map((sub, j) => (
                      <div key={j} className="flex items-center gap-2 text-gray-400 text-sm">
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GREEN }} />
                        {sub}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 7. BONUS */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: GREEN }}>Bônus Exclusivos</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            E ainda leva isso sem custo adicional
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {bonuses.map((b, i) => (
              <div key={i} className="rounded-xl p-6 border" style={{ borderColor: "#222", backgroundColor: "#141414" }}>
                <div className="text-3xl mb-3">{b.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{b.desc}</p>
                <p className="font-bold text-sm" style={{ color: GREEN }}>Valor: {b.value}</p>
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
                <span className="text-gray-500 text-sm font-medium">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
              <span className="text-gray-400 font-semibold">Valor Total</span>
              <span className="text-gray-500 line-through font-bold text-lg">R$712</span>
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
          <p className="text-gray-400 text-sm leading-relaxed">
            Daqui a 6 meses, você vai estar exatamente no mesmo lugar — sem renda extra, dependendo do mesmo salário, vendo outras pessoas faturando com digital. O InfoZap custa menos que um jantar fora. Mas o custo de continuar parado é muito maior do que R$97.
          </p>
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
            Agora, se você é uma pessoa que tá disposta a dedicar tempo, seguir o passo a passo e colocar em prática — o InfoZap foi feito pra você.
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
            Daqui a 30 dias você vai estar no mesmo lugar ou vai estar com uma operação rodando?
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
