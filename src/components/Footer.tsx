export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm font-body text-muted-foreground">
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
