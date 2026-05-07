import ScrollAnimation from "@/components/ui/scroll-animation";

const Footer = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Treinamento X1 no Pix</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a 
                href="#o-que-voce-recebe" 
                className="hover:text-foreground transition-colors"
                onClick={(e) => handleSmoothScroll(e, 'o-que-voce-recebe')}
              >
                O que está incluso
              </a>
              <a 
                href="#quem-e-joao" 
                className="hover:text-foreground transition-colors"
                onClick={(e) => handleSmoothScroll(e, 'quem-e-joao')}
              >
                Sobre
              </a>
              <a 
                href="#final-cta" 
                className="hover:text-foreground transition-colors"
                onClick={(e) => handleSmoothScroll(e, 'final-cta')}
              >
                Entrar
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Treinamento X1 no Pix. Todos os direitos reservados.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </footer>
  );
};

export default Footer;