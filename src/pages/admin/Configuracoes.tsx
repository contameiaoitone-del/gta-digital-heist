import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2, Copy, ExternalLink } from "lucide-react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/hooks/useSiteSettings";

interface ShareLink {
  id: string;
  token: string;
  label: string | null;
  expires_at: string | null;
  created_at: string;
}

type Unit = "seconds" | "minutes" | "hours" | "days";
const UNIT_SECONDS: Record<Unit, number> = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };

const Configuracoes = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [links, setLinks] = useState<ShareLink[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newExpType, setNewExpType] = useState<"never" | "duration">("never");
  const [newExpAmount, setNewExpAmount] = useState<number>(1);
  const [newExpUnit, setNewExpUnit] = useState<Unit>("hours");
  const [creatingLink, setCreatingLink] = useState(false);

  useEffect(() => {
    document.title = "Configurações — Admin";
    (async () => {
      const [sRes, lRes] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("share_links").select("*").order("created_at", { ascending: false }),
      ]);
      const s = sRes.data;
      // Pre-fill: prefer saved value, otherwise use the live defaults so the
      // form is never empty and a "Save" produces no visual change.
      setSettings({
        logo_url: s?.logo_url ?? null,
        primary_color: s?.primary_color ?? DEFAULT_SETTINGS.primary_color,
        secondary_color: s?.secondary_color ?? DEFAULT_SETTINGS.secondary_color,
        hero_title: s?.hero_title ?? DEFAULT_SETTINGS.hero_title,
        hero_description: s?.hero_description ?? DEFAULT_SETTINGS.hero_description,
        hero_media_url: s?.hero_media_url ?? DEFAULT_SETTINGS.hero_media_url,
        hero_media_type: (s?.hero_media_type as "image" | "video" | null) ?? DEFAULT_SETTINGS.hero_media_type,
      });
      setLinks((lRes.data as ShareLink[]) || []);
      setLoading(false);
    })();
  }, []);

  const uploadAsset = async (file: File): Promise<string | null> => {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { contentType: file.type || undefined });
    if (error) {
      toast.error(error.message);
      return null;
    }
    return supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl;
  };

  const onLogoChange = async (f: File | undefined) => {
    if (!f) return;
    const url = await uploadAsset(f);
    if (url) setSettings((s) => ({ ...s, logo_url: url }));
  };

  const onHeroMediaChange = async (f: File | undefined) => {
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const url = await uploadAsset(f);
    if (url) setSettings((s) => ({ ...s, hero_media_url: url, hero_media_type: isVideo ? "video" : "image" }));
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      logo_url: settings.logo_url,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      hero_title: settings.hero_title,
      hero_description: settings.hero_description,
      hero_media_url: settings.hero_media_url,
      hero_media_type: settings.hero_media_type,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Configurações salvas");
  };

  const createLink = async () => {
    setCreatingLink(true);
    const token = crypto.randomUUID().replace(/-/g, "");
    let expires_at: string | null = null;
    if (newExpType === "duration") {
      const amount = Math.max(1, Math.floor(Number(newExpAmount) || 0));
      expires_at = new Date(Date.now() + amount * UNIT_SECONDS[newExpUnit] * 1000).toISOString();
    }
    const { data, error } = await supabase.from("share_links").insert({
      token,
      label: newLabel.trim() || null,
      expires_at,
    }).select("*").single();
    setCreatingLink(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLinks([data as ShareLink, ...links]);
    setNewLabel("");
    setNewExpAmount(1);
    toast.success("Link criado");
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Excluir este link de acesso?")) return;
    const { error } = await supabase.from("share_links").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setLinks(links.filter((l) => l.id !== id));
  };

  const linkUrl = (token: string) => `${window.location.origin}/membros/share/${token}`;

  const copyLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl(token));
      toast.success("Link copiado");
    } catch {
      toast.error("Falha ao copiar");
    }
  };

  const inputCls = "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/admin" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            CONFIGURAÇÕES
          </h1>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-10">
        {/* PERSONALIZAÇÃO */}
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>Personalização</h2>
          <p className="text-xs text-gray-500 mb-5">As alterações só são aplicadas ao salvar. Os campos abaixo já vêm preenchidos com o que está em uso na área de membros.</p>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Logo */}
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2">Logo (canto superior esquerdo) — qualquer tamanho</label>
              <input type="file" accept="image/*" onChange={(e) => onLogoChange(e.target.files?.[0])} className="text-sm text-gray-300" />
              {settings.logo_url ? (
                <div className="mt-3 flex items-center gap-3">
                  <img src={settings.logo_url} alt="Logo" className="max-h-16 rounded" />
                  <button onClick={() => setSettings({ ...settings, logo_url: null })} className="text-xs text-gray-400 hover:text-[#ff2d78]">Remover</button>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2">Sem logo (não obrigatório).</p>
              )}
            </div>

            {/* Cores */}
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2">Cor primária (fundo)</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={settings.primary_color || "#080808"} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="h-10 w-14 rounded bg-transparent border border-white/15" />
                <input className={inputCls} value={settings.primary_color || ""} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} placeholder="#080808" />
              </div>
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2 mt-4">Cor secundária (botões)</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={settings.secondary_color || "#00ff88"} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="h-10 w-14 rounded bg-transparent border border-white/15" />
                <input className={inputCls} value={settings.secondary_color || ""} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} placeholder="#00ff88" />
              </div>
            </div>

            {/* Texto */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2">Título sob o banner</label>
              <input className={inputCls} value={settings.hero_title || ""} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} placeholder="Treinamento de X1" />
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2 mt-4">Descrição sob o banner</label>
              <textarea className={inputCls + " h-24 py-2"} value={settings.hero_description || ""} onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })} />
            </div>

            {/* Mídia do cabeçalho */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-300 uppercase tracking-wider block mb-2">Mídia do cabeçalho (imagem ou vídeo)</label>
              <input type="file" accept="image/*,video/*" onChange={(e) => onHeroMediaChange(e.target.files?.[0])} className="text-sm text-gray-300" />
              <p className="text-xs text-gray-500 mt-1">Recomendado: 1920×1080 (16:9). Aceita qualquer formato de imagem ou vídeo.</p>
              {settings.hero_media_url && (
                <div className="mt-3">
                  {settings.hero_media_type === "video" ? (
                    <video src={settings.hero_media_url} className="max-h-40 rounded" muted autoPlay loop playsInline />
                  ) : (
                    <img src={settings.hero_media_url} alt="Hero" className="max-h-40 rounded" />
                  )}
                  <button onClick={() => setSettings({ ...settings, hero_media_url: null })} className="text-xs text-gray-400 hover:text-[#ff2d78] mt-2">Remover</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={save} disabled={saving} className="px-5 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">
              {saving ? "Salvando..." : "Salvar configurações"}
            </button>
          </div>
        </section>

        {/* LINKS */}
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>Links de acesso (sem login)</h2>
          <p className="text-xs text-gray-500 mb-5">Compartilhe um link para visualização da área de membros. Quem acessar entrará automaticamente, sem precisar de login. Quando o link expira, a sessão é encerrada.</p>

          <div className="border border-white/10 rounded p-4 space-y-3 mb-5">
            <input className={inputCls} placeholder="Nome/identificação do link (opcional)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
            <div className="flex flex-wrap gap-2 items-center">
              <select className={inputCls + " max-w-[180px]"} value={newExpType} onChange={(e) => setNewExpType(e.target.value as "never" | "duration")}>
                <option value="never">Nunca expira</option>
                <option value="duration">Expira em…</option>
              </select>
              {newExpType === "duration" && (
                <>
                  <input type="number" min={1} className={inputCls + " max-w-[120px]"} value={newExpAmount} onChange={(e) => setNewExpAmount(Number(e.target.value) || 1)} />
                  <select className={inputCls + " max-w-[160px]"} value={newExpUnit} onChange={(e) => setNewExpUnit(e.target.value as Unit)}>
                    <option value="seconds">Segundos</option>
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                    <option value="days">Dias</option>
                  </select>
                </>
              )}
              <button onClick={createLink} disabled={creatingLink} className="ml-auto flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">
                <Plus className="h-4 w-4" /> Criar link
              </button>
            </div>
          </div>

          {links.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum link criado.</p>
          ) : (
            <ul className="space-y-2">
              {links.map((l) => {
                const url = linkUrl(l.token);
                const expired = l.expires_at && new Date(l.expires_at).getTime() < Date.now();
                return (
                  <li key={l.id} className="border border-white/10 rounded p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{l.label || "(sem nome)"}</p>
                        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-[#00ff88] hover:underline break-all">{url}</a>
                        <p className="text-xs text-gray-500 mt-1">
                          {l.expires_at ? (
                            expired ? <span className="text-[#ff2d78]">Expirado em {new Date(l.expires_at).toLocaleString()}</span>
                              : <>Expira em {new Date(l.expires_at).toLocaleString()}</>
                          ) : "Nunca expira"}
                        </p>
                      </div>
                      <button onClick={() => copyLink(l.token)} title="Copiar" className="p-2 text-gray-400 hover:text-white"><Copy className="h-4 w-4" /></button>
                      <a href={url} target="_blank" rel="noreferrer" title="Abrir" className="p-2 text-gray-400 hover:text-white"><ExternalLink className="h-4 w-4" /></a>
                      <button onClick={() => deleteLink(l.id)} title="Excluir" className="p-2 text-gray-400 hover:text-[#ff2d78]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Configuracoes;