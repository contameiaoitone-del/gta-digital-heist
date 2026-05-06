import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TrackingProvider } from "./components/TrackingProvider";

const Links = lazy(() => import("./pages/Links"));
const RPClose = lazy(() => import("./pages/RPClose"));
const RPCloseSuccess = lazy(() => import("./pages/RPCloseSuccess"));
const RPZap = lazy(() => import("./pages/RPZap"));
const InfoZap = lazy(() => import("./pages/InfoZap"));
const CloseFriends = lazy(() => import("./pages/CloseFriends"));
const RealZapAcademy = lazy(() => import("./pages/RealZapAcademy"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const MembrosLogin = lazy(() => import("./pages/membros/MembrosLogin"));
const Membros = lazy(() => import("./pages/membros/Membros"));
const Aula = lazy(() => import("./pages/membros/Aula"));
const AuthCallback = lazy(() => import("./pages/membros/AuthCallback"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
import { RequireAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingProvider />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/links" element={<Links />} />
            <Route path="/rp-close" element={<RPClose />} />
            <Route path="/rp-close-sucesso" element={<RPCloseSuccess />} />
            <Route path="/rp-zap" element={<RPZap />} />
            <Route path="/infozap" element={<InfoZap />} />
            <Route path="/closefriends" element={<CloseFriends />} />
            <Route path="/real-zap-academy" element={<RealZapAcademy />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/membros/login" element={<MembrosLogin />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/membros" element={<RequireAuth><Membros /></RequireAuth>} />
            <Route path="/membros/aula/:id" element={<RequireAuth><Aula /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth requireAdmin><Admin /></RequireAuth>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
