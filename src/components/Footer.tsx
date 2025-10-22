import { Instagram, Youtube, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-neon-pink">REAL LIFE</span>
              <br />
              <span className="text-neon-cyan">ACADEMY</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              O treinamento mais completo sobre como ganhar dinheiro na internet.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-primary">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre o Curso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Módulos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Garantia
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-primary">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary hover:bg-primary hover:scale-110 transition-all group"
              >
                <Instagram className="h-5 w-5 text-primary group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary hover:bg-primary hover:scale-110 transition-all group"
              >
                <Youtube className="h-5 w-5 text-primary group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary hover:bg-primary hover:scale-110 transition-all group"
              >
                <Facebook className="h-5 w-5 text-primary group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Real Life Academy. Todos os direitos reservados.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
            {" • "}
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
