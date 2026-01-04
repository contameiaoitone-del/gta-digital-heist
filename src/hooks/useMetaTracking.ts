import { useCallback } from 'react';
import { getFbp, getFbc, generateEventId, firePixelEvent } from '@/lib/metaPixel';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function sendServerEvent(payload: Record<string, any>): Promise<void> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/meta-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('[Meta CAPI] Server event failed:', error);
    } else {
      console.log('[Meta CAPI] Server event sent:', payload.event_name);
    }
  } catch (error) {
    console.error('[Meta CAPI] Error sending server event:', error);
  }
}

export function useMetaTracking() {
  const trackPageView = useCallback((contentName?: string) => {
    const eventId = generateEventId();
    const fbp = getFbp();
    const fbc = getFbc();
    
    // Fire browser event
    firePixelEvent('PageView', eventId);
    
    // Send server event
    sendServerEvent({
      event_name: 'PageView',
      event_id: eventId,
      event_source_url: window.location.href,
      fbp,
      fbc,
      content_name: contentName,
    });
  }, []);

  const trackViewContent = useCallback((params: {
    contentName: string;
    contentCategory?: string;
    contentIds?: string[];
    value?: number;
    currency?: string;
  }) => {
    const eventId = generateEventId();
    const fbp = getFbp();
    const fbc = getFbc();
    
    const pixelParams = {
      content_name: params.contentName,
      content_category: params.contentCategory,
      content_ids: params.contentIds,
      value: params.value,
      currency: params.currency || 'BRL',
    };
    
    // Fire browser event
    firePixelEvent('ViewContent', eventId, pixelParams);
    
    // Send server event
    sendServerEvent({
      event_name: 'ViewContent',
      event_id: eventId,
      event_source_url: window.location.href,
      fbp,
      fbc,
      ...params,
    });
  }, []);

  const trackInitiateCheckout = useCallback((params: {
    contentName: string;
    contentIds?: string[];
    value?: number;
    currency?: string;
  }) => {
    const eventId = generateEventId();
    const fbp = getFbp();
    const fbc = getFbc();
    
    const pixelParams = {
      content_name: params.contentName,
      content_ids: params.contentIds,
      value: params.value,
      currency: params.currency || 'BRL',
    };
    
    // Fire browser event
    firePixelEvent('InitiateCheckout', eventId, pixelParams);
    
    // Send server event
    sendServerEvent({
      event_name: 'InitiateCheckout',
      event_id: eventId,
      event_source_url: window.location.href,
      fbp,
      fbc,
      ...params,
    });
  }, []);

  const trackLead = useCallback((params: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    contentName?: string;
    value?: number;
  }) => {
    const eventId = generateEventId();
    const fbp = getFbp();
    const fbc = getFbc();
    
    // Fire browser event (without PII)
    firePixelEvent('Lead', eventId, {
      content_name: params.contentName,
      value: params.value,
      currency: 'BRL',
    });
    
    // Send server event (with hashed PII)
    sendServerEvent({
      event_name: 'Lead',
      event_id: eventId,
      event_source_url: window.location.href,
      fbp,
      fbc,
      email: params.email,
      phone: params.phone,
      first_name: params.firstName,
      last_name: params.lastName,
      content_name: params.contentName,
      value: params.value,
      currency: 'BRL',
    });
  }, []);

  return {
    trackPageView,
    trackViewContent,
    trackInitiateCheckout,
    trackLead,
  };
}
