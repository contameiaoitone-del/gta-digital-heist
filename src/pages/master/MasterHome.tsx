import { useEffect, useMemo, useState } from "react";
import MasterLayout from "./MasterLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

type Range = "7d" | "30d" | "custom";

interface Point {
  day: string;
  pedidos: number;
  receita: number;
  sessoes: number;
}

export default function MasterHome() {
  const [range, setRange] = useState<Range>("7d");
  const [custom, setCustom] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Point[]>([]);
  const [totals, setTotals] = useState({ receita: 0, pedidos: 0, sessoes: 0, acessos: 0 });

  const bounds = useMemo(() => {
    const now = new Date();
    if (range === "7d") return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    if (range === "30d") return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    if (custom?.from && custom?.to) return { from: startOfDay(custom.from), to: endOfDay(custom.to) };
    return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  }, [range, custom]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const fromIso = bounds.from.toISOString();
      const toIso = bounds.to.toISOString();
      const [ordersRes, sessionsRes, accessRes] = await Promise.all([
        supabase.from("orders").select("created_at,amount_cents,status").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("visitor_sessions").select("created_at").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("member_access").select("id").eq("active", true),
      ]);
      if (cancelled) return;

      const days = eachDayOfInterval({ start: bounds.from, end: bounds.to });
      const map = new Map<string, Point>();
      for (const d of days) {
        const key = format(d, "yyyy-MM-dd");
        map.set(key, { day: format(d, "dd/MM", { locale: ptBR }), pedidos: 0, receita: 0, sessoes: 0 });
      }
      let totalReceita = 0;
      let totalPedidos = 0;
      for (const o of (ordersRes.data || []) as Array<{ created_at: string; amount_cents: number; status: string }>) {
        if (o.status !== "paid") continue;
        const key = format(new Date(o.created_at), "yyyy-MM-dd");
        const p = map.get(key);
        if (!p) continue;
        p.pedidos += 1;
        p.receita += (o.amount_cents || 0) / 100;
        totalPedidos += 1;
        totalReceita += (o.amount_cents || 0) / 100;
      }
      let totalSessoes = 0;
      for (const s of (sessionsRes.data || []) as Array<{ created_at: string }>) {
        const key = format(new Date(s.created_at), "yyyy-MM-dd");
        const p = map.get(key);
        if (!p) continue;
        p.sessoes += 1;
        totalSessoes += 1;
      }
      setData(Array.from(map.values()));
      setTotals({
        receita: totalReceita,
        pedidos: totalPedidos,
        sessoes: totalSessoes,
        acessos: (accessRes.data || []).length,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [bounds]);

  return (
    <MasterLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-gta text-2xl md:text-3xl tracking-wide">Painel Master</h1>
            <p className="text-sm text-gray-400">Visão consolidada da operação.</p>
          </div>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "custom"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded text-xs border transition ${
                  range === r
                    ? "bg-[#00ff88] text-black border-[#00ff88]"
                    : "border-white/15 text-gray-300 hover:border-white/40"
                }`}
              >
                {r === "7d" ? "7 dias" : r === "30d" ? "30 dias" : "Personalizado"}
              </button>
            ))}
            {range === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent border-white/15 text-gray-200">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    {custom?.from && custom?.to
                      ? `${format(custom.from, "dd/MM")} – ${format(custom.to, "dd/MM")}`
                      : "Selecionar período"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={custom}
                    onSelect={setCustom}
                    numberOfMonths={2}
                    locale={ptBR}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Receita" value={`R$ ${totals.receita.toFixed(2)}`} accent="#00ff88" />
          <StatCard label="Pedidos pagos" value={String(totals.pedidos)} accent="#ff2d78" />
          <StatCard label="Sessões" value={String(totals.sessoes)} accent="#ffffff" />
          <StatCard label="Acessos ativos" value={String(totals.acessos)} accent="#00ff88" />
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-gta text-lg tracking-wide">Atividade</h2>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff2d78" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ff2d78" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSessoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: 6 }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="receita" name="Receita (R$)" stroke="#00ff88" fill="url(#gReceita)" strokeWidth={2} />
                <Area type="monotone" dataKey="pedidos" name="Pedidos" stroke="#ff2d78" fill="url(#gPedidos)" strokeWidth={2} />
                <Area type="monotone" dataKey="sessoes" name="Sessões" stroke="#ffffff" fill="url(#gSessoes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-1 font-gta text-2xl" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}