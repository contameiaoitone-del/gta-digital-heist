import { useCallback } from 'react';
import { getCookie } from '@/lib/cookies';

export function useCheckoutUrl() {
  const getCheckoutUrl = useCallback((baseUrl: string): string => {
    try {
      const url = new URL(baseUrl);
      
      // Read SCK from cookie 'index' (saved by GTM)
      const sck = getCookie('index') || localStorage.getItem('index');
      if (sck) {
        url.searchParams.set('sck', sck);
      }
      
      // Read UTMs from cookies (saved by GTM)
      const utmSource = getCookie('cookieUtmSource');
      const utmMedium = getCookie('cookieUtmMedium');
      const utmCampaign = getCookie('cookieUtmCampaign');
      const utmContent = getCookie('cookieUtmContent');
      const utmTerm = getCookie('cookieUtmTerm');
      
      // Build 'src' parameter like GTM does (UTMs joined by |)
      const srcValues = [utmSource, utmMedium, utmCampaign, utmContent, utmTerm]
        .filter(Boolean)
        .join('|');
      
      if (srcValues) {
        url.searchParams.set('src', srcValues);
      }
      
      // Also add individual UTM params
      if (utmSource) url.searchParams.set('utm_source', utmSource);
      if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
      if (utmContent) url.searchParams.set('utm_content', utmContent);
      if (utmTerm) url.searchParams.set('utm_term', utmTerm);
      
      // Fallback: also check current URL params
      const currentParams = new URLSearchParams(window.location.search);
      const paramNames = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      
      paramNames.forEach(param => {
        const value = currentParams.get(param);
        if (value && !url.searchParams.has(param)) {
          url.searchParams.set(param, value);
        }
      });
      
      return url.toString();
    } catch (e) {
      console.warn('Error building checkout URL:', e);
      return baseUrl;
    }
  }, []);

  return { getCheckoutUrl };
}
