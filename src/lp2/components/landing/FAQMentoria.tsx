import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lp2/components/ui/accordion";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

const FAQMentoria = () => {
  const faqs = [
    {
      question: "Como funciona a mentoria?",
      answer: "É uma turma fechada por mês, com acesso direto a mim (João Lucas). Eu te entrego 4 produtos validados e te acompanho na escolha do nicho, montagem da estrutura e nas primeiras vendas.",
    },
    {
      question: "Quantas vagas tem por turma?",
      answer: "Vagas limitadas. Por isso a entrada é por lista de espera — quem está no grupo do WhatsApp é avisado primeiro quando uma nova turma abre.",
    },
    {
      question: "Quanto custa a mentoria?",
      answer: "O valor é apresentado individualmente para quem está no grupo de espera no momento em que a turma é aberta. Esse é o único produto que tem acesso direto a mim.",
    },
    {
      question: "Preciso ter experiência?",
      answer: "Não. Eu te ajudo a escolher entre 4 produtos validados o que faz mais sentido pra você e te oriento passo a passo até a primeira venda.",
    },
    {
      question: "Como entro para o grupo de espera?",
      answer: "Clique no botão de entrar para o grupo de espera, assista o vídeo no popup e em seguida você é redirecionado para o grupo no WhatsApp.",
    },
    {
      question: "Quando abre a próxima turma?",
      answer: "Eu abro 1 turma nova por mês. A data exata é avisada primeiro dentro do grupo de espera.",
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

export default FAQMentoria;