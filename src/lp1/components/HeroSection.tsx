
interface HeroSectionProps {
  videoSrc?: string;
}

const HeroSection = ({ videoSrc = "https://flowtech.cloud/IMG_7498.MOV" }: HeroSectionProps) => {
  return (
    <section id="inicio" className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[280px] sm:min-h-[400px] md:min-h-[500px] max-h-[400px] sm:max-h-[600px] md:max-h-[700px]">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src={videoSrc} type="video/mp4" />
          Seu navegador não suporta o vídeo.
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-background/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-8 sm:pb-12 md:pb-16">
        <div className="container mx-auto px-4 text-center w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
            DOMÍNIO: O CAMPO ONDE HOMENS<br />
            TOMAM POSSE DA SUA VIDA.
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-foreground/70 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed font-light">
            Aqui começa sua ascensão no digital — com disciplina, estratégia e propósito.<br className="hidden sm:block" />
            Escolha o caminho, fortaleça sua base e vá construir o que é seu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
