import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2, CheckCircle2, XCircle, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";

type Platform = "meta" | "tiktok";

interface Pixel {
  id: string;
  platform: Platform;
  pixel_id: string;
  access_token: string | null;
  label: string | null;
  active: boolean;
  created_at: string;
}

interface CapiLogRow {
  id: string;
  created_at: string;
  event_name: string;
  event_id: string | null;
  order_id: string | null;
  session_id: string | null;
  value: number | null;
  status_code: number | null;
  success: boolean;
  error: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border border-white/10 rounded-lg">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition">
        <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>{title}</h2>
        {open ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
      </button>
      <div className={open ? "p-5 pt-0" : "hidden"}>{children}</div>
    </section>
  );
}

const inputCls = "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

function PixelManager({ platform, title, idPlaceholder, tokenPlaceholder }: {
  platform: Platform;
  title: string;
  idPlaceholder: string;
  tokenPlaceholder: string;
}) {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pixelId, setPixelId] = useState("");
  const [token, setToken] = useState("");
  const [label, setLabel] = useState("");
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tracking_pixels")
      .select("*")
      .eq("platform", platform)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPixels((data as Pixel[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const add = async () => {
    const pid = pixelId.trim();
    if (!pid) { toast.error("Informe o Pixel ID"); return; }
    setBusy(true);
    const { error } = await supabase.from("tracking_pixels").insert({
      platform, pixel_id: pid, access_token: token.trim() || null, label: label.trim() || null, active: true,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setPixelId(""); setToken(""); setLabel("");
    toast.success("Pixel cadastrado");
    load();
  };

  const toggleActive = async (p: Pixel) => {
    const { error } = await supabase.from("tracking_pixels").update({ active: !p.active }).eq("id", p.id);
    if (error) toast.error(error.message);
    else load();
  };

  const remove = async (p: Pixel) => {
    if (!confirm("Excluir este pixel?")) return;
    const { error } = await supabase.from("tracking_pixels").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else load();
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">Cadastre um ou mais pixels {title}. Todos os pixels ativos disparam eventos client-side e via API de conversões (CAPI).</p>

      <div className="border border-white/10 rounded p-4 space-y-2 mb-5">
        <div className="grid md:grid-cols-2 gap-2">
          <input className={inputCls} placeholder={idPlaceholder} value={pixelId} onChange={(e) => setPixelId(e.target.value)} />
          <input className={inputCls} placeholder="Identificação (opcional)" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <input className={inputCls} placeholder={tokenPlaceholder} value={token} onChange={(e) => setToken(e.target.value)} />
        <div className="flex justify-end">
          <button onClick={add} disabled={busy} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">
            <Plus className="h-4 w-4" /> Adicionar pixel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : pixels.length === 0 ? (
        <p className="text-xs text-gray-500">Nenhum pixel cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {pixels.map((p) => (
            <li key={p.id} className="border border-white/10 rounded p-3">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{p.label || "(sem nome)"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.active ? "bg-[#00ff88]/20 text-[#00ff88]" : "bg-white/10 text-gray-400"}`}>
                      {p.active ? "ATIVO" : "INATIVO"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Pixel ID: <span className="font-mono">{p.pixel_id}</span></p>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <span>Access Token:</span>
                    {p.access_token ? (
                      <>
                        <span className="font-mono break-all">
                          {reveal[p.id] ? p.access_token : "•".repeat(Math.min(24, p.access_token.length))}
                        </span>
                        <button onClick={() => setReveal((r) => ({ ...r, [p.id]: !r[p.id] }))} className="text-gray-400 hover:text-white">
                          {reveal[p.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </>
                    ) : <span className="italic text-gray-500">não informado</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(p)} className="text-xs px-2 py-1 rounded border border-white/15 text-gray-300 hover:text-white">
                    {p.active ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => remove(p)} title="Excluir" className="p-2 text-gray-400 hover:text-[#ff2d78]"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CapiLogBody() {
  const [rows, setRows] = useState<CapiLogRow[]>([]);
  const [filter, setFilter] = useState<"all" | "Purchase" | "InitiateCheckout" | "PageView">("Purchase");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      let q = supabase.from("meta_capi_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter !== "all") q = q.eq("event_name", filter);
      const { data } = await q;
      if (!cancelled) {
        setRows((data as CapiLogRow[]) || []);
        setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) =>
      [r.session_id, r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.utm_term, r.order_id, r.event_id]
        .some((v) => (v || "").toLowerCase().includes(s)),
    );
  }, [rows, search]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {(["Purchase", "InitiateCheckout", "PageView", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider ${filter === f ? "bg-[#00ff88] text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
            {f}
          </button>
        ))}
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por SCK, UTM, order_id, event_id..."
          className="ml-auto px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs w-72 placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88]" />
      </div>
      {busy ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Sem registros.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-white/10">
          <table className="w-full text-xs">
            <thead className="bg-white/5 text-left uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-3 py-2">Quando</th>
                <th className="px-3 py-2">Evento</th>
                <th className="px-3 py-2">OK</th>
                <th className="px-3 py-2">HTTP</th>
                <th className="px-3 py-2">Valor</th>
                <th className="px-3 py-2">SCK</th>
                <th className="px-3 py-2">utm_source</th>
                <th className="px-3 py-2">utm_campaign</th>
                <th className="px-3 py-2">utm_content</th>
                <th className="px-3 py-2">event_id</th>
                <th className="px-3 py-2">order_id</th>
                <th className="px-3 py-2">Erro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const utmTooltip = [
                  r.utm_source && `source: ${r.utm_source}`,
                  r.utm_medium && `medium: ${r.utm_medium}`,
                  r.utm_campaign && `campaign: ${r.utm_campaign}`,
                  r.utm_content && `content: ${r.utm_content}`,
                  r.utm_term && `term: ${r.utm_term}`,
                ].filter(Boolean).join("\n");
                return (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2">{r.event_name}</td>
                    <td className="px-3 py-2">
                      {r.success ? <CheckCircle2 className="h-4 w-4 text-[#00ff88]" /> : <XCircle className="h-4 w-4 text-[#ff2d78]" />}
                    </td>
                    <td className="px-3 py-2">{r.status_code ?? "-"}</td>
                    <td className="px-3 py-2">{r.value != null ? `R$ ${Number(r.value).toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-gray-400" title={r.session_id || ""}>{r.session_id?.slice(0, 8) || "-"}</td>
                    <td className="px-3 py-2 text-gray-300" title={utmTooltip}>{r.utm_source || "-"}</td>
                    <td className="px-3 py-2 text-gray-300 max-w-[160px] truncate" title={utmTooltip}>{r.utm_campaign || "-"}</td>
                    <td className="px-3 py-2 text-gray-300 max-w-[160px] truncate" title={utmTooltip}>{r.utm_content || "-"}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-gray-400" title={r.event_id || ""}>{r.event_id?.slice(0, 8) || "-"}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-gray-400" title={r.order_id || ""}>{r.order_id?.slice(0, 8) || "-"}</td>
                    <td className="px-3 py-2 text-[#ff2d78] max-w-xs truncate" title={r.error || ""}>{r.error || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Trackeamento = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();

  useEffect(() => { document.title = "Trackeamento — Admin"; }, []);

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to="/membros" replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/admin" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            TRACKEAMENTO
          </h1>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-4">
        <Section title="Pixel Facebook (Meta)" defaultOpen>
          <PixelManager
            platform="meta"
            title="do Facebook"
            idPlaceholder="Pixel ID (ex.: 1533634077714814)"
            tokenPlaceholder="Access Token (CAPI)"
          />
        </Section>

        <Section title="Pixel TikTok">
          <PixelManager
            platform="tiktok"
            title="do TikTok"
            idPlaceholder="Pixel ID (ex.: D4S41KRC77UELK0GVVS0)"
            tokenPlaceholder="Access Token (Events API)"
          />
        </Section>

        <Section title="CAPI Log (Eventos enviados ao Meta)">
          <CapiLogBody />
        </Section>
      </div>
    </div>
  );
};

export default Trackeamento;