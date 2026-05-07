import { Toaster } from "@/lp1/components/ui/toaster";
import { Toaster as Sonner } from "@/lp1/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { captureUtmParams, trackPageView } from "./lib/utm";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Games from "./pages/Games";
import Plaquinhas from "./pages/Plaquinhas";
import Extras from "./pages/Extras";
import Caminho1 from "./pages/Caminho1";
import Caminho2 from "./pages/Caminho2";
import Caminho3 from "./pages/Caminho3";
import Call1Hora from "./pages/Call1Hora";

const queryClient = new QueryClient();

/** Captures UTMs and fires PageView on every route change */
function TrackingManager() {
  const location = useLocation();
  
  useEffect(() => {
    captureUtmParams();
    trackPageView();
  }, [location.pathname]);

  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TrackingManager />
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jogos" element={<Games />} />
            <Route path="/plaquinhas" element={<Plaquinhas />} />
            <Route path="/extras" element={<Extras />} />
            <Route path="/caminho1" element={<Caminho1 />} />
            <Route path="/caminho2" element={<Caminho2 />} />
            <Route path="/caminho3" element={<Caminho3 />} />
            <Route path="/call-1-hora" element={<Call1Hora />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
