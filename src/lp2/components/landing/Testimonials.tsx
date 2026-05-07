import ScrollAnimation from "@/components/ui/scroll-animation";

// Import all testimonial images
import depoimento1 from "@/assets/testimonials/depoimento-1.png";
import depoimento2 from "@/assets/testimonials/depoimento-2.png";
import depoimento3 from "@/assets/testimonials/depoimento-3.png";
import depoimento4 from "@/assets/testimonials/depoimento-4.png";
import depoimento5 from "@/assets/testimonials/depoimento-5.png";
import depoimento6 from "@/assets/testimonials/depoimento-6.png";
import depoimento7 from "@/assets/testimonials/depoimento-7.png";
import depoimento8 from "@/assets/testimonials/depoimento-8.png";
import depoimento9 from "@/assets/testimonials/depoimento-9.png";

const Testimonials = () => {
  const testimonials = [
    { id: 1, image: depoimento1 },
    { id: 2, image: depoimento2 },
    { id: 3, image: depoimento3 },
    { id: 4, image: depoimento4 },
    { id: 5, image: depoimento5 },
    { id: 6, image: depoimento6 },
    { id: 7, image: depoimento7 },
    { id: 8, image: depoimento8 },
    { id: 9, image: depoimento9 },
  ];

  return (
    <section className="py-20 bg-surface-elevated/30">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <span className="text-purple text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              O que os{" "}
              <span className="text-purple">alunos dizem:</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja o resultado de quem já está aplicando o treinamento:
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation 
              key={testimonial.id} 
              delay={index * 0.1}
              className={index >= 8 ? "hidden sm:block" : ""}
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple/30 transition-colors aspect-[3/4]">
                <img 
                  src={testimonial.image} 
                  alt={`Depoimento de cliente ${testimonial.id}`}
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

export default Testimonials;
