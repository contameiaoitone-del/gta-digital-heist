import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

interface AuthState {
  session: Session | null;
  loading: boolean;
  hasAccess: boolean;
  isAdmin: boolean;
  isMaster: boolean;
  isSuperAdmin: boolean;
  checkedAccess: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    hasAccess: false,
    isAdmin: false,
    isMaster: false,
    isSuperAdmin: false,
    checkedAccess: false,
  });

  useEffect(() => {
    // Listener FIRST then getSession (per Supabase rule)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, session, loading: false, checkedAccess: false }));
    });
    supabase.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, session: data.session, loading: false, checkedAccess: false }));
    });
    // Detect impersonation flag from URL
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("impersonating") === "1") {
        if (!localStorage.getItem("impersonator_email")) {
          localStorage.setItem("impersonator_email", "super_admin");
        }
        url.searchParams.delete("impersonating");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (_) {
      // noop
    }
    return () => sub.subscription.unsubscribe();
  }, []);

  // When session changes, fetch access + role
  useEffect(() => {
    if (state.loading) return;
    if (!state.session) {
      setState((s) => ({ ...s, hasAccess: false, isAdmin: false, isMaster: false, isSuperAdmin: false, checkedAccess: true }));
      return;
    }
    let cancelled = false;
    (async () => {
      const userId = state.session!.user.id;
      const [accessRes, roleRes] = await Promise.all([
        supabase.from("member_access").select("id").eq("user_id", userId).eq("active", true).limit(1),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (cancelled) return;
      const roles = (roleRes.data || []).map((r) => r.role);
      const isSuperAdmin = roles.includes("super_admin");
      const isMaster = isSuperAdmin || roles.includes("master");
      // admin == master (alias). A role "admin" legada não concede mais nada por si só.
      const isAdmin = isMaster;
      setState((s) => ({
        ...s,
        hasAccess: (Array.isArray(accessRes.data) && accessRes.data.length > 0) || isAdmin,
        isAdmin,
        isMaster,
        isSuperAdmin,
        checkedAccess: true,
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [state.session, state.loading]);

  return state;
}

export const RequireAuth = ({
  children,
  requireAdmin = false,
  requireMaster = false,
  requireSuperAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMaster?: boolean;
  requireSuperAdmin?: boolean;
}) => {
  const { session, loading, hasAccess, isAdmin, isMaster, isSuperAdmin, checkedAccess } = useAuth();
  const location = useLocation();
  const isSuperRoute = requireSuperAdmin || /^\/super(\/|$)/.test(location.pathname);
  const isMasterRoute = isSuperRoute || requireMaster || /^\/(home|areas|landing-pages)(\/|$)/.test(location.pathname);
  const product = location.pathname.match(/^\/([^/]+)\/(?:membros|admin)/)?.[1] || "treinamento";
  const productPath = `/${encodeURIComponent(product)}`;
  // Share-link expiry watcher: if the user signed in via a share link with an
  // expiration, sign them out automatically when it expires.
  useEffect(() => {
    if (!session) return;
    const expIso = localStorage.getItem("share_session_expires_at");
    if (!expIso) return;
    const expMs = new Date(expIso).getTime();
    const tick = async () => {
      if (Date.now() >= expMs) {
        localStorage.removeItem("share_session_expires_at");
        localStorage.removeItem("share_session_active");
        await supabase.auth.signOut();
        window.location.href = isSuperRoute ? "/super/login" : isMasterRoute ? "/home/login" : `${productPath}/membros/login`;
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session, productPath, isMasterRoute]);
  if (loading || (session && !checkedAccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to={isSuperRoute ? "/super/login" : isMasterRoute ? "/home/login" : `${productPath}/membros/login`} replace />;
  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to="/super/login" replace />;
  if (requireMaster && !isMaster) return <Navigate to="/home/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to={`${productPath}/membros`} replace />;
  if (!requireAdmin && !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Acesso não liberado
          </h1>
          <p className="text-gray-400 mb-6">Sua conta ainda não tem acesso a este conteúdo.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="text-sm underline text-gray-400"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export const useSignOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMasterRoute = /^\/(home|areas|landing-pages)(\/|$)/.test(location.pathname);
  const product = location.pathname.match(/^\/([^/]+)\/(?:membros|admin)/)?.[1] || "treinamento";
  return async () => {
    localStorage.removeItem("share_session_expires_at");
    localStorage.removeItem("share_session_active");
    await supabase.auth.signOut();
    navigate(isMasterRoute ? "/home/login" : `/${encodeURIComponent(product)}/membros/login`);
  };
};
