import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, ChevronDown } from "lucide-react";

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
  meta_response: unknown;
  error: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  page_source: string | null;
}

const EVENT_OPTIONS = ["Purchase", "InitiateCheckout", "Lead", "PageView"] as const;
const PAGE_OPTIONS = ["LP1", "LP2", "LP2-97", "MENTORIA"] as const;
const STORAGE_KEY = "admin.capiLog.filters.v1";

type Filters = {
  events: string[];
  pages: string[];
  search: string;
};

function loadFilters(): Filters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        events: Array.isArray(parsed.events) ? parsed.events : [...EVENT_OPTIONS],
        pages: Array.isArray(parsed.pages) ? parsed.pages : [...PAGE_OPTIONS],
        search: typeof parsed.search === "string" ? parsed.search : "",
      };
    }
  } catch {}
  return { events: [...EVENT_OPTIONS], pages: [...PAGE_OPTIONS], search: "" };
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  accent,
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
  const summary = allSelected
    ? "Todos"
    : selected.length === 0
    ? "Nenhum"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} selecionados`;
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10"
      >
        <span className="text-gray-500">{label}:</span>
        <span style={{ color: accent }}>{summary}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 min-w-[200px] rounded border border-white/10 bg-[#0f0f0f] shadow-lg p-1">
          <button
            onClick={() => onChange(allSelected ? [] : [...options])}
            className="w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider text-gray-400 hover:bg-white/5 rounded"
          >
            {allSelected ? "Desmarcar todos" : "Selecionar todos"}
          </button>
          <div className="h-px bg-white/10 my-1" />
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/5 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  className="accent-current"
                  style={{ accentColor: accent }}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

const CapiLog = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const { product = "treinamento" } = useParams<{ product?: string }>();
  const productPath = `/${encodeURIComponent(product)}`;
  const [rows, setRows] = useState<CapiLogRow[]>([]);
  const initial = useRef<Filters>(loadFilters());
  const [events, setEvents] = useState<string[]>(initial.current.events);
  const [pages, setPages] = useState<string[]>(initial.current.pages);
  const [search, setSearch] = useState<string>(initial.current.search);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ events, pages, search }));
    } catch {}
  }, [events, pages, search]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      let q = supabase.from("meta_capi_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (events.length === 0) {
        if (!cancelled) { setRows([]); setBusy(false); }
        return;
      }
      if (events.length < EVENT_OPTIONS.length) q = q.in("event_name", events);
      if (pages.length === 0) {
        if (!cancelled) { setRows([]); setBusy(false); }
        return;
      }
      if (pages.length < PAGE_OPTIONS.length) q = q.in("page_source", pages);
      const { data } = await q;
      if (!cancelled) {
        setRows((data as CapiLogRow[]) || []);
        setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [events, pages]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) =>
      [r.session_id, r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.utm_term, r.order_id, r.event_id]
        .some((v) => (v || "").toLowerCase().includes(s)),
    );
  }, [rows, search]);

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to={`${productPath}/membros`} replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`${productPath}/admin`} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>Meta CAPI Log</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <MultiSelect label="Eventos" options={EVENT_OPTIONS} selected={events} onChange={setEvents} accent="#00ff88" />
          <MultiSelect label="Páginas" options={PAGE_OPTIONS} selected={pages} onChange={setPages} accent="#ff2d78" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por SCK, UTM, order_id, event_id..."
            className="ml-auto px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs w-72 placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88]"
          />
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
                  <th className="px-3 py-2">Página</th>
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
                      <td className="px-3 py-2 text-gray-300">{r.page_source || "-"}</td>
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
    </div>
  );
};

export default CapiLog;
