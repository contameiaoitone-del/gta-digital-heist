import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, X } from "lucide-react";
import { getSessionId } from "@/hooks/useTracking";

const EVENT_FIRE_OPTIONS = ["PageView", "ViewContent", "InitiateCheckout", "Lead", "Purchase"] as const;

interface PixelOpt { id: string; pixel_id: string; label: string | null }

// Disparo manual de um evento para um pixel específico. Reutilizado pelo CAPI
// Log dentro da página de Trackeamento (um botão por evento na lista).
export function ManualFireModal({
  onClose,
  onFired,
  initial,
}: {
  onClose: () => void;
  onFired: () => void;
  initial?: { eventName?: string; value?: number | null; orderId?: string | null };
}) {
  const [pixels, setPixels] = useState<PixelOpt[]>([]);
  const [pixelId, setPixelId] = useState<string>("");
  const [eventName, setEventName] = useState<string>(initial?.eventName || "PageView");
  const [value, setValue] = useState<string>(initial?.value != null ? String(initial.value) : "");
  const [orderId, setOrderId] = useState<string>(initial?.orderId || "");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("tracking_pixels")
        .select("id, pixel_id, label, active, platform")
        .eq("platform", "meta")
        .eq("active", true);
      const list = (data || []) as PixelOpt[];
      setPixels(list);
      if (list[0]) setPixelId(list[0].pixel_id);
    })();
  }, []);

  const fire = async () => {
    setSending(true);
    setResult(null);
    try {
      const eventId = (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() || String(Date.now());
      const payload: Record<string, unknown> = {
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        session_id: getSessionId(),
        target_pixel_id: pixelId,
        manual: true,
        page_source: "MANUAL",
      };
      const num = Number(value);
      if (!Number.isNaN(num) && num > 0) payload.value = num;
      if (orderId.trim()) payload.order_id = orderId.trim();
      const { data, error } = await supabase.functions.invoke("meta-capi", { body: payload });
      if (error) {
        setResult({ ok: false, msg: error.message || "Erro ao disparar" });
      } else {
        const r = data as { success?: boolean; error?: string };
        if (r?.success) {
          setResult({ ok: true, msg: `Evento enviado (event_id: ${eventId.slice(0, 8)}…)` });
          onFired();
        } else {
          setResult({ ok: false, msg: r?.error || "Falha desconhecida" });
        }
      }
    } catch (e) {
      setResult({ ok: false, msg: String(e) });
    } finally {
      setSending(false);
    }
  };

  const valueNeeded = eventName === "Purchase" || eventName === "InitiateCheckout";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>Disparo manual</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Pixel</label>
            <select
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:border-[#00ff88]"
            >
              {pixels.length === 0 && <option value="">Nenhum pixel ativo</option>}
              {pixels.map((p) => (
                <option key={p.id} value={p.pixel_id}>
                  {p.label || p.pixel_id} ({p.pixel_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Evento</label>
            <select
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:border-[#00ff88]"
            >
              {EVENT_FIRE_OPTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {valueNeeded && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Valor (BRL)</label>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="97.00"
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          )}

          {eventName === "Purchase" && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Order ID (opcional)</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="uuid do pedido"
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-gray-200 focus:outline-none focus:border-[#00ff88] font-mono text-xs"
              />
            </div>
          )}

          {result && (
            <div className={`text-xs p-2 rounded ${result.ok ? "bg-[#00ff88]/10 text-[#00ff88]" : "bg-[#ff2d78]/10 text-[#ff2d78]"}`}>
              {result.msg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs uppercase tracking-wider text-gray-400 hover:text-white"
            >
              Fechar
            </button>
            <button
              onClick={fire}
              disabled={sending || !pixelId}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs uppercase tracking-wider bg-[#00ff88] text-black hover:bg-[#00ff88]/80 disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              Disparar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// O CAPI Log foi unificado dentro de /admin/trackeamento. Mantemos esta rota
// como redirect para não quebrar links antigos.
const CapiLog = () => {
  const { product = "treinamento" } = useParams<{ product?: string }>();
  return <Navigate to={`/${encodeURIComponent(product)}/admin/trackeamento`} replace />;
};

export default CapiLog;
