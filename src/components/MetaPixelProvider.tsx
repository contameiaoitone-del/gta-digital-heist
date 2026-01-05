import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pages that should NOT have tracking
const EXCLUDED_PATHS = ['/rp-close-sucesso'];

const SCK_COOKIE_NAME = '_sck';
const SCK_STORAGE_KEY = 'visitor_sck';

// Initialize SCK (Session Cookie Key) for visitor tracking
const initSCK = (): void => {
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
    // Initialize session tracking (SCK) - Pixel is already initialized in index.html
    initSCK();
  }, []);

  const isExcluded = EXCLUDED_PATHS.includes(location.pathname);

  if (isExcluded) {
    console.log('[Meta Pixel] Tracking disabled for path:', location.pathname);
  }

  return <>{children}</>;
};

export default MetaPixelProvider;
