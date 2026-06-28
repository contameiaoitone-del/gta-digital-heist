import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2, CheckCircle2, XCircle, ChevronDown, ChevronRight, Eye, EyeOff, Pencil, Save, X, CalendarIcon, RefreshCw, Send } from "lucide-react";
import { ManualFireModal } from "./CapiLog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

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
  page_source: string | null;
  pixel_id: string | null;
  pixel_label: string | null;
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
  const [editing, setEditing] = useState<string | null>(null);
  const [editPixelId, setEditPixelId] = useState("");
  const [editToken, setEditToken] = useState("");
  const [editLabel, setEditLabel] = useState("");

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
    return (data as Pixel[]) || [];
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

  const startEdit = (p: Pixel) => {
    setEditing(p.id);
    setEditPixelId(p.pixel_id);
    setEditToken(p.access_token || "");
    setEditLabel(p.label || "");
  };
  const cancelEdit = () => { setEditing(null); };
  const saveEdit = async (p: Pixel) => {
    const pid = editPixelId.trim();
    if (!pid) { toast.error("Informe o Pixel ID"); return; }
    const { error } = await supabase.from("tracking_pixels").update({
      pixel_id: pid,
      access_token: editToken.trim() || null,
      label: editLabel.trim() || null,
    }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Pixel atualizado");
    setEditing(null);
    load();
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
              {editing === p.id ? (
                <div className="space-y-2">
                  <div className="grid md:grid-cols-2 gap-2">
                    <input className={inputCls} placeholder={idPlaceholder} value={editPixelId} onChange={(e) => setEditPixelId(e.target.value)} />
                    <input className={inputCls} placeholder="Identificação (opcional)" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
                  </div>
                  <input className={inputCls} placeholder={tokenPlaceholder} value={editToken} onChange={(e) => setEditToken(e.target.value)} />
                  <div className="flex justify-end gap-2">
                    <button onClick={cancelEdit} className="flex items-center gap-1 px-3 py-2 border border-white/15 text-gray-300 rounded text-sm hover:text-white">
                      <X className="h-4 w-4" /> Cancelar
                    </button>
                    <button onClick={() => saveEdit(p)} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">
                      <Save className="h-4 w-4" /> Salvar
                    </button>
                  </div>
                </div>
              ) : (
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
                  <button onClick={() => startEdit(p)} title="Editar" className="text-xs px-2 py-1 rounded border border-white/15 text-gray-300 hover:text-white inline-flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button onClick={() => remove(p)} title="Excluir" className="p-2 text-gray-400 hover:text-[#ff2d78]"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------- CAPI Log (dashboard + lista detalhada) ----------------

const CAPI_EVENT_OPTIONS = ["Purchase", "Lead", "InitiateCheckout", "PageView"] as const;
const CAPI_PAGE_OPTIONS = ["LP1", "LP2", "LP97-VSL", "LP2-97", "LP2-5", "MENTORIA", "MANUAL"] as const;
const PERIOD_OPTIONS = [
  { key: "hoje", label: "Hoje" },
  { key: "ontem", label: "Ontem" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "custom", label: "Personalizado" },
] as const;
type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];
const CAPI_FILTERS_KEY = "admin.trackeamento.capiFilters.v3";

type CapiFilters = { events: string[]; pages: string[]; period: PeriodKey; search: string };
function loadCapiFilters(): CapiFilters {
  const fb: CapiFilters = { events: [], pages: [], period: "30d", search: "" };
  try {
    const raw = localStorage.getItem(CAPI_FILTERS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        events: Array.isArray(p.events) ? p.events : [],
        pages: Array.isArray(p.pages) ? p.pages : [],
        period: PERIOD_OPTIONS.some((o) => o.key === p.period) ? p.period : "30d",
        search: typeof p.search === "string" ? p.search : "",
      };
    }
  } catch {}
  return fb;
}

interface RankItem { label: string; n: number }
interface Stats {
  sales_count: number;
  revenue: number;
  leads_count: number;
  checkout_count: number;
  top_content_sales: RankItem[];
  top_campaign_sales: RankItem[];
  top_content_leads: RankItem[];
  top_campaign_leads: RankItem[];
}
const EMPTY_STATS: Stats = {
  sales_count: 0, revenue: 0, leads_count: 0, checkout_count: 0,
  top_content_sales: [], top_campaign_sales: [], top_content_leads: [], top_campaign_leads: [],
};

interface StatRow { event_id: string | null; event_name: string; success: boolean; value: number | null; utm_content: string | null; utm_campaign: string | null }

// Conta vendas/leads por event_id DISTINTO (vários pixels gravam o mesmo evento)
// e rankeia UTM_CONTENT / UTM_CAMPAIGN — tudo no cliente, sem depender de RPC.
function aggregate(rows: StatRow[]): Stats {
  const seen = new Map<string, StatRow>();
  for (const r of rows) {
    if (!r.event_id) continue;
    const k = `${r.event_id}|${r.event_name}`;
    const prev = seen.get(k);
    if (!prev || (!prev.success && r.success)) seen.set(k, r);
  }
  const dedup = [...seen.values()];
  const purch = dedup.filter((r) => r.event_name === "Purchase" && r.success);
  const leads = dedup.filter((r) => r.event_name === "Lead" && r.success);
  const checkouts = dedup.filter((r) => r.event_name === "InitiateCheckout" && r.success);
  const top = (arr: StatRow[], key: "utm_content" | "utm_campaign", fallback: string): RankItem[] => {
    const m = new Map<string, number>();
    for (const r of arr) {
      const lbl = (r[key] || "").trim() || fallback;
      m.set(lbl, (m.get(lbl) || 0) + 1);
    }
    return [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n).slice(0, 8);
  };
  return {
    sales_count: purch.length,
    revenue: purch.reduce((s, r) => s + (Number(r.value) || 0), 0),
    leads_count: leads.length,
    checkout_count: checkouts.length,
    top_content_sales: top(purch, "utm_content", "(sem utm_content)"),
    top_campaign_sales: top(purch, "utm_campaign", "(direct)"),
    top_content_leads: top(leads, "utm_content", "(sem utm_content)"),
    top_campaign_leads: top(leads, "utm_campaign", "(direct)"),
  };
}

function Chip({ label, active, onClick, accent }: { label: string; active: boolean; onClick: () => void; accent: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] px-2.5 py-1 rounded-md border transition"
      style={active
        ? { background: accent, color: "#000", borderColor: accent, fontWeight: 600 }
        : { background: "#17171c", color: "#8a8a92", borderColor: "#26262d" }}
    >
      {active ? "✓ " : ""}{label}
    </button>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-[#141417] rounded-lg p-3">
      <div className="text-[11px] text-gray-400">{label}</div>
      <div className="text-2xl font-semibold" style={{ color: accent || "#fff" }}>{value}</div>
    </div>
  );
}

function RankingPanel({ title, subtitle, items, color }: { title: string; subtitle: string; items: RankItem[]; color: string }) {
  const max = Math.max(1, ...items.map((i) => i.n));
  return (
    <div className="bg-[#141417] rounded-lg p-3.5">
      <div className="text-xs font-semibold text-white mb-2.5">
        {title} <span className="text-gray-500 font-normal">· {subtitle}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-gray-600">Sem dados no período.</p>
      ) : (
        <div className="flex flex-col gap-2 text-xs">
          {items.map((it, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-gray-300">
                <span className="truncate max-w-[180px]" title={it.label}>{it.label}</span>
                <b>{it.n}</b>
              </div>
              <div className="h-[5px] rounded mt-1" style={{ background: color, width: `${Math.round((it.n / max) * 100)}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CapiLogBody() {
  const [rows, setRows] = useState<CapiLogRow[]>([]);
  const [payMethods, setPayMethods] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const initial = useRef<CapiFilters>(loadCapiFilters());
  const [events, setEvents] = useState<string[]>(initial.current.events);
  const [pages, setPages] = useState<string[]>(initial.current.pages);
  const [period, setPeriod] = useState<PeriodKey>(initial.current.period);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [search, setSearch] = useState<string>(initial.current.search);
  const [busy, setBusy] = useState(true);
  const [statsBusy, setStatsBusy] = useState(true);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualInitial, setManualInitial] = useState<{ eventName?: string; value?: number | null; orderId?: string | null } | undefined>();
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(CAPI_FILTERS_KEY, JSON.stringify({ events, pages, period, search })); } catch {}
  }, [events, pages, period, search]);

  const dateBounds = useMemo(() => {
    const now = new Date();
    const sod = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
    if (period === "hoje") { const s = sod(now); const e = new Date(s); e.setDate(e.getDate() + 1); return { from: s, to: e }; }
    if (period === "ontem") { const s = sod(now); s.setDate(s.getDate() - 1); const e = new Date(s); e.setDate(e.getDate() + 1); return { from: s, to: e }; }
    if (period === "7d") { const f = new Date(now); f.setDate(f.getDate() - 7); return { from: f, to: now }; }
    if (period === "custom" && customRange?.from) {
      const s = sod(customRange.from);
      const eb = customRange.to ? new Date(customRange.to) : new Date(customRange.from);
      const e = new Date(eb.getFullYear(), eb.getMonth(), eb.getDate() + 1);
      return { from: s, to: e };
    }
    // default / "30d"
    const f = new Date(now); f.setDate(f.getDate() - 30); return { from: f, to: now };
  }, [period, customRange]);

  const toggle = (list: string[], setList: (v: string[]) => void, opt: string) =>
    setList(list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]);

  // Lista detalhada (respeita filtros de inclusão + período)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      let q = supabase
        .from("meta_capi_log")
        .select("*")
        .gte("created_at", dateBounds.from.toISOString())
        .lt("created_at", dateBounds.to.toISOString())
        .order("created_at", { ascending: false })
        .limit(300);
      if (events.length > 0) q = q.in("event_name", events);
      if (pages.length > 0) q = q.in("page_source", pages);
      const { data } = await q;
      if (cancelled) return;
      const list = (data as CapiLogRow[]) || [];
      setRows(list);
      const ids = Array.from(new Set(list.map((r) => r.order_id).filter((v): v is string => !!v)));
      if (ids.length > 0) {
        const { data: ords } = await supabase.from("orders").select("id,payment_method").in("id", ids);
        if (!cancelled && ords) {
          const map: Record<string, string> = {};
          for (const o of ords as Array<{ id: string; payment_method: string | null }>) {
            if (o.payment_method) map[o.id] = o.payment_method;
          }
          setPayMethods(map);
        }
      } else {
        setPayMethods({});
      }
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [events, pages, dateBounds, reloadTick]);

  // Agregados (Vendas/Receita/Leads + rankings) — reflete período + páginas
  // (sempre conta Purchase e Lead, independente do filtro de eventos da lista).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatsBusy(true);
      let q = supabase
        .from("meta_capi_log")
        .select("event_id,event_name,success,value,utm_content,utm_campaign")
        .gte("created_at", dateBounds.from.toISOString())
        .lt("created_at", dateBounds.to.toISOString())
        .in("event_name", ["Purchase", "Lead", "InitiateCheckout"])
        .limit(5000);
      if (pages.length > 0) q = q.in("page_source", pages);
      const { data } = await q;
      if (cancelled) return;
      setStats(aggregate((data as StatRow[]) || []));
      setStatsBusy(false);
    })();
    return () => { cancelled = true; };
  }, [pages, dateBounds, reloadTick]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) =>
      [r.session_id, r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.utm_term, r.order_id, r.event_id]
        .some((v) => (v || "").toLowerCase().includes(s)),
    );
  }, [rows, search]);

  const conv = stats.checkout_count > 0 ? `${((stats.sales_count / stats.checkout_count) * 100).toFixed(1)}%` : "—";
  const revenueLabel = `R$ ${Math.round(stats.revenue).toLocaleString("pt-BR")}`;

  return (
    <div>
      {/* Período */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {PERIOD_OPTIONS.filter((p) => p.key !== "custom").map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="text-[11px] px-3 py-1 rounded-full border transition"
            style={period === p.key
              ? { background: "#00ff88", color: "#000", borderColor: "#00ff88", fontWeight: 600 }
              : { background: "#17171c", color: "#9a9aa3", borderColor: "#26262d" }}
          >
            {p.label}
          </button>
        ))}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border transition"
              style={period === "custom"
                ? { background: "#00ff88", color: "#000", borderColor: "#00ff88", fontWeight: 600 }
                : { background: "#17171c", color: "#9a9aa3", borderColor: "#26262d" }}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {period === "custom" && customRange?.from
                ? customRange.to && customRange.to.getTime() !== customRange.from.getTime()
                  ? `${format(customRange.from, "dd/MM", { locale: ptBR })} – ${format(customRange.to, "dd/MM", { locale: ptBR })}`
                  : format(customRange.from, "dd/MM/yyyy", { locale: ptBR })
                : "Personalizado"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-white/10" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={(r) => { setCustomRange(r); if (r?.from) setPeriod("custom"); if (r?.from && r?.to) setCalendarOpen(false); }}
              numberOfMonths={2}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <button
          onClick={() => setReloadTick((t) => t + 1)}
          disabled={busy || statsBusy}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-[#00ff88] text-black hover:opacity-90 disabled:opacity-50"
          title="Atualizar"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", (busy || statsBusy) && "animate-spin")} />
          Atualizar
        </button>
      </div>

      {/* Filtros por inclusão */}
      <div className="text-[10px] uppercase tracking-[0.12em] text-gray-500 mb-1.5">Mostrar apenas (clique para incluir · nada marcado = tudo)</div>
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {CAPI_EVENT_OPTIONS.map((e) => (
          <Chip key={e} label={e} active={events.includes(e)} onClick={() => toggle(events, setEvents, e)} accent="#00ff88" />
        ))}
        <span className="w-px h-4 bg-white/10 mx-1" />
        {CAPI_PAGE_OPTIONS.map((p) => (
          <Chip key={p} label={p} active={pages.includes(p)} onClick={() => toggle(pages, setPages, p)} accent="#ff2d78" />
        ))}
        {(events.length > 0 || pages.length > 0) && (
          <button onClick={() => { setEvents([]); setPages([]); }} className="text-[11px] text-gray-500 hover:text-white ml-1">limpar</button>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-2.5 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <MetricCard label="Vendas" value={statsBusy ? "…" : String(stats.sales_count)} accent="#00ff88" />
        <MetricCard label="Receita" value={statsBusy ? "…" : revenueLabel} />
        <MetricCard label="Leads (cadastros)" value={statsBusy ? "…" : String(stats.leads_count)} />
        <MetricCard label="Conversão checkout→venda" value={statsBusy ? "…" : conv} />
      </div>

      {/* Rankings de vendas */}
      <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <RankingPanel title="🏆 Top UTM_CONTENT" subtitle="por vendas" items={stats.top_content_sales} color="#00ff88" />
        <RankingPanel title="📊 Por UTM_CAMPAIGN" subtitle="vendas · origem" items={stats.top_campaign_sales} color="#00cc6e" />
      </div>
      {/* Rankings de leads */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <RankingPanel title="🧲 Top UTM_CONTENT" subtitle="por leads" items={stats.top_content_leads} color="#ff2d78" />
        <RankingPanel title="📊 Por UTM_CAMPAIGN" subtitle="leads · origem" items={stats.top_campaign_leads} color="#c81e5b" />
      </div>

      {/* Busca + lista detalhada */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm uppercase tracking-wider text-gray-400">Eventos detalhados</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por SCK, UTM, order_id, event_id..."
          className="ml-auto px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs w-72 placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88]"
        />
      </div>

      {manualOpen && (
        <ManualFireModal
          initial={manualInitial}
          onClose={() => setManualOpen(false)}
          onFired={() => setReloadTick((t) => t + 1)}
        />
      )}

      {busy ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Sem registros no período/filtro.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-white/10">
          <table className="w-full text-xs">
            <thead className="bg-white/5 text-left uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-3 py-2"></th>
                <th className="px-3 py-2">Quando</th>
                <th className="px-3 py-2">Evento</th>
                <th className="px-3 py-2">Página</th>
                <th className="px-3 py-2">Pgto</th>
                <th className="px-3 py-2">Pixel</th>
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
                    <td className="px-2 py-2">
                      <button
                        onClick={() => {
                          setManualInitial({ eventName: r.event_name, value: r.value, orderId: r.order_id });
                          setManualOpen(true);
                        }}
                        title="Disparar este evento manualmente"
                        className="inline-flex items-center justify-center h-7 w-7 rounded text-[#00ff88] hover:bg-[#00ff88]/15 border border-[#00ff88]/30"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2">{r.event_name}</td>
                    <td className="px-3 py-2 text-gray-300">{r.page_source || "-"}</td>
                    <td className="px-3 py-2 text-gray-300 uppercase text-[10px]">{r.order_id ? (payMethods[r.order_id] === "card" ? "Cartão" : payMethods[r.order_id] === "pix" ? "Pix" : payMethods[r.order_id] || "-") : "-"}</td>
                    <td className="px-3 py-2 text-gray-300" title={r.pixel_id || ""}>
                      {r.pixel_label || (r.pixel_id ? `${r.pixel_id.slice(0, 6)}…${r.pixel_id.slice(-4)}` : "-")}
                    </td>
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
  const { product = "treinamento" } = useParams<{ product?: string }>();
  const adminPath = `/${encodeURIComponent(product)}/admin`;

  useEffect(() => { document.title = "Trackeamento — Admin"; }, []);

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to={`/${encodeURIComponent(product)}/membros`} replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={adminPath} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
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
            idPlaceholder="Pixel ID (ex.: 1234567890123456)"
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

        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>CAPI Log (Eventos enviados ao Meta)</h2>
          <CapiLogBody />
        </section>
      </div>
    </div>
  );
};

export default Trackeamento;
