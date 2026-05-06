import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracking } from "@/hooks/useTracking";
import { ensurePixel } from "@/lib/metaPixel";
import { ensureTtq } from "@/lib/tiktokPixel";
import { ensureUtms } from "@/lib/utmAutoFill";

// Tracking (Pixel + CAPI) is only enabled on the InfoZap funnel.
const TRACKED_ROUTES = ["/infozap"];

/**
 * On every navigation, if the route is part of the InfoZap funnel,
 * loads the Meta Pixel snippet and fires PageView (Pixel + CAPI, deduplicated).
 * Other routes do not load the Pixel and do not call CAPI.
 */
export const TrackingProvider = () => {
  const location = useLocation();
  const { init } = useTracking();

  useEffect(() => {
    const isTracked = TRACKED_ROUTES.some((r) => location.pathname.startsWith(r));
    if (!isTracked) return;
    ensureUtms();
    ensurePixel();
    ensureTtq();
    init();
  }, [location.pathname, init]);

  return null;
};
