import { Star } from "lucide-react";

const testimonials = [
  {
    name: "João Silva",
    role: "Empreendedor Digital",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    text: "Em apenas 30 dias já tive meu primeiro resultado. O método da Real Life Academy realmente funciona!",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "Afiliada",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    text: "Nunca pensei que seria possível ter resultados tão rápidos. A comunidade me ajudou em cada passo!",
    rating: 5
  },
  {
    name: "Pedro Costa",
    role: "Aluno RLA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    text: "O suporte é incrível! Sempre que preciso, recebo ajuda imediata. Valeu cada centavo investido.",
    rating: 5
  },
  {
    name: "Ana Lima",
    role: "Marketing Digital",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    text: "Saí do zero e já estou fazendo minhas primeiras vendas. O conteúdo é direto ao ponto e funcional!",
    rating: 5
  },
  {
    name: "Carlos Oliveira",
    role: "Produtor de Conteúdo",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    text: "Melhor investimento que fiz em 2024. A Real Life Academy mudou minha visão sobre negócios digitais.",
    rating: 5
  },
  {
    name: "Juliana Ferreira",
    role: "Gestora de Tráfego",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
    text: "Os módulos são bem estruturados e fáceis de seguir. Em 2 meses já consegui meus primeiros clientes!",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading uppercase tracking-wide mb-4">
            O que nossos alunos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              estão dizendo
            </span>
          </h2>
          <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: "1.7" }}>
            Depoimentos reais de quem já está transformando conhecimento em resultados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-neon-pink/0 group-hover:from-primary/10 group-hover:to-neon-pink/10 transition-all duration-300" />
              
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="font-body text-muted-foreground mb-6 italic" style={{ lineHeight: "1.7" }}>
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-body font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm font-body text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
