
DROP VIEW IF EXISTS public.tracking_pixels_public;

CREATE OR REPLACE FUNCTION public.get_active_tracking_pixels()
RETURNS TABLE (id uuid, platform text, pixel_id text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, platform, pixel_id FROM public.tracking_pixels WHERE active = true
$$;

GRANT EXECUTE ON FUNCTION public.get_active_tracking_pixels() TO anon, authenticated;
