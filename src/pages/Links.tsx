import { Youtube, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import gtaHero from "@/assets/gta-collage-background.png";
import rpCloseBanner from "@/assets/rp-close-banner.png";
import realLifeAcademyBanner from "@/assets/real-life-academy-banner.png";
import caioDalcinProfile from "@/assets/caio-dalcin-profile.png";
import caioDalcinLogo from "@/assets/caio-dalcin-logo.png";
import GameLoader from "@/components/GameLoader";

const Links = () => {
  const links = [
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
      <GameLoader />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 noise-texture"
        style={{ backgroundImage: `url(${gtaHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-background/90 via-background/97 to-background" />

      {/* Content */}
      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Logo/Avatar */}
        <div className="mb-8 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-4 rounded-full bg-gradient-vice p-1 animate-glow-pulse gta-avatar-border">
            <img 
              src={caioDalcinProfile} 
              alt="Caio Dalcin" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex justify-center mb-2">
            <img 
              src={caioDalcinLogo} 
              alt="Caio Dalcin" 
              className="h-48 md:h-56 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
          </div>
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
                  className="relative rounded-lg overflow-hidden min-h-[200px] md:min-h-[240px] bg-background/10 gta-card-border clip-gta"
                  style={{
                    backgroundImage: `url(${link.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="external-link-icon">
                    <ExternalLink className="w-4 h-4 text-neon-pink" />
                  </div>
                </div>
              ) : (
                // Link sem imagem (estilo original)
                <div className="relative bg-card/50 backdrop-blur-md border-2 border-neon-pink/20 rounded-lg p-6 transition-all duration-300 hover:border-neon-pink/50 hover:shadow-volumetric-pink hover:scale-[1.03] animate-glow-pulse">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 flex items-center justify-center group-hover:from-neon-cyan/30 group-hover:to-neon-pink/30 transition-colors shadow-soft-pink">
                      <link.icon className="w-6 h-6 text-neon-pink" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-neon-pink transition-colors" style={{ textShadow: '0 0 10px rgba(255,105,180,0.3)' }}>
                        {link.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>

                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-neon-pink transition-colors flex-shrink-0" />
                  </div>

                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/0 via-neon-pink/0 to-neon-purple/0 group-hover:from-neon-cyan/10 group-hover:via-neon-pink/10 group-hover:to-neon-purple/10 transition-all duration-300 pointer-events-none" />
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Links;
