
DROP POLICY IF EXISTS "Public can read pixel ids via view" ON public.tracking_pixels;

DROP VIEW IF EXISTS public.tracking_pixels_public;

-- SECURITY DEFINER view: runs as owner (bypasses RLS) but ONLY exposes non-sensitive columns.
CREATE VIEW public.tracking_pixels_public
WITH (security_invoker = false) AS
SELECT id, platform, pixel_id, active
FROM public.tracking_pixels
WHERE active = true;

GRANT SELECT ON public.tracking_pixels_public TO anon, authenticated;
