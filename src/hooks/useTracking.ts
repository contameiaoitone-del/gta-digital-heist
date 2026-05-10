// Advanced Meta + TikTok tracking hook: client-side Pixel(s) + server-side
// CAPI/Events API with shared event_id for deduplication. Persists session
// context in `visitor_sessions` keyed by a UUID stored in localStorage as the SCK.
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCookie } from "@/lib/cookies";
import { waitForFbq } from "@/lib/metaPixel";
import { waitForTtq, waitForTtp } from "@/lib/tiktokPixel";

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

function readTtclid(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const tt = params.get("ttclid") || "";
    if (tt) {
      // persist for the session window
      document.cookie = `ttclid=${tt}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
      return tt;
    }
  } catch { /* noop */ }
  return getCookie("ttclid") || "";
}

const UTM_COOKIE_MAP: Record<string, string> = {
  utm_source: "cookieUtmSource",
  utm_medium: "cookieUtmMedium",
  utm_campaign: "cookieUtmCampaign",
  utm_content: "cookieUtmContent",
  utm_term: "cookieUtmTerm",
};

function readUtms(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const k of Object.keys(UTM_COOKIE_MAP)) {
      const fromUrl = params.get(k);
      if (fromUrl) {
        out[k] = fromUrl;
        document.cookie = `${UTM_COOKIE_MAP[k]}=${encodeURIComponent(fromUrl)}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
        continue;
      }
      const fromCookie = getCookie(UTM_COOKIE_MAP[k]);
      if (fromCookie) out[k] = decodeURIComponent(fromCookie);
    }
  } catch { /* noop */ }
  return out;
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

function ttq(event: string, params: Record<string, unknown>, opts?: { event_id?: string }) {
  if (typeof window === "undefined") return;
  try {
    window.ttq?.track?.(event, params, opts);
  } catch (e) {
    console.warn("ttq error", e);
  }
}

/** Wait for Pixel to write the _fbp cookie, up to `timeoutMs`. */
async function waitForFbp(timeoutMs = 1500): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const v = getCookie("_fbp");
    if (v) return v;
    await new Promise((r) => setTimeout(r, 100));
  }
  return getCookie("_fbp") || "";
}

async function callCapi(payload: Record<string, unknown>) {
  try { await supabase.functions.invoke("meta-capi", { body: payload }); }
  catch (e) { console.warn("capi error", e); }
}

async function callTiktok(payload: Record<string, unknown>) {
  try { await supabase.functions.invoke("tiktok-events", { body: payload }); }
  catch (e) { console.warn("tiktok-events error", e); }
}

async function callTrack(payload: Record<string, unknown>) {
  try { await supabase.functions.invoke("track-session", { body: payload }); }
  catch (e) { console.warn("track-session error", e); }
}

export function useTracking() {
  const lastUrlRef = useRef<string | null>(null);

  const init = useCallback(async () => {
    const pageUrl = window.location.href;
    if (lastUrlRef.current === pageUrl) return;
    lastUrlRef.current = pageUrl;

    const sessionId = getSessionId();
    const fbc = readFbc();
    const ttclid = readTtclid();
    const fbclid = new URLSearchParams(window.location.search).get("fbclid") || "";
    const userAgent = navigator.userAgent;
    const eventId = uuid();
    const eventIdTt = uuid();
    const geo = await readGeo();
    const utms = readUtms();

    await waitForFbq(2000);
    await waitForTtq(2000);
    fbq("track", "PageView", {}, { eventID: eventId });
    ttq("Pageview", {}, { event_id: eventIdTt });

    // Wait for browser cookies (_fbp / _ttp) so server requests share them.
    const [fbp, ttp] = await Promise.all([waitForFbp(1500), waitForTtp(1500)]);

    await callTrack({
      session_id: sessionId,
      fbc, fbp, fbclid,
      ttclid, ttp,
      user_agent: userAgent,
      page_location: pageUrl,
      event_id_pageview: eventId,
      event_id_pageview_tt: eventIdTt,
      ...geo,
      ...utms,
    });

    callCapi({
      event_name: "PageView",
      event_id: eventId,
      event_source_url: pageUrl,
      session_id: sessionId,
      fbc, fbp,
      user_agent: userAgent,
      ...geo,
    });
    callTiktok({
      event_name: "Pageview",
      event_id: eventIdTt,
      event_source_url: pageUrl,
      session_id: sessionId,
      ttclid, ttp,
      user_agent: userAgent,
      ...geo,
    });
  }, []);

  const trackInitiateCheckout = useCallback(async (data?: { value?: number; currency?: string }) => {
    const sessionId = getSessionId();
    const fbc = readFbc();
    const ttclid = readTtclid();
    const eventId = uuid();
    const eventIdTt = uuid();
    const pageUrl = window.location.href;

    await callTrack({
      session_id: sessionId,
      event_id_initiate: eventId,
      event_id_initiate_tt: eventIdTt,
      ...readUtms(),
    });

    await Promise.all([waitForFbq(2000), waitForTtq(2000)]);
    const [fbp, ttp] = await Promise.all([waitForFbp(1500), waitForTtp(1500)]);

    fbq("track", "InitiateCheckout",
      { value: data?.value, currency: data?.currency || "BRL", content_name: "Treinamento" },
      { eventID: eventId },
    );
    ttq("InitiateCheckout",
      {
        value: data?.value, currency: data?.currency || "BRL",
        contents: [{ content_id: "infozap", content_name: "Treinamento", content_type: "product", quantity: 1, price: data?.value || 0 }],
        content_type: "product",
      },
      { event_id: eventIdTt },
    );

    callCapi({
      event_name: "InitiateCheckout",
      event_id: eventId,
      event_source_url: pageUrl,
      session_id: sessionId,
      fbc, fbp,
      user_agent: navigator.userAgent,
      value: data?.value, currency: data?.currency || "BRL",
      content_name: "Treinamento",
    });
    callTiktok({
      event_name: "InitiateCheckout",
      event_id: eventIdTt,
      event_source_url: pageUrl,
      session_id: sessionId,
      ttclid, ttp,
      user_agent: navigator.userAgent,
      value: data?.value, currency: data?.currency || "BRL",
      content_name: "Treinamento",
      content_id: "infozap",
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
        first_name, last_name,
        email: data.email,
        phone: data.phone,
        external_id: data.cpf,
      });
    },
    [],
  );

  const trackPurchase = useCallback(
    async (data: { value: number; eventId: string; orderId?: string; productName?: string; currency?: string }) => {
      await Promise.all([waitForFbq(2000), waitForTtq(2000)]);
      fbq("track", "Purchase",
        { value: data.value, currency: data.currency || "BRL", content_name: data.productName, order_id: data.orderId },
        { eventID: data.eventId },
      );
      ttq("CompletePayment",
        {
          value: data.value, currency: data.currency || "BRL",
          contents: [{ content_id: data.orderId || "infozap", content_name: data.productName || "Treinamento", content_type: "product", quantity: 1, price: data.value }],
          content_type: "product",
          order_id: data.orderId,
        },
        { event_id: data.eventId },
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
