-- Master role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'master';

-- Member areas table (multi-tenant registry)
CREATE TABLE IF NOT EXISTS public.member_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  product text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.member_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view member areas"
  ON public.member_areas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage member areas"
  ON public.member_areas FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_member_areas_updated_at
  BEFORE UPDATE ON public.member_areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed existing product
INSERT INTO public.member_areas (slug, name, product)
VALUES ('infozap', 'InfoZap', 'infozap')
ON CONFLICT (product) DO NOTHING;

-- Backfill from existing modules so any product already in use becomes a registered area
INSERT INTO public.member_areas (slug, name, product)
SELECT DISTINCT m.product, initcap(m.product), m.product
FROM public.modules m
WHERE m.product IS NOT NULL
ON CONFLICT (product) DO NOTHING;