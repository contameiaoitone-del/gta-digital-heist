import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TrackingProvider } from "./components/TrackingProvider";

const Termos = lazy(() => import("./pages/legal/Termos"));
const Privacidade = lazy(() => import("./pages/legal/Privacidade"));
const Contato = lazy(() => import("./pages/legal/Contato"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const MembrosLogin = lazy(() => import("./pages/membros/MembrosLogin"));
const Membros = lazy(() => import("./pages/membros/Membros"));
const Aula = lazy(() => import("./pages/membros/Aula"));
const Modulo = lazy(() => import("./pages/membros/Modulo"));
const AuthCallback = lazy(() => import("./pages/membros/AuthCallback"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const CapiLog = lazy(() => import("./pages/admin/CapiLog"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const Lp1App = lazy(() => import("./lp1/Lp1App"));
const Lp2App = lazy(() => import("./lp2/Lp2App"));
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
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/membros/login" element={<MembrosLogin />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/membros" element={<RequireAuth><Membros /></RequireAuth>} />
            <Route path="/membros/modulo/:id" element={<RequireAuth><Modulo /></RequireAuth>} />
            <Route path="/membros/aula/:id" element={<RequireAuth><Aula /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth requireAdmin><Admin /></RequireAuth>} />
            <Route path="/admin/capi-log" element={<RequireAuth requireAdmin><CapiLog /></RequireAuth>} />

            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/lp1" element={<Lp1App />} />
            <Route path="/lp2" element={<Lp2App />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
