import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracking } from "@/hooks/useTracking";
import { ensurePixel } from "@/lib/metaPixel";
import { ensureTtq } from "@/lib/tiktokPixel";
import { ensureUtms } from "@/lib/utmAutoFill";
import { supabase } from "@/integrations/supabase/client";

// Tracking (Pixel + CAPI) is enabled on the InfoZap funnel and on the LP1/LP2 landing pages.
const TRACKED_ROUTES = ["/lp1", "/lp2", "/mentoria"];

let pixelsLoaded = false;
async function loadConfiguredPixels() {
  if (pixelsLoaded) return;
  pixelsLoaded = true;
  try {
    const { data, error } = await supabase.rpc("get_active_tracking_pixels");
    if (error || !data || (data as Array<unknown>).length === 0) {
      // Fallback: original hard-coded pixels
      ensurePixel();
      ensureTtq();
      return;
    }
    const rows = data as Array<{ platform: string; pixel_id: string }>;
    const meta = rows.filter((r) => r.platform === "meta");
    const tiktok = rows.filter((r) => r.platform === "tiktok");

    // Assign one Meta pixel per session (deterministic split server-side).
    let assignedMeta: string | null = null;
    if (meta.length > 1) {
      try {
        const { getSessionId } = await import("@/hooks/useTracking");
        const sck = getSessionId();
        const { data: assign } = await supabase.functions.invoke("assign-session-pixel", {
          body: { sck },
        });
        const r = assign as { pixel_id?: string } | null;
        if (r?.pixel_id) assignedMeta = r.pixel_id;
      } catch (e) {
        console.warn("assign-session-pixel failed, loading all meta pixels", e);
      }
    }

    if (meta.length === 0) ensurePixel();
    else if (assignedMeta) ensurePixel(assignedMeta);
    else for (const m of meta) ensurePixel(m.pixel_id);

    if (tiktok.length === 0) ensureTtq();
    else for (const t of tiktok) ensureTtq(t.pixel_id);
  } catch {
    ensurePixel();
    ensureTtq();
  }
}

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
    loadConfiguredPixels().finally(() => init());
  }, [location.pathname, init]);

  return null;
};
