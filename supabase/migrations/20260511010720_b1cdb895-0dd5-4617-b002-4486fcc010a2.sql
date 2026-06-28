ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS cta_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS cta_label text,
ADD COLUMN IF NOT EXISTS cta_url text;