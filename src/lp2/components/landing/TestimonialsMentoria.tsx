import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import dep1 from "@/lp2/assets/testimonials-mentoria/dep-1.png";
import dep2 from "@/lp2/assets/testimonials-mentoria/dep-2.png";

const TestimonialsMentoria = () => {
  const testimonials = [
    { id: 1, image: dep1 },
    { id: 2, image: dep2 },
  ];

  return (
    <section className="py-20 bg-surface-elevated/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="text-purple text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              O que os{" "}
              <span className="text-purple">alunos da mentoria dizem:</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Resultados reais de quem entrou em uma turma da mentoria em grupo:
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <ScrollAnimation key={t.id} delay={index * 0.1}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple/30 transition-colors">
                <img
                  src={t.image}
                  alt={`Depoimento mentoria ${t.id}`}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMentoria;