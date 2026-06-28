// UTM parameter handling and Meta Pixel tracking utilities

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/** Capture UTMs from URL and persist in sessionStorage */
export function captureUTMs(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  UTM_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utms[key] = value;
      sessionStorage.setItem(key, value);
    } else {
      const stored = sessionStorage.getItem(key);
      if (stored) utms[key] = stored;
    }
  });

  return utms;
}

/** Get stored UTMs */
export function getUTMs(): Record<string, string> {
  const utms: Record<string, string> = {};
  UTM_PARAMS.forEach((key) => {
    const v = sessionStorage.getItem(key);
    if (v) utms[key] = v;
  });
  return utms;
}

/** Append UTMs to any URL */
export function appendUTMs(url: string): string {
  const utms = getUTMs();
  if (Object.keys(utms).length === 0) return url;

  try {
    const u = new URL(url);
    Object.entries(utms).forEach(([k, v]) => {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    });
    return u.toString();
  } catch {
    // relative URL or invalid
    const separator = url.includes('?') ? '&' : '?';
    const qs = new URLSearchParams(utms).toString();
    return `${url}${separator}${qs}`;
  }
}

/** Track Meta Pixel event with UTM data */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  const utms = getUTMs();
  const eventParams = {
    ...params,
    ...utms,
    page_url: window.location.href,
    page_title: document.title,
  };

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventParams);
  }
}

/** Track custom Meta Pixel event */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  const utms = getUTMs();
  const eventParams = { ...params, ...utms };

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, eventParams);
  }
}
