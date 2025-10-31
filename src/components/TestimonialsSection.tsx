import result1 from "@/assets/result-1.jpeg";
import result2 from "@/assets/result-2.jpeg";
import result3 from "@/assets/result-3.jpeg";
import result4 from "@/assets/result-4.jpeg";
import result5 from "@/assets/result-5.jpeg";
import result6 from "@/assets/result-6.jpeg";
import result7 from "@/assets/result-7.jpeg";

const results = [
  { image: result1, alt: "Resultados de vendas - Bryan Santos" },
  { image: result2, alt: "Dashboard de lucros - R$ 4.055,79" },
  { image: result3, alt: "Pagamentos recebidos - Matheus" },
  { image: result4, alt: "Notificações de vendas - Bryan Santos" },
  { image: result5, alt: "Pagamentos Pix - Natan Piovezan" },
  { image: result6, alt: "Investimentos recebidos - Natan Piovezan" },
  { image: result7, alt: "Extrato de pagamentos recebidos" }
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que nossos alunos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              estão dizendo
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de quem já está transformando conhecimento em resultados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="group relative rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-neon-pink/0 group-hover:from-primary/10 group-hover:to-neon-pink/10 transition-all duration-300" />
              
              <div className="relative z-10">
                <img
                  src={result.image}
                  alt={result.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
