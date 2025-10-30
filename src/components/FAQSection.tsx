import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Este programa é adequado para mulheres?",
    answer: "A REAL LIFE ACADEMY é adequada para qualquer pessoa, independentemente do gênero, que aspire aprender. A REAL LIFE ACADEMY tem uma base de membros feminina muito grande e tez algumas das nossas maiores histórias de sucesso!"
  },
  {
    question: "Em quanto tempo receberei meu dinheiro de volta?",
    answer: "O reembolso é processado em até 7 dias úteis após a solicitação, diretamente na forma de pagamento que você utilizou na compra. Nossa equipe garante um processo rápido e sem burocracia."
  },
  {
    question: "Preciso de dinheiro quando estiver dentro da REAL LIFE ACADEMY?",
    answer: "Não necessariamente. Você pode começar com métodos que não exigem investimento inicial. No entanto, ter um capital para investir em tráfego pago pode acelerar seus resultados e escalar seu negócio mais rapidamente."
  },
  {
    question: "Minha idade realmente não importa?",
    answer: "Absolutamente não! Temos alunos de 18 a 65+ anos tendo sucesso. O que importa é sua determinação, vontade de aprender e disposição para colocar em prática o que você aprende. A idade é apenas um número."
  },
  {
    question: "Não sei nada sobre as habilidades que você ensina. É um problema?",
    answer: "De forma alguma! Nosso treinamento foi desenvolvido pensando em iniciantes. Começamos do absoluto zero e construímos seu conhecimento passo a passo. Milhares de alunos começaram sem conhecimento prévio e alcançaram resultados incríveis."
  },
  {
    question: "Não tenho muito tempo disponível. Ainda posso me inscrever?",
    answer: "Sim! O programa é flexível e você pode assistir as aulas no seu próprio ritmo. Muitos dos nossos alunos de maior sucesso começaram dedicando apenas 1-2 horas por dia. O importante é a consistência, não a quantidade de horas."
  }
];

export const FAQSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background/95 via-background to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading uppercase tracking-wide mb-4">
              Perguntas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
                Frequentes
              </span>
            </h2>
            <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: "1.7" }}>
              Caso tenha ficado alguma dúvida, leia abaixo algumas das principais questões que já recebemos dos alunos. Ou também entre em contato com nosso suporte.
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border/50 rounded-lg px-6 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left font-body hover:text-primary transition-colors font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground" style={{ lineHeight: "1.7" }}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
