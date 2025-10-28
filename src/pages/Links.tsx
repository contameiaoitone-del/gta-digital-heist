import { Youtube, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import gtaHero from "@/assets/gta-hero-vice-city.png";
import rpCloseBanner from "@/assets/rp-close-banner.png";
import realLifeAcademyBanner from "@/assets/real-life-academy-banner.png";

const Links = () => {
  const links = [
    {
      name: "YouTube",
      url: "https://youtube.com/@reallifeacademy",
      icon: Youtube,
      description: "Conteúdo gratuito sobre vendas",
    },
    {
      name: "RP Close",
      url: "#",
      icon: ExternalLink,
      description: "Sistema de vendas completo",
      image: rpCloseBanner,
    },
    {
      name: "Real Life Academy",
      url: "#",
      icon: GraduationCap,
      description: "A academia que vai mudar sua vida",
      image: realLifeAcademyBanner,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${gtaHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Content */}
      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Logo/Avatar */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-vice p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-neon-cyan neon-glow">Real Life</span>{" "}
            <span className="text-neon-pink neon-glow">Academy</span>
          </h1>
          <p className="text-muted-foreground">
            Transformando vendedores em campeões
          </p>
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              {link.image ? (
                // Link com imagem
                <div 
                  className="relative rounded-lg overflow-hidden min-h-[200px] md:min-h-[240px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(var(--primary)_/_0.4)] bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-orange-900/40"
                  style={{
                    backgroundImage: `url(${link.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-pink/0 to-neon-purple/0 group-hover:from-neon-cyan/10 group-hover:via-neon-pink/10 group-hover:to-neon-purple/10 transition-all duration-300 pointer-events-none" />
                </div>
              ) : (
                // Link sem imagem (estilo original)
                <div className="relative bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)_/_0.3)] hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <link.icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {link.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>

                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>

                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/0 via-neon-pink/0 to-neon-purple/0 group-hover:from-neon-cyan/5 group-hover:via-neon-pink/5 group-hover:to-neon-purple/5 transition-all duration-300 pointer-events-none" />
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Real Life Academy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Links;
