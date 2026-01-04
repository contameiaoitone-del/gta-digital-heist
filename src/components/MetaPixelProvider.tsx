import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel } from '@/lib/metaPixel';
import { initSessionTracking } from '@/lib/sessionTracking';

// Pixel ID - this is a publishable ID (like a site ID), safe to include in frontend code
const META_PIXEL_ID = '1099498418563498';

// Pages that should NOT have tracking
const EXCLUDED_PATHS = ['/rp-close-sucesso'];

export const MetaPixelProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Meta Pixel once on app load
    initMetaPixel(META_PIXEL_ID);
    
    // Initialize session tracking (SCK)
    initSessionTracking();
  }, []);

  // Check if current path should be excluded from tracking
  const isExcluded = EXCLUDED_PATHS.includes(location.pathname);

  if (isExcluded) {
    console.log('[Meta Pixel] Tracking disabled for path:', location.pathname);
  }

  return <>{children}</>;
};

export default MetaPixelProvider;
