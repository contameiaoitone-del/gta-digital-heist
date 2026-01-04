import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pixel ID - this is a publishable ID (like a site ID), safe to include in frontend code
const META_PIXEL_ID = '1099498418563498';

// Pages that should NOT have tracking
const EXCLUDED_PATHS = ['/rp-close-sucesso'];

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Initialize Meta Pixel inline
const initPixel = (pixelId: string): void => {
  if (typeof window === 'undefined') return;
  if (window.fbq) return;

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

  window.fbq('init', pixelId);
  console.log('[Meta Pixel] Initialized with ID:', pixelId);
};

// Initialize SCK inline
const initSCK = (): void => {
  const SCK_COOKIE_NAME = '_sck';
  const SCK_STORAGE_KEY = 'visitor_sck';
  
  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  };

  const setCookie = (name: string, value: string, days: number = 365): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  let sck = getCookie(SCK_COOKIE_NAME);
  
  if (!sck) {
    try {
      sck = localStorage.getItem(SCK_STORAGE_KEY);
    } catch (e) {}
  }
  
  if (!sck) {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    sck = `${timestamp}_${randomPart}`;
  }
  
  setCookie(SCK_COOKIE_NAME, sck);
  try {
    localStorage.setItem(SCK_STORAGE_KEY, sck);
  } catch (e) {}
  
  console.log('[Session Tracking] Initialized with SCK:', sck);
};

export const MetaPixelProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    initPixel(META_PIXEL_ID);
    initSCK();
  }, []);

  const isExcluded = EXCLUDED_PATHS.includes(location.pathname);

  if (isExcluded) {
    console.log('[Meta Pixel] Tracking disabled for path:', location.pathname);
  }

  return <>{children}</>;
};

export default MetaPixelProvider;
