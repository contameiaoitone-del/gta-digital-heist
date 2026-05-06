// Advanced Meta tracking hook: client-side Pixel + server-side CAPI with shared
// event_id for deduplication. Persists session context in `visitor_sessions`
// keyed by a UUID stored in localStorage as the SCK.
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCookie } from "@/lib/cookies";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SCK_KEY = "rla_sck";
const GEO_KEY = "rla_geo";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getSessionId(): string {
  try {
    let v = localStorage.getItem(SCK_KEY);
    if (!v) {
      v = uuid();
      localStorage.setItem(SCK_KEY, v);
    }
    return v;
  } catch {
    return uuid();
  }
}

function readFbc(): string {
  const existing = getCookie("_fbc");
  if (existing) return existing;
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get("fbclid");
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      document.cookie = `_fbc=${fbc}; max-age=${90 * 24 * 60 * 60}; path=/; SameSite=Lax`;
      return fbc;
    }
  } catch {
    /* noop */
  }
  return "";
}

async function readGeo(): Promise<{ country?: string; state?: string; city?: string }> {
  try {
    const cached = sessionStorage.getItem(GEO_KEY);
    if (cached) return JSON.parse(cached);
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return {};
    const d = await res.json();
    const geo = {
      country: (d.country_code || "BR").toLowerCase(),
      state: (d.region_code || "").toLowerCase(),
      city: (d.city || "").toLowerCase(),
    };
    sessionStorage.setItem(GEO_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return {};
  }
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") window.fbq(...args);
}

async function callCapi(payload: Record<string, unknown>) {
  try {
    await supabase.functions.invoke("meta-capi", { body: payload });
  } catch (e) {
    console.warn("capi error", e);
  }
}

async function callTrack(payload: Record<string, unknown>) {
  try {
    await supabase.functions.invoke("track-session", { body: payload });
  } catch (e) {
    console.warn("track-session error", e);
  }
}

export function useTracking() {
  const lastUrlRef = useRef<string | null>(null);

  const init = useCallback(async () => {
    const pageUrl = window.location.href;
    if (lastUrlRef.current === pageUrl) return;
    lastUrlRef.current = pageUrl;

    const sessionId = getSessionId();
    const fbc = readFbc();
    const fbp = getCookie("_fbp");
    const fbclid = new URLSearchParams(window.location.search).get("fbclid") || "";
    const userAgent = navigator.userAgent;
    const eventId = uuid();
    const geo = await readGeo();

    await callTrack({
      session_id: sessionId,
      fbc,
      fbp,
      fbclid,
      user_agent: userAgent,
      page_location: pageUrl,
      event_id_pageview: eventId,
      ...geo,
    });

    fbq("track", "PageView", {}, { eventID: eventId });
    callCapi({
      event_name: "PageView",
      event_id: eventId,
      event_source_url: pageUrl,
      session_id: sessionId,
      fbc,
      fbp,
      user_agent: userAgent,
      ...geo,
    });
  }, []);

  const trackInitiateCheckout = useCallback(async (data?: { value?: number; currency?: string }) => {
    const sessionId = getSessionId();
    const fbc = readFbc();
    const fbp = getCookie("_fbp");
    const eventId = uuid();
    const pageUrl = window.location.href;

    await callTrack({ session_id: sessionId, event_id_initiate: eventId });

    fbq("track", "InitiateCheckout", { value: data?.value, currency: data?.currency || "BRL" }, { eventID: eventId });
    callCapi({
      event_name: "InitiateCheckout",
      event_id: eventId,
      event_source_url: pageUrl,
      session_id: sessionId,
      fbc,
      fbp,
      user_agent: navigator.userAgent,
      value: data?.value,
      currency: data?.currency || "BRL",
    });
  }, []);

  const saveLead = useCallback(
    async (data: { name?: string; email?: string; phone?: string; cpf?: string }) => {
      const sessionId = getSessionId();
      const parts = (data.name || "").trim().split(/\s+/);
      const first_name = parts[0] || undefined;
      const last_name = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
      await callTrack({
        session_id: sessionId,
        first_name,
        last_name,
        email: data.email,
        phone: data.phone,
        external_id: data.cpf,
      });
    },
    [],
  );

  const trackPurchase = useCallback(
    (data: { value: number; eventId: string; orderId?: string; productName?: string; currency?: string }) => {
      fbq(
        "track",
        "Purchase",
        {
          value: data.value,
          currency: data.currency || "BRL",
          content_name: data.productName,
          order_id: data.orderId,
        },
        { eventID: data.eventId },
      );
    },
    [],
  );

  return { init, trackInitiateCheckout, saveLead, trackPurchase, getSessionId };
}

// Convenience: auto-init PageView on mount
export function useTrackingPageView() {
  const { init } = useTracking();
  useEffect(() => {
    init();
  }, [init]);
}
