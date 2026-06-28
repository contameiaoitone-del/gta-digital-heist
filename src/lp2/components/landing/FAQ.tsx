import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lp2/components/ui/accordion";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

const FAQ = () => {
  const faqs = [
    {
      question: "Para quem é o treinamento X1 no Pix?",
      answer: "O treinamento é para quem quer rodar ou já roda operação de X1 no WhatsApp. Seja você iniciante querendo aprender do zero, ou experiente querendo escalar com estratégias avançadas.",
    },
    {
      question: "Preciso ter experiência com X1?",
      answer: "Não! São mais de 40 aulas que ensinam do zero ao avançado. Você vai aprender tudo: desde como montar sua primeira operação até estratégias de escala e tráfego pago.",
    },
    {
      question: "Quanto preciso investir em anúncio?",
      answer: "Dá pra começar com R$15 por dia. Com a taxa de conversão do método você não precisa de orçamento absurdo pra ter retorno.",
    },
    {
      question: "Por quanto tempo tenho acesso?",
      answer: "Acesso vitalício. Comprou uma vez, é seu para sempre — incluindo as atualizações futuras sem custo adicional.",
    },
    {
      question: "Quando recebo o acesso?",
      answer: "Imediatamente após a confirmação do pagamento. Pix é instantâneo — seu acesso também.",
    },
    {
      question: "Quanto tempo leva para ter resultado?",
      answer: "Depende do seu comprometimento. O método é para pessoas sérias. Se você seguir o passo a passo do treinamento, não tem como não vender. Se não tiver resultado, não vai ser por falta de método.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <span className="text-purple text-sm font-semibold uppercase tracking-wider">Dúvidas</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Perguntas{" "}
              <span className="text-purple">Frequentes</span>
            </h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-purple/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="text-foreground font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FAQ;
