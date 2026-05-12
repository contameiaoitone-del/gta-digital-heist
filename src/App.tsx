import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";
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
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminPaymentCredentials = lazy(() => import("./pages/admin/PaymentCredentials"));
const ResetPassword = lazy(() => import("./pages/membros/ResetPassword"));
const ShareConsume = lazy(() => import("./pages/membros/ShareConsume"));
const AdminConfiguracoes = lazy(() => import("./pages/admin/Configuracoes"));
const AdminTrackeamento = lazy(() => import("./pages/admin/Trackeamento"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const Lp1App = lazy(() => import("./lp1/Lp1App"));
const Lp2App = lazy(() => import("./lp2/Lp2App"));
const Lp2App97 = lazy(() => import("./lp2/Lp2App97"));
const Lp2App5 = lazy(() => import("./lp2/Lp2App5"));
const MentoriaApp = lazy(() => import("./lp2/MentoriaApp"));
const MasterHome = lazy(() => import("./pages/master/MasterHome"));
const MemberAreas = lazy(() => import("./pages/master/MemberAreas"));
const LandingPages = lazy(() => import("./pages/master/LandingPages"));
const MasterLogin = lazy(() => import("./pages/master/MasterLogin"));
const SuperLogin = lazy(() => import("./pages/super/SuperLogin"));
const SuperHome = lazy(() => import("./pages/super/SuperHome"));
import { RequireAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const LegacyProductRedirect = ({ suffix = "" }: { suffix?: string }) => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get("product") || "treinamento";
  return <Navigate to={`/${encodeURIComponent(product)}/admin${suffix}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingProvider />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Lp2App />} />
            <Route path="/home/login" element={<MasterLogin />} />
            <Route path="/home" element={<RequireAuth requireMaster><MasterHome /></RequireAuth>} />
            <Route path="/areas" element={<RequireAuth requireMaster><MemberAreas /></RequireAuth>} />
            <Route path="/landing-pages" element={<RequireAuth requireMaster><LandingPages /></RequireAuth>} />
            <Route path="/super/login" element={<SuperLogin />} />
            <Route path="/super" element={<RequireAuth requireSuperAdmin><SuperHome /></RequireAuth>} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/membros/login" element={<Navigate to="/treinamento/membros/login" replace />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/membros" element={<Navigate to="/treinamento/membros" replace />} />
            <Route path="/membros/modulo/:id" element={<Navigate to="/treinamento/membros" replace />} />
            <Route path="/membros/aula/:id" element={<Navigate to="/treinamento/membros" replace />} />
            <Route path="/membros/share/:token" element={<ShareConsume />} />
            <Route path="/admin" element={<LegacyProductRedirect />} />
            <Route path="/admin/capi-log" element={<LegacyProductRedirect suffix="/capi-log" />} />
            <Route path="/admin/usuarios" element={<LegacyProductRedirect suffix="/usuarios" />} />
            <Route path="/admin/credenciais" element={<LegacyProductRedirect suffix="/credenciais" />} />
            <Route path="/admin/configuracoes" element={<LegacyProductRedirect suffix="/configuracoes" />} />
            <Route path="/admin/trackeamento" element={<LegacyProductRedirect suffix="/trackeamento" />} />
            <Route path="/:product/membros/login" element={<MembrosLogin />} />
            <Route path="/:product/reset-password" element={<ResetPassword />} />
            <Route path="/:product/membros" element={<RequireAuth><Membros /></RequireAuth>} />
            <Route path="/:product/membros/modulo/:id" element={<RequireAuth><Modulo /></RequireAuth>} />
            <Route path="/:product/membros/aula/:id" element={<RequireAuth><Aula /></RequireAuth>} />
            <Route path="/:product/membros/share/:token" element={<ShareConsume />} />
            <Route path="/:product/admin" element={<RequireAuth requireAdmin><Admin /></RequireAuth>} />
            <Route path="/:product/admin/capi-log" element={<RequireAuth requireAdmin><CapiLog /></RequireAuth>} />
            <Route path="/:product/admin/usuarios" element={<RequireAuth requireAdmin><AdminUsers /></RequireAuth>} />
            <Route path="/:product/admin/credenciais" element={<RequireAuth requireAdmin><AdminPaymentCredentials /></RequireAuth>} />
            <Route path="/:product/admin/configuracoes" element={<RequireAuth requireAdmin><AdminConfiguracoes /></RequireAuth>} />
            <Route path="/:product/admin/trackeamento" element={<RequireAuth requireAdmin><AdminTrackeamento /></RequireAuth>} />

            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/lp1" element={<Lp1App />} />
            <Route path="/lp2" element={<Lp2App />} />
            <Route path="/lp2-97" element={<Lp2App97 />} />
            <Route path="/lp2-5" element={<Lp2App5 />} />
            <Route path="/mentoria" element={<MentoriaApp />} />
            {/* Redirects de rotas antigas removidas */}
            <Route path="/infozap" element={<Navigate to="/lp2" replace />} />
            <Route path="/infozap-aula" element={<Navigate to="/lp2" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
