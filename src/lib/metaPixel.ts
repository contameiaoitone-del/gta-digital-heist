// Meta Pixel loader — loads only on demand (e.g., /infozap routes).
// Pixel ID is public information (visible in any site that uses Meta Pixel).
export const META_PIXEL_ID = "1533634077714814";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

let injected = false;

/** Idempotently inject the Meta Pixel base snippet and init the given pixel id. */
export function ensurePixel(pixelId: string = META_PIXEL_ID): void {
  if (typeof window === "undefined") return;
  if (injected || window.fbq) {
    if (!injected) injected = true;
    return;
  }
  injected = true;

  // Official Meta Pixel base code, ported to TS.
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", pixelId);

  // <noscript> fallback (only added once)
  try {
    const noscript = document.createElement("noscript");
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  } catch {
    /* noop */
  }
}

/** Wait for window.fbq to be available, up to `timeoutMs`. Resolves true if ready. */
export function waitForFbq(timeoutMs = 2000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (typeof window.fbq === "function") return Promise.resolve(true);
  return new Promise((resolve) => {
    const start = Date.now();
    const i = setInterval(() => {
      if (typeof window.fbq === "function") {
        clearInterval(i);
        resolve(true);
      } else if (Date.now() - start >= timeoutMs) {
        clearInterval(i);
        resolve(false);
      }
    }, 50);
  });
}
