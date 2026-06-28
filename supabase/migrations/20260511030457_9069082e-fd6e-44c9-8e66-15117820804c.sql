
CREATE TABLE public.tracking_pixels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('meta','tiktok')),
  pixel_id TEXT NOT NULL,
  access_token TEXT,
  label TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tracking_pixels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tracking pixels"
ON public.tracking_pixels FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER tracking_pixels_updated_at
BEFORE UPDATE ON public.tracking_pixels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public view exposing ONLY platform+pixel_id (no tokens) for client-side init
CREATE OR REPLACE VIEW public.tracking_pixels_public
WITH (security_invoker = true) AS
SELECT id, platform, pixel_id, active
FROM public.tracking_pixels
WHERE active = true;

GRANT SELECT ON public.tracking_pixels_public TO anon, authenticated;

-- The view inherits RLS from the base table via security_invoker, so we add a permissive
-- read policy that exposes only non-sensitive columns through the view (token excluded).
CREATE POLICY "Public can read pixel ids via view"
ON public.tracking_pixels FOR SELECT
USING (active = true);
