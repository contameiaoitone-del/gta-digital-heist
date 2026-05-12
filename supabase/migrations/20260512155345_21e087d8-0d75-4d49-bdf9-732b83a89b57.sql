ALTER TABLE public.meta_capi_log ADD COLUMN IF NOT EXISTS page_source text;
CREATE INDEX IF NOT EXISTS meta_capi_log_page_source_idx ON public.meta_capi_log (page_source);