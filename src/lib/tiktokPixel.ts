// TikTok Pixel loader — loads only on demand (e.g., /infozap routes).
// Pixel ID is read from VITE_TIKTOK_PIXEL_ID, with a fallback constant.
export const TIKTOK_PIXEL_ID =
  (import.meta as { env?: Record<string, string> }).env?.VITE_TIKTOK_PIXEL_ID || "";

declare global {
  interface Window {
    ttq?: {
      (...args: unknown[]): void;
      track?: (event: string, params?: Record<string, unknown>, opts?: { event_id?: string }) => void;
      page?: (params?: Record<string, unknown>, opts?: { event_id?: string }) => void;
      load?: (id: string, opts?: Record<string, unknown>) => void;
      identify?: (params: Record<string, unknown>) => void;
      instance?: (id: string) => unknown;
      _i?: Record<string, unknown>;
      _t?: Record<string, number>;
      _o?: Record<string, unknown>;
      methods?: string[];
      setAndDefer?: (...args: unknown[]) => void;
      [k: string]: unknown;
    };
    TiktokAnalyticsObject?: string;
  }
}

let snippetInjected = false;
const initedPixels = new Set<string>();

/** Idempotently inject the TikTok Pixel base snippet and init the given pixel id. */
export function ensureTtq(pixelId: string = TIKTOK_PIXEL_ID): void {
  if (typeof window === "undefined" || !pixelId) return;

  if (!snippetInjected && !window.ttq) {
    /* eslint-disable */
    (function (w: any, d: Document, t: string) {
      w.TiktokAnalyticsObject = t;
      const ttq: any = (w[t] = w[t] || []);
      ttq.methods = [
        "page", "track", "identify", "instances", "debug", "on", "off", "once",
        "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent",
      ];
      ttq.setAndDefer = function (a: any, b: string) {
        a[b] = function () { a.push([b].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (a: string) {
        const e = ttq._i[a] || [];
        for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e: string, n?: any) {
        const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        const o = n && n.partner;
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        const s = d.createElement("script") as HTMLScriptElement;
        s.type = "text/javascript";
        s.async = true;
        s.src = r + "?sdkid=" + e + "&lib=" + t;
        const u = d.getElementsByTagName("script")[0];
        u.parentNode?.insertBefore(s, u);
      };
    })(window, document, "ttq");
    /* eslint-enable */
    snippetInjected = true;
  }

  if (!initedPixels.has(pixelId)) {
    try {
      window.ttq?.load?.(pixelId);
      window.ttq?.page?.();
      initedPixels.add(pixelId);
    } catch (e) {
      console.warn("[ttq] init failed", e);
    }
  }
}

/** Wait for window.ttq to be available (script loaded), up to `timeoutMs`. */
export function waitForTtq(timeoutMs = 2000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const ready = () => !!(window.ttq && typeof window.ttq.track === "function");
  if (ready()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const start = Date.now();
    const i = setInterval(() => {
      if (ready()) {
        clearInterval(i);
        resolve(true);
      } else if (Date.now() - start >= timeoutMs) {
        clearInterval(i);
        resolve(false);
      }
    }, 50);
  });
}

/** Wait for the TikTok `_ttp` cookie to be written. */
export function waitForTtp(timeoutMs = 1500): Promise<string> {
  if (typeof document === "undefined") return Promise.resolve("");
  const read = () => {
    const m = document.cookie.match(/(?:^|;\s*)_ttp=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  };
  return new Promise((resolve) => {
    const start = Date.now();
    const v = read();
    if (v) return resolve(v);
    const i = setInterval(() => {
      const cur = read();
      if (cur) { clearInterval(i); resolve(cur); }
      else if (Date.now() - start >= timeoutMs) { clearInterval(i); resolve(""); }
    }, 100);
  });
}
