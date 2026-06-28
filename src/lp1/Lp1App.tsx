import { AuthProvider } from "@/lp1/contexts/AuthContext";
import "@/lp1/index.css";
import "@/lp1/styles/animations.css";
import Index from "@/lp1/pages/Index";

const Lp1App = () => (
  <AuthProvider>
    <div className="lp1-root bg-background text-foreground font-netflix min-h-screen">
      <Index />
    </div>
  </AuthProvider>
);

export default Lp1App;