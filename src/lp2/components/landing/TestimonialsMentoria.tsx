import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import dep1 from "@/lp2/assets/testimonials-mentoria/dep-1.png";
import dep2 from "@/lp2/assets/testimonials-mentoria/dep-2.png";
import dep3 from "@/lp2/assets/testimonials-mentoria/dep-3.png";
import dep4 from "@/lp2/assets/testimonials-mentoria/dep-4.png";
import dep5 from "@/lp2/assets/testimonials-mentoria/dep-5.png";
import dep6 from "@/lp2/assets/testimonials-mentoria/dep-6.png";
import dep7 from "@/lp2/assets/testimonials-mentoria/dep-7.png";
import dep8 from "@/lp2/assets/testimonials-mentoria/dep-8.png";
import dep9 from "@/lp2/assets/testimonials-mentoria/dep-9.png";
import dep10 from "@/lp2/assets/testimonials-mentoria/dep-10.png";

// `subtitle` é sobrescrito na /mentoria-temp, onde não existe o modelo de turma.
const TestimonialsMentoria = ({
  subtitle = "Resultados reais de quem entrou em uma turma da mentoria em grupo:",
}: { subtitle?: string } = {}) => {
  const testimonials = [
    { id: 1, image: dep1 },
    { id: 2, image: dep2 },
    { id: 3, image: dep3 },
    { id: 4, image: dep4 },
    { id: 5, image: dep5 },
    { id: 6, image: dep6 },
    { id: 7, image: dep7 },
    { id: 8, image: dep8 },
    { id: 9, image: dep9 },
    { id: 10, image: dep10 },
  ];

  return (
    <section className="py-20 bg-surface-elevated/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="text-purple text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              O que os{" "}
              <span className="text-purple">alunos da mentoria dizem:</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {testimonials.map((t, index) => (
            <ScrollAnimation key={t.id} delay={index * 0.1}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple/30 transition-colors aspect-[3/4]">
                <img
                  src={t.image}
                  alt={`Depoimento mentoria ${t.id}`}
                  className="w-full h-full object-cover object-top"
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