import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MetaPixelProvider from "./components/MetaPixelProvider";
import Index from "./pages/Index";
import Links from "./pages/Links";
import RPClose from "./pages/RPClose";
import RPCloseSuccess from "./pages/RPCloseSuccess";
import RPZap from "./pages/RPZap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MetaPixelProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/links" element={<Links />} />
            <Route path="/rp-close" element={<RPClose />} />
            <Route path="/rp-close-sucesso" element={<RPCloseSuccess />} />
            <Route path="/rp-zap" element={<RPZap />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MetaPixelProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
