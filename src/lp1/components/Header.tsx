import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showBackButton?: boolean;
}

const Header = ({ showBackButton = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center relative">
        {showBackButton && (
          <button
            onClick={() => navigate('/')}
            className="absolute left-4 flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
            <span className="hidden md:inline text-sm uppercase tracking-wider font-medium">Voltar</span>
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wider uppercase">
          DOMÍNIO
        </h1>
      </div>
    </header>
  );
};

export default Header;
