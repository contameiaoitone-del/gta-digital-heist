import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracking } from "@/hooks/useTracking";

const EXCLUDED_ROUTES = ["/obrigado", "/rp-close-sucesso"];

/**
 * Initializes session tracking + PageView (Pixel + CAPI) on every navigation,
 * skipping post-purchase pages where Purchase has already been credited.
 */
export const TrackingProvider = () => {
  const location = useLocation();
  const { init } = useTracking();

  useEffect(() => {
    if (EXCLUDED_ROUTES.some((r) => location.pathname.startsWith(r))) return;
    init();
  }, [location.pathname, init]);

  return null;
};
