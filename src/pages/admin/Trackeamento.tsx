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

const CAPI_EVENT_OPTIONS = ["Purchase", "InitiateCheckout", "Lead", "PageView"] as const;
const CAPI_PAGE_OPTIONS = ["LP1", "LP2", "LP2-97", "MENTORIA"] as const;
const CAPI_FILTERS_KEY = "admin.trackeamento.capiFilters.v2";

function loadCapiFilters(): { events: string[]; pages: string[]; search: string } {
  try {
    const raw = localStorage.getItem(CAPI_FILTERS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        events: Array.isArray(p.events) ? p.events : [...CAPI_EVENT_OPTIONS],
        pages: Array.isArray(p.pages) ? p.pages : [...CAPI_PAGE_OPTIONS],
        search: typeof p.search === "string" ? p.search : "",
      };
    }
  } catch {}
  return { events: [...CAPI_EVENT_OPTIONS], pages: [...CAPI_PAGE_OPTIONS], search: "" };
}

function CapiMultiSelect({
  label, options, selected, onChange, accent,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const allSelected = selected.length === options.length;
  const summary = allSelected ? "Todos" : selected.length === 0 ? "Nenhum" : selected.length === 1 ? selected[0] : `${selected.length} selecionados`;
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10">
        <span className="text-gray-500">{label}:</span>
        <span style={{ color: accent }}>{summary}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 min-w-[200px] rounded border border-white/10 bg-[#0f0f0f] shadow-lg p-1">
          <button type="button" onClick={() => onChange(allSelected ? [] : [...options])}
            className="w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider text-gray-400 hover:bg-white/5 rounded">
            {allSelected ? "Desmarcar todos" : "Selecionar todos"}
          </button>
          <div className="h-px bg-white/10 my-1" />
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/5 rounded cursor-pointer">
                <input type="checkbox" checked={checked} onChange={() => toggle(opt)} style={{ accentColor: accent }} />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CapiLogBody() {
  const [rows, setRows] = useState<CapiLogRow[]>([]);
  const [payMethods, setPayMethods] = useState<Record<string, string>>({});
  const initial = useRef<{ events: string[]; pages: string[]; search: string }>(loadCapiFilters());
  const [events, setEvents] = useState<string[]>(initial.current.events);
  const [pages, setPages] = useState<string[]>(initial.current.pages);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "custom">("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [search, setSearch] = useState<string>(initial.current.search);
  const [busy, setBusy] = useState(true);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualInitial, setManualInitial] = useState<{ eventName?: string; value?: number | null; orderId?: string | null } | undefined>();

  useEffect(() => {
    try { localStorage.setItem(CAPI_FILTERS_KEY, JSON.stringify({ events, pages, search })); } catch {}
  }, [events, pages, search]);

  const dateBounds = useMemo(() => {
    const now = new Date();
    if (dateFilter === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(start); end.setDate(end.getDate() + 1);
      return { from: start, to: end };
    }
    if (dateFilter === "yesterday") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const end = new Date(start); end.setDate(end.getDate() + 1);
      return { from: start, to: end };
    }
    if (dateFilter === "custom" && customRange?.from) {
      const start = new Date(customRange.from);
      start.setHours(0, 0, 0, 0);
      const endBase = customRange.to ? new Date(customRange.to) : new Date(customRange.from);
      const end = new Date(endBase.getFullYear(), endBase.getMonth(), endBase.getDate() + 1);
      return { from: start, to: end };
    }
    return null;
  }, [dateFilter, customRange]);

  const [reloadTick, setReloadTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      if (events.length === 0 || pages.length === 0) {
        if (!cancelled) { setRows([]); setPayMethods({}); setBusy(false); }
        return;
      }
      let q = supabase.from("meta_capi_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (events.length < CAPI_EVENT_OPTIONS.length) q = q.in("event_name", events);
      if (pages.length < CAPI_PAGE_OPTIONS.length) q = q.in("page_source", pages);
      if (dateBounds) {
        q = q.gte("created_at", dateBounds.from.toISOString()).lt("created_at", dateBounds.to.toISOString());
      }
      const { data } = await q;
      if (!cancelled) {
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
      }
    })();
    return () => { cancelled = true; };
  }, [events, pages, dateBounds, reloadTick]);

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
        <CapiMultiSelect label="Eventos" options={CAPI_EVENT_OPTIONS} selected={events} onChange={setEvents} accent="#00ff88" />
        <CapiMultiSelect label="Páginas" options={CAPI_PAGE_OPTIONS} selected={pages} onChange={setPages} accent="#ff2d78" />
        <span className="mx-1 h-5 w-px bg-white/10" />
        {([["all", "Todas as datas"], ["today", "Hoje"], ["yesterday", "Ontem"]] as const).map(([f, lbl]) => (
          <button key={f} onClick={() => { setDateFilter(f); }}
            className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider ${dateFilter === f ? "bg-[#00ff88] text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
            {lbl}
          </button>
        ))}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider",
                dateFilter === "custom" ? "bg-[#00ff88] text-black" : "bg-white/5 text-gray-300 hover:bg-white/10",
              )}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateFilter === "custom" && customRange?.from
                ? customRange.to && customRange.to.getTime() !== customRange.from.getTime()
                  ? `${format(customRange.from, "dd/MM", { locale: ptBR })} – ${format(customRange.to, "dd/MM", { locale: ptBR })}`
                  : format(customRange.from, "dd/MM/yyyy", { locale: ptBR })
                : "Período"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-white/10" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={(r) => { setCustomRange(r); if (r?.from) setDateFilter("custom"); if (r?.from && r?.to) setCalendarOpen(false); }}
              numberOfMonths={2}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por SCK, UTM, order_id, event_id..."
          className="ml-auto px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs w-72 placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88]" />
        <button
          onClick={() => setReloadTick((t) => t + 1)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-[#00ff88] text-black hover:opacity-90 disabled:opacity-50"
          title="Atualizar logs"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
          Atualizar
        </button>
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
        <p className="text-sm text-gray-500">Sem registros.</p>
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