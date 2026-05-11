
-- 1. Add kind and price columns to modules
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'treinamento',
  ADD COLUMN IF NOT EXISTS price_cents integer;

-- 2. Trigger to validate kind and price
CREATE OR REPLACE FUNCTION public.validate_module_kind_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.kind NOT IN ('treinamento', 'mentoria') THEN
    RAISE EXCEPTION 'kind must be treinamento or mentoria';
  END IF;
  IF NEW.kind = 'mentoria' AND (NEW.price_cents IS NULL OR NEW.price_cents <= 0) THEN
    RAISE EXCEPTION 'mentoria modules require a positive price_cents';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS modules_validate_kind_price ON public.modules;
CREATE TRIGGER modules_validate_kind_price
BEFORE INSERT OR UPDATE ON public.modules
FOR EACH ROW EXECUTE FUNCTION public.validate_module_kind_price();

-- 3. Update RLS policies for modules and lessons to honor mentoria
DROP POLICY IF EXISTS "Members view published modules" ON public.modules;
CREATE POLICY "Members view published modules"
ON public.modules
FOR SELECT
USING (
  published = true
  AND (
    (kind = 'treinamento' AND has_active_access(auth.uid(), product))
    OR (kind = 'mentoria' AND (
         has_active_access(auth.uid(), 'mentoria')
         OR has_active_access(auth.uid(), 'mentoria:' || id::text)
       ))
  )
);

DROP POLICY IF EXISTS "Members view published lessons" ON public.lessons;
CREATE POLICY "Members view published lessons"
ON public.lessons
FOR SELECT
USING (
  published = true
  AND EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = lessons.module_id
      AND m.published = true
      AND (
        (m.kind = 'treinamento' AND has_active_access(auth.uid(), m.product))
        OR (m.kind = 'mentoria' AND (
             has_active_access(auth.uid(), 'mentoria')
             OR has_active_access(auth.uid(), 'mentoria:' || m.id::text)
           ))
      )
  )
);
