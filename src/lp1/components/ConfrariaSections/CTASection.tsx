import { Button } from "@/lp1/components/ui/button";

const CTASection = () => {
  return (
    <section id="contato" className="relative py-32 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://flowtech.cloud/WhatsApp%20Video%202025-10-06%20at%2018.27.29.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80"></div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 uppercase tracking-wide">
          ESTÁ PRONTO PARA<br />ESCOLHER SEU CAMINHO?
        </h2>
        
        <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
          Três caminhos. Um propósito. Clique abaixo e tome posse da sua evolução.
        </p>
        
        <Button 
          onClick={() => {
            const element = document.getElementById('caminhos');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          size="lg"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-14 py-7 h-auto uppercase tracking-widest font-bold shadow-2xl shadow-secondary/50 border-2 border-secondary animate-pulse-button transition-all"
        >
          ESCOLHER MEU CAMINHO
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
