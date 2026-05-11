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
  checkedAccess: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    hasAccess: false,
    isAdmin: false,
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
    return () => sub.subscription.unsubscribe();
  }, []);

  // When session changes, fetch access + role
  useEffect(() => {
    if (state.loading) return;
    if (!state.session) {
      setState((s) => ({ ...s, hasAccess: false, isAdmin: false, checkedAccess: true }));
      return;
    }
    let cancelled = false;
    (async () => {
      const userId = state.session!.user.id;
      const [accessRes, roleRes] = await Promise.all([
        supabase.from("member_access").select("id").eq("user_id", userId).eq("active", true).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (cancelled) return;
      const isAdmin = (roleRes.data || []).some((r) => r.role === "admin");
      setState((s) => ({
        ...s,
        hasAccess: !!accessRes.data || isAdmin,
        isAdmin,
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
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { session, loading, hasAccess, isAdmin, checkedAccess } = useAuth();
  const location = useLocation();
  const product = location.pathname.match(/^\/([^/]+)\/(?:membros|admin)/)?.[1] || "infozap";
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
        window.location.href = `${productPath}/membros/login`;
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session, productPath]);
  if (loading || (session && !checkedAccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to={`${productPath}/membros/login`} replace />;
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
  const product = location.pathname.match(/^\/([^/]+)\/(?:membros|admin)/)?.[1] || "infozap";
  return async () => {
    localStorage.removeItem("share_session_expires_at");
    localStorage.removeItem("share_session_active");
    await supabase.auth.signOut();
    navigate(`/${encodeURIComponent(product)}/membros/login`);
  };
};
