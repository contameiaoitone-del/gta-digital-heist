
CREATE OR REPLACE FUNCTION public.get_lesson_module_meta(_lesson_id uuid)
RETURNS TABLE(
  lesson_id uuid,
  lesson_title text,
  module_id uuid,
  module_title text,
  module_kind text,
  module_price_cents integer,
  module_published boolean,
  lesson_published boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, l.title, m.id, m.title, m.kind, m.price_cents, m.published, l.published
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  WHERE l.id = _lesson_id
$$;

REVOKE ALL ON FUNCTION public.get_lesson_module_meta(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_lesson_module_meta(uuid) TO authenticated;
