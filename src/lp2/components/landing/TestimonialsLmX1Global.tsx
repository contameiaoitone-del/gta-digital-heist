import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import dep1 from "@/lp2/assets/testimonials-lm-x1global/dep-1.jpg";
import dep2 from "@/lp2/assets/testimonials-lm-x1global/dep-2.jpg";
import dep3 from "@/lp2/assets/testimonials-lm-x1global/dep-3.jpg";
import dep4 from "@/lp2/assets/testimonials-lm-x1global/dep-4.jpg";

// Depoimentos exclusivos da /lm-x1global — grid de 2 colunas, prints reais.
const TestimonialsLmX1Global = () => {
  const testimonials = [
    { id: 1, image: dep1 },
    { id: 2, image: dep2 },
    { id: 3, image: dep3 },
    { id: 4, image: dep4 },
  ];

  return (
    <section className="py-14 sm:py-20 bg-surface-elevated/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-purple text-xs sm:text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              Resultados reais de quem já está{" "}
              <span className="text-purple">vendendo no X1 Global</span>
            </h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {testimonials.map((t, index) => (
            <ScrollAnimation key={t.id} delay={index * 0.1}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple/30 transition-colors">
                <img
                  src={t.image}
                  alt={`Depoimento X1 Global ${t.id}`}
                  className="w-full h-full object-cover"
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

export default TestimonialsLmX1Global;
