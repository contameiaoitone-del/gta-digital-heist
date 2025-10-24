import { HelpCircle, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Eu preciso ter experiência prévia para começar?",
    answer: "NÃO! A Real Life Academy foi criada justamente para iniciantes. Começamos do absoluto zero e te levamos passo a passo até os primeiros resultados. Mais de 70% dos nossos alunos nunca tinham trabalhado com digital antes.",
  },
  {
    question: "Quanto tempo até eu ver os primeiros resultados?",
    answer: "A maioria dos nossos alunos começa a ver os primeiros resultados entre 30-60 dias. Claro que isso depende da sua dedicação e aplicação do método. Temos alunos que faturaram já nas primeiras 2 semanas.",
  },
  {
    question: "Preciso investir dinheiro além do curso?",
    answer: "Para algumas estratégias como tráfego pago, você vai precisar de investimento inicial (pode começar com R$100-300). Mas também ensinamos métodos orgânicos que não precisam de investimento, só do seu tempo e dedicação.",
  },
  {
    question: "Quanto tempo por dia preciso dedicar?",
    answer: "Recomendamos no mínimo 2 horas por dia. Se você puder dedicar mais, seus resultados vão chegar mais rápido. O curso é flexível - você assiste quando quiser e no seu ritmo.",
  },
  {
    question: "Como funciona o suporte?",
    answer: "Você terá acesso ao nosso grupo VIP no WhatsApp com suporte 24/7. Além disso, temos lives semanais de mentoria onde tiramos dúvidas ao vivo e analisamos casos de sucesso.",
  },
  {
    question: "O acesso é vitalício?",
    answer: "SIM! Você paga uma única vez e tem acesso para sempre. Todas as atualizações, novos módulos e conteúdos são inclusos sem custo adicional.",
  },
  {
    question: "E se eu não gostar do curso?",
    answer: "Simples: você tem 7 dias de garantia total. Se por qualquer motivo você não gostar, é só pedir o reembolso e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.",
  },
  {
    question: "Funciona para qualquer idade?",
    answer: "SIM! Temos alunos de 18 a 65 anos faturando alto. O digital não tem idade. Se você tem vontade de mudar de vida e está disposto a aprender, vai funcionar para você.",
  },
  {
    question: "Vou receber certificado?",
    answer: "Sim, ao concluir o treinamento você recebe um certificado digital de conclusão. Mas o verdadeiro certificado são os resultados e o dinheiro na sua conta.",
  },
  {
    question: "As vagas são limitadas mesmo?",
    answer: "SIM! Limitamos as vagas para conseguirmos dar suporte de qualidade para todos. Quando fecha, só abrimos novamente no próximo mês (e geralmente com preço maior).",
  },
];

export const FAQ = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden bg-card/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="atmospheric-haze" />
      <div className="noise-texture" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border-2 border-secondary/30 bg-secondary/5 backdrop-blur-sm mb-4 sm:mb-6">
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span className="text-xs sm:text-sm font-bold text-secondary uppercase tracking-wider">
              Dúvidas Frequentes
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-neon-purple neon-glow">PERGUNTAS</span>{" "}
            <span className="text-foreground">&</span>{" "}
            <span className="text-neon-cyan neon-glow">RESPOSTAS</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Todas as respostas que você precisa antes de transformar sua vida
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-border bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 data-[state=open]:border-primary data-[state=open]:shadow-soft-pink"
              >
                <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 text-left hover:no-underline group">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 pr-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 group-data-[state=open]:text-accent transition-colors" />
                    <span className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
                  <div className="pl-9 sm:pl-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-block p-6 sm:p-8 rounded-2xl bg-primary/10 backdrop-blur-sm border-2 border-primary/30 max-w-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ainda tem dúvidas?
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4">
              Fala com a gente no WhatsApp! Nossa equipe está pronta para te ajudar 24/7.
            </p>
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform duration-300 cursor-pointer">
              <span className="text-sm sm:text-base">💬 Falar no WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
