import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lp2/components/ui/accordion";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";

/**
 * FAQ da /mentoria-temp. Separado do FAQMentoria porque aquele é escrito em
 * cima do modelo de lista de espera + turma mensal, que não vale aqui: nesta
 * página a entrada é imediata e o preço é exibido na tela.
 */
// `respostaPreco` é sobrescrita na /mentoria, que cobra o valor cheio sem desconto.
const RESPOSTA_PRECO_PADRAO =
  "De R$ 997 por R$ 797 enquanto o desconto estiver valendo, com acesso válido por 3 meses.";

const FAQMentoriaTemp = ({
  respostaPreco = RESPOSTA_PRECO_PADRAO,
}: { respostaPreco?: string } = {}) => {
  const faqs = [
    {
      question: "Como funciona a mentoria?",
      answer: "Você tem acesso direto a mim (João Lucas): uma call em grupo todo sábado às 14h e o grupo de networking no WhatsApp com os outros mentorados. Eu te acompanho na escolha do nicho, na montagem da estrutura e nas primeiras vendas.",
    },
    {
      question: "Quanto custa a mentoria?",
      answer: respostaPreco,
    },
    {
      question: "Por quanto tempo eu tenho acesso?",
      answer: "3 meses a partir da sua entrada. Durante esse período você participa de todas as calls de sábado e fica no grupo de networking.",
    },
    {
      question: "O que eu recebo ao entrar?",
      answer: "Call em grupo todo sábado às 14h comigo e o grupo de networking no WhatsApp com os outros mentorados, além do acompanhamento até a primeira venda.",
    },
    {
      question: "Preciso ter experiência?",
      answer: "Não. Eu te ajudo a escolher o caminho que faz mais sentido pra você e te oriento passo a passo até a primeira venda.",
    },
    {
      question: "Como faço para entrar?",
      answer: "É só clicar no botão de entrar na mentoria aqui na página. Você é direcionado direto para o WhatsApp — não tem lista de espera nem data de abertura para aguardar.",
    },
  ];

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

export default FAQMentoriaTemp;
