
CREATE TABLE IF NOT EXISTS public.module_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage categories" ON public.module_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members view categories" ON public.module_categories
  FOR SELECT USING (true);

CREATE TRIGGER update_module_categories_updated_at
  BEFORE UPDATE ON public.module_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS vturb_player_id text;
