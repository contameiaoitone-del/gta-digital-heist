ALTER TABLE public.module_categories ADD COLUMN IF NOT EXISTS product text;
UPDATE public.module_categories SET product = 'infozap' WHERE product IS NULL;
CREATE INDEX IF NOT EXISTS idx_module_categories_product ON public.module_categories(product);