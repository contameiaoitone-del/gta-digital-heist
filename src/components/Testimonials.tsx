import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import cityscapeImage from "@/assets/gta-cityscape-night.png";

const testimonials = [
  {
    id: 1,
    name: "Carlos Silva",
    role: "Ex-Uber Driver",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    result: "R$0 → R$15k/mês",
    videoUrl: "#", // Placeholder - usuário vai substituir
  },
  {
    id: 2,
    name: "Ana Costa",
    role: "Ex-Professora",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
    result: "R$3k → R$28k/mês",
    videoUrl: "#",
  },
  {
    id: 3,
    name: "Rafael Mendes",
    role: "Ex-Garçom",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop",
    result: "R$2k → R$35k/mês",
    videoUrl: "#",
  },
];

export const Testimonials = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={cityscapeImage} alt="Vice City Skyline - Real Life Academy" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      </div>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="atmospheric-haze" />
      <div className="noise-texture" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-block px-4 sm:px-6 py-2 rounded-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">
              📹 Prova Real
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-neon-pink neon-glow">ALUNOS</span>{" "}
            <span className="text-foreground">QUE</span>{" "}
            <span className="text-neon-cyan neon-glow">SAÍRAM</span>{" "}
            <span className="text-foreground">DO</span>{" "}
            <span className="text-neon-orange neon-glow">ZERO</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja os depoimentos reais de quem já está vivendo a vida que você ainda sonha
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-center justify-center">
                  <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110 shadow-soft-pink">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </button>
                </div>

                {/* Result Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-primary/90 backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-bold text-primary-foreground">
                    {testimonial.result}
                  </span>
                </div>
              </div>

              {/* Testimonial Info */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            <span className="text-primary font-bold">+5.000 alunos</span> já transformaram suas vidas.{" "}
            <span className="text-foreground font-bold">Você é o próximo?</span>
          </p>
        </div>
      </div>
    </section>
  );
};
