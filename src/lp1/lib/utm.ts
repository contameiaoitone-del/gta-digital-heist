const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'utm_params';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/** Capture UTMs from URL and persist in sessionStorage */
export function captureUtmParams(): UtmParams {
  const url = new URL(window.location.href);
  const stored = getStoredUtmParams();
  let hasNew = false;

  const params: UtmParams = { ...stored };

  UTM_PARAMS.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) {
      params[key as keyof UtmParams] = value;
      hasNew = true;
    }
  });

  if (hasNew) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
  }

  return params;
}

/** Get stored UTM params */
export function getStoredUtmParams(): UtmParams {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Append UTM params to a URL string */
export function appendUtmToUrl(url: string): string {
  const utms = getStoredUtmParams();
  const hasUtms = Object.values(utms).some(Boolean);
  if (!hasUtms) return url;

  try {
    const urlObj = new URL(url);
    Object.entries(utms).forEach(([key, value]) => {
      if (value && !urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value);
      }
    });
    return urlObj.toString();
  } catch {
    // relative URL or invalid
    const separator = url.includes('?') ? '&' : '?';
    const queryString = Object.entries(utms)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&');
    return queryString ? `${url}${separator}${queryString}` : url;
  }
}

/** Fire Meta Pixel event with UTM data */
export function trackPixelEvent(eventName: string, data?: Record<string, unknown>) {
  const utms = getStoredUtmParams();
  const eventData = {
    ...data,
    ...utms,
  };

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
  }
}

/** Track page view with UTM context */
export function trackPageView() {
  const utms = getStoredUtmParams();
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (Object.values(utms).some(Boolean)) {
      (window as any).fbq('track', 'PageView', utms);
    } else {
      (window as any).fbq('track', 'PageView');
    }
  }
}
