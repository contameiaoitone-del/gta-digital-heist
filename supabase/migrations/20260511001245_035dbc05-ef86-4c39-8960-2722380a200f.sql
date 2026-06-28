
DROP POLICY IF EXISTS "Members view published modules" ON public.modules;
CREATE POLICY "Members view published modules"
ON public.modules
FOR SELECT
USING (
  published = true
  AND (
    (kind = 'treinamento' AND has_active_access(auth.uid(), product))
    OR (kind = 'mentoria' AND auth.uid() IS NOT NULL)
  )
);
