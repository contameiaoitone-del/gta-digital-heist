import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_media_url: string | null;
  hero_media_type: "image" | "video" | null;
  hero_title_html: string | null;
  hero_description_html: string | null;
  footer_gradient_enabled: boolean;
  footer_gradient_color: string | null;
  category_color_enabled: boolean;
  category_color: string | null;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  logo_url: null,
  primary_color: "#080808",
  secondary_color: "#00ff88",
  hero_title: "Treinamento de X1",
  hero_description:
    "O método completo para escalar produtos digitais no WhatsApp. Tráfego pago, criativos, copy, escala e os bastidores reais de quem fatura todo dia.",
  hero_media_url: "/membros-hero.mp4",
  hero_media_type: "video",
  hero_title_html: null,
  hero_description_html: null,
  footer_gradient_enabled: true,
  footer_gradient_color: "#a855f7",
  category_color_enabled: true,
  category_color: "#a855f7",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (cancelled) return;
      if (data) {
        setSettings({
          logo_url: data.logo_url ?? null,
          primary_color: data.primary_color ?? DEFAULT_SETTINGS.primary_color,
          secondary_color: data.secondary_color ?? DEFAULT_SETTINGS.secondary_color,
          hero_title: data.hero_title ?? DEFAULT_SETTINGS.hero_title,
          hero_description: data.hero_description ?? DEFAULT_SETTINGS.hero_description,
          hero_media_url: data.hero_media_url ?? DEFAULT_SETTINGS.hero_media_url,
          hero_media_type: (data.hero_media_type as "image" | "video" | null) ?? DEFAULT_SETTINGS.hero_media_type,
          hero_title_html: (data as any).hero_title_html ?? null,
          hero_description_html: (data as any).hero_description_html ?? null,
          footer_gradient_enabled: (data as any).footer_gradient_enabled ?? DEFAULT_SETTINGS.footer_gradient_enabled,
          footer_gradient_color: (data as any).footer_gradient_color ?? DEFAULT_SETTINGS.footer_gradient_color,
          category_color_enabled: (data as any).category_color_enabled ?? DEFAULT_SETTINGS.category_color_enabled,
          category_color: (data as any).category_color ?? DEFAULT_SETTINGS.category_color,
        });
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loaded };
}