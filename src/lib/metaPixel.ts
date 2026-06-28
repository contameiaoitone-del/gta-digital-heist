// Meta Pixel loader — loads only on demand (e.g., /infozap routes).
// IMPORTANT: no hardcoded pixel ID. Callers MUST pass the pixel ID from the
// admin-managed `tracking_pixels` table (RPC `get_active_tracking_pixels`).
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

let snippetInjected = false;
let noscriptInjected = false;
const initedPixels = new Set<string>();

/** Idempotently inject the Meta Pixel base snippet and init the given pixel id. */
export function ensurePixel(pixelId?: string): void {
  if (typeof window === "undefined") return;
  if (!pixelId) {
    console.warn("[pixel] ensurePixel called without pixelId — skipping (no fallback)");
    return;
  }

  if (!snippetInjected && !window.fbq) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
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
    snippetInjected = true;
  } else {
    snippetInjected = true;
  }

  if (!initedPixels.has(pixelId)) {
    try {
      window.fbq?.("init", pixelId);
      initedPixels.add(pixelId);
    } catch (e) {
      console.warn("[pixel] init failed", e);
    }
  }

  if (!noscriptInjected) {
    try {
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
      noscriptInjected = true;
    } catch {
      /* noop */
    }
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
