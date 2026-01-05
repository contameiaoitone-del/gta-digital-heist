// Session Cookie Key (SCK) tracking utilities
// Used to maintain user context through external checkout flows

const SCK_COOKIE_NAME = '_sck';
const SCK_STORAGE_KEY = 'visitor_sck';

/**
 * Initialize session tracking on app load
 */
export function initSessionTracking(): void {
  // Ensure SCK exists on first load
  getOrCreateSCK();
  console.log('[Session Tracking] Initialized');
}

/**
 * Generate a unique session cookie key
 */
function generateSCK(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}_${randomPart}`;
}

/**
 * Set a cookie with the given name, value, and expiration days
 */
function setCookie(name: string, value: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Get or create the Session Cookie Key
 * Checks cookie first, then localStorage, creates new if neither exists
 */
export function getOrCreateSCK(): string {
  // Try cookie first
  let sck = getCookie(SCK_COOKIE_NAME);
  
  // Try localStorage as fallback
  if (!sck) {
    try {
      sck = localStorage.getItem(SCK_STORAGE_KEY);
    } catch (e) {
      // localStorage might be blocked
    }
  }
  
  // Generate new SCK if none exists
  if (!sck) {
    sck = generateSCK();
  }
  
  // Always ensure both storage methods are updated
  setCookie(SCK_COOKIE_NAME, sck);
  try {
    localStorage.setItem(SCK_STORAGE_KEY, sck);
  } catch (e) {
    // localStorage might be blocked
  }
  
  return sck;
}

/**
 * Get the current SCK without creating a new one
 */
export function getSCK(): string | null {
  return getCookie(SCK_COOKIE_NAME) || localStorage.getItem(SCK_STORAGE_KEY);
}

/**
 * Append SCK parameter to a URL
 */
export function appendSCKToUrl(url: string): string {
  const sck = getOrCreateSCK();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}sck=${sck}`;
}

/**
 * Get Meta Pixel fbp cookie value
 * Checks cookie first, then localStorage as fallback
 */
export function getFbp(): string | null {
  // Try cookie first
  let fbp = getCookie('_fbp');
  
  // Try localStorage as fallback
  if (!fbp) {
    try {
      fbp = localStorage.getItem('_fbp');
    } catch (e) {}
  }
  
  return fbp;
}

/**
 * Get Meta Pixel fbc cookie value (click ID)
 */
export function getFbc(): string | null {
  // First check cookie
  let fbc = getCookie('_fbc');
  
  // If no cookie, check URL for fbclid and create fbc format
  if (!fbc && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      // Format: fb.1.timestamp.fbclid
      fbc = `fb.1.${Date.now()}.${fbclid}`;
      // Save it in a cookie for future use
      setCookie('_fbc', fbc, 90);
    }
  }
  
  return fbc;
}
