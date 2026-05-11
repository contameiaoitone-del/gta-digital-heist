
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS footer_gradient_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS footer_gradient_color text,
  ADD COLUMN IF NOT EXISTS category_color_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS category_color text,
  ADD COLUMN IF NOT EXISTS hero_title_html text,
  ADD COLUMN IF NOT EXISTS hero_description_html text;

UPDATE public.site_settings
SET footer_gradient_color = COALESCE(footer_gradient_color, '#a855f7'),
    category_color = COALESCE(category_color, '#a855f7')
WHERE id = 1;
