// Meta Pixel utility functions for client-side tracking

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Initialize Meta Pixel - should be called once at app startup
export const initMetaPixel = (pixelId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Don't initialize twice
  if (window.fbq) return;

  // Meta Pixel base code
  (function(f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize with pixel ID
  window.fbq('init', pixelId);
  
  console.log('[Meta Pixel] Initialized with ID:', pixelId);
};

// Get _fbp cookie (Meta Pixel browser ID)
export function getFbp(): string | null {
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : null;
}

// Get _fbc cookie (Meta click ID from URL parameter)
export function getFbc(): string | null {
  const match = document.cookie.match(/_fbc=([^;]+)/);
  if (match) return match[1];
  
  // If not in cookie, try to get from URL
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  if (fbclid) {
    // Format: fb.1.timestamp.fbclid
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  
  return null;
}

// Generate unique event ID for deduplication
export function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Fire browser pixel event with retry logic
export function firePixelEvent(
  eventName: string, 
  eventId: string, 
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  const tryFire = (attempts = 0): void => {
    if (window.fbq) {
      window.fbq('track', eventName, params || {}, { eventID: eventId });
      console.log(`[Meta Pixel] Browser event fired: ${eventName}`, { eventId, params });
    } else if (attempts < 20) {
      // Retry every 100ms for up to 2 seconds
      setTimeout(() => tryFire(attempts + 1), 100);
    } else {
      console.warn('[Meta Pixel] fbq not available after waiting');
    }
  };

  tryFire();
}
