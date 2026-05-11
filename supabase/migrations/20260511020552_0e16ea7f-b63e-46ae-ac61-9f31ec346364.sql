
-- 1) New columns on lessons & modules
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS release_days INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS release_days INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_mode TEXT NOT NULL DEFAULT 'video' CHECK (content_mode IN ('video','text'));
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS header_image_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS text_content TEXT;

-- 2) lesson_ctas
CREATE TABLE IF NOT EXISTS public.lesson_ctas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_ctas_lesson ON public.lesson_ctas(lesson_id, position);
ALTER TABLE public.lesson_ctas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lesson_ctas" ON public.lesson_ctas
  FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Members view lesson_ctas of visible lessons" ON public.lesson_ctas
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_ctas.lesson_id));

-- Migrate existing single CTA into table
INSERT INTO public.lesson_ctas (lesson_id, label, url, position)
SELECT id, COALESCE(NULLIF(cta_label,''),'Acessar'), cta_url, 0
FROM public.lessons
WHERE cta_enabled = true AND cta_url IS NOT NULL AND cta_url <> '';

-- 3) lesson_attachments
CREATE TABLE IF NOT EXISTS public.lesson_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  size_bytes BIGINT,
  mime TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_attachments_lesson ON public.lesson_attachments(lesson_id, position);
ALTER TABLE public.lesson_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lesson_attachments" ON public.lesson_attachments
  FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Members view lesson_attachments of visible lessons" ON public.lesson_attachments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_attachments.lesson_id));

-- 4) Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-attachments','lesson-attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read lesson-attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'lesson-attachments');
CREATE POLICY "Admins write lesson-attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'lesson-attachments' AND has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins update lesson-attachments" ON storage.objects
  FOR UPDATE USING (bucket_id = 'lesson-attachments' AND has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins delete lesson-attachments" ON storage.objects
  FOR DELETE USING (bucket_id = 'lesson-attachments' AND has_role(auth.uid(),'admin'::app_role));

-- 5) Drip helper function
CREATE OR REPLACE FUNCTION public.is_drip_unlocked(_user_id UUID, _product TEXT, _release_days INTEGER)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _release_days IS NULL OR _release_days <= 0 THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.member_access
      WHERE user_id = _user_id
        AND product = _product
        AND active = true
        AND now() >= granted_at + (_release_days || ' days')::interval
    )
  END
$$;

-- 6) Update lessons & modules SELECT policies to include drip check
DROP POLICY IF EXISTS "Members view visible lessons" ON public.lessons;
CREATE POLICY "Members view visible lessons" ON public.lessons
FOR SELECT USING (
  (status = ANY (ARRAY['published','coming_soon'])) AND EXISTS (
    SELECT 1 FROM modules m
    WHERE m.id = lessons.module_id
      AND m.status = ANY (ARRAY['published','coming_soon'])
      AND (
        (m.kind = 'treinamento' AND (
          lessons.status = 'coming_soon'
          OR (has_active_access(auth.uid(), m.product)
              AND public.is_drip_unlocked(auth.uid(), m.product, GREATEST(COALESCE(m.release_days,0), COALESCE(lessons.release_days,0))))
        ))
        OR
        (m.kind = 'mentoria' AND (
          lessons.status = 'coming_soon'
          OR has_active_access(auth.uid(), 'mentoria')
          OR has_active_access(auth.uid(), 'mentoria:' || m.id::text)
        ))
      )
  )
);

DROP POLICY IF EXISTS "Members view visible modules" ON public.modules;
CREATE POLICY "Members view visible modules" ON public.modules
FOR SELECT USING (
  (status = ANY (ARRAY['published','coming_soon'])) AND (
    (kind = 'treinamento' AND (
      status = 'coming_soon'
      OR has_active_access(auth.uid(), product)
    ))
    OR
    (kind = 'mentoria' AND auth.uid() IS NOT NULL)
  )
);
