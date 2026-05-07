import { Home } from "lucide-react";
import { useAuth } from "@/lp1/contexts/AuthContext";

const FooterMenu = () => {
  const { user } = useAuth();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-sm border-t-2 border-primary/30 z-40">
      <div className="flex justify-center py-3">
        <button 
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 px-8 py-2 text-foreground/70 hover:text-primary transition-all hover:scale-110"
        >
          <Home size={22} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Home</span>
        </button>
      </div>
    </div>
  );
};

export default FooterMenu;
