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

// Fire browser pixel event
export function firePixelEvent(
  eventName: string, 
  eventId: string, 
  params?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params || {}, { eventID: eventId });
    console.log(`[Meta Pixel] Browser event fired: ${eventName}`, { eventId, params });
  } else {
    console.warn('[Meta Pixel] fbq not available');
  }
}
