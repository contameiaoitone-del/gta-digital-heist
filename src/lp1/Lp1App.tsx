import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lp1/contexts/AuthContext";
import "@/lp1/index.css";
import "@/lp1/styles/animations.css";
import Index from "@/lp1/pages/Index";
import NotFound from "@/lp1/pages/NotFound";
import Games from "@/lp1/pages/Games";
import Plaquinhas from "@/lp1/pages/Plaquinhas";
import Extras from "@/lp1/pages/Extras";
import Caminho1 from "@/lp1/pages/Caminho1";
import Caminho2 from "@/lp1/pages/Caminho2";
import Caminho3 from "@/lp1/pages/Caminho3";
import Call1Hora from "@/lp1/pages/Call1Hora";

const Lp1App = () => (
  <AuthProvider>
    <div className="lp1-root bg-background text-foreground font-netflix min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="jogos" element={<Games />} />
        <Route path="plaquinhas" element={<Plaquinhas />} />
        <Route path="extras" element={<Extras />} />
        <Route path="caminho1" element={<Caminho1 />} />
        <Route path="caminho2" element={<Caminho2 />} />
        <Route path="caminho3" element={<Caminho3 />} />
        <Route path="call-1-hora" element={<Call1Hora />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </AuthProvider>
);

export default Lp1App;