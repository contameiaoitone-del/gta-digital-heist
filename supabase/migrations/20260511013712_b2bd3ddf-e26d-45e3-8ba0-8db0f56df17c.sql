
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'hidden'
  CHECK (status IN ('hidden','published','coming_soon'));

UPDATE public.modules SET status = CASE WHEN published THEN 'published' ELSE 'hidden' END;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'hidden'
  CHECK (status IN ('hidden','published','coming_soon'));

UPDATE public.lessons SET status = CASE WHEN published THEN 'published' ELSE 'hidden' END;

DROP POLICY IF EXISTS "Members view published modules" ON public.modules;
CREATE POLICY "Members view visible modules"
ON public.modules
FOR SELECT
USING (
  status IN ('published','coming_soon')
  AND (
    (kind = 'treinamento' AND (status = 'coming_soon' OR has_active_access(auth.uid(), product)))
    OR (kind = 'mentoria' AND auth.uid() IS NOT NULL)
  )
);

DROP POLICY IF EXISTS "Members view published lessons" ON public.lessons;
CREATE POLICY "Members view visible lessons"
ON public.lessons
FOR SELECT
USING (
  status IN ('published','coming_soon')
  AND EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = lessons.module_id
      AND m.status IN ('published','coming_soon')
      AND (
        (m.kind = 'treinamento' AND (lessons.status = 'coming_soon' OR has_active_access(auth.uid(), m.product)))
        OR (m.kind = 'mentoria' AND (
              lessons.status = 'coming_soon'
              OR has_active_access(auth.uid(), 'mentoria')
              OR has_active_access(auth.uid(), 'mentoria:' || m.id::text)
           ))
      )
  )
);
