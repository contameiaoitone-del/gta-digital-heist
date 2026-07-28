import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lp2/components/ui/accordion";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

// FAQ genérico para páginas de lead magnet (aula avulsa) — perguntas e
// respostas totalmente customizadas por página via prop, já que o modelo
// (aula única, vitalícia, R$20) não tem nada em comum com o FAQ da mentoria.
interface Faq {
  question: string;
  answer: string;
}

const FAQLeadMagnet = ({ faqs }: { faqs: Faq[] }) => {
  return (
    <section className="py-14 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-purple text-xs sm:text-sm font-semibold uppercase tracking-wider">Dúvidas</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
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

export default FAQLeadMagnet;
