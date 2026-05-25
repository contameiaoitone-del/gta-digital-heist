ALTER TABLE public.visitor_sessions ADD COLUMN IF NOT EXISTS pixel_id text;
ALTER TABLE public.meta_capi_log ADD COLUMN IF NOT EXISTS pixel_id text;
ALTER TABLE public.meta_capi_log ADD COLUMN IF NOT EXISTS pixel_label text;