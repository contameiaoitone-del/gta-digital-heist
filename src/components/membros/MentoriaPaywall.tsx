import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  moduleId: string;
  moduleTitle: string;
  priceCents: number;
  defaultName?: string;
  onPaid: () => void;
}

interface PixData {
  order_id: string;
  copia_cola: string;
  qrcode_image: string;
}

export const MentoriaPaywall = ({ moduleId, moduleTitle, priceCents, defaultName, onPaid }: Props) => {
  const [name, setName] = useState(defaultName || "");
  const [cpf, setCpf] = useState("");
  const [busy, setBusy] = useState(false);
  const [pix, setPix] = useState<PixData | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  const startCheckout = async () => {
    if (name.trim().length < 2) return toast.error("Digite seu nome completo");
    if (cpf.replace(/\D/g, "").length !== 11) return toast.error("CPF inválido");
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("mentoria-create-pix", {
      body: { module_id: moduleId, name: name.trim(), cpf: cpf.replace(/\D/g, "") },
    });
    setBusy(false);
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error || error?.message || "Erro ao gerar Pix");
      return;
    }
    setPix(data as PixData);
    pollRef.current = window.setInterval(async () => {
      const { data: s } = await supabase.functions.invoke("pix-check-status", {
        body: { order_id: (data as PixData).order_id },
      });
      if ((s as { status?: string })?.status === "paid") {
        setPaid(true);
        if (pollRef.current) window.clearInterval(pollRef.current);
        setTimeout(onPaid, 1500);
      }
    }, 4000);
  };

  const copyCode = async () => {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputCls = "w-full h-11 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

  return (
    <div className="max-w-md mx-auto bg-[#111] border border-white/10 rounded-xl p-6">
      <p className="text-xs uppercase tracking-widest text-[#ff2d78] mb-1">Mentoria</p>
      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>{moduleTitle}</h2>
      <p className="text-3xl font-bold text-[#00ff88] mb-5" style={{ fontFamily: "'Bebas Neue', cursive" }}>R$ {(priceCents / 100).toFixed(2)}</p>

      {paid ? (
        <div className="text-center py-6">
          <Check className="h-12 w-12 text-[#00ff88] mx-auto mb-3" />
          <p className="font-bold text-lg">Pagamento confirmado!</p>
          <p className="text-sm text-gray-400">Liberando seu acesso...</p>
        </div>
      ) : !pix ? (
        <div className="space-y-3">
          <input className={inputCls} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} placeholder="CPF (apenas números)" value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength={14} />
          <button onClick={startCheckout} disabled={busy} className="w-full h-11 bg-[#00ff88] text-black font-bold rounded uppercase whitespace-normal h-auto py-3" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            {busy ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : `Liberar acesso · R$ ${(priceCents / 100).toFixed(2)}`}
          </button>
          <p className="text-xs text-gray-500 text-center">Pagamento via Pix. Acesso liberado automaticamente após confirmação.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg flex items-center justify-center">
            {pix.qrcode_image ? (
              <img src={pix.qrcode_image} alt="QR Code Pix" className="w-56 h-56" />
            ) : (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pix.copia_cola)}`} alt="QR Code Pix" className="w-56 h-56" />
            )}
          </div>
          <button onClick={copyCode} className="w-full h-11 border border-white/20 hover:border-[#00ff88] rounded text-sm flex items-center justify-center gap-2">
            {copied ? <><Check className="h-4 w-4" /> Copiado!</> : <><Copy className="h-4 w-4" /> Copiar código Pix</>}
          </button>
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Aguardando pagamento...
          </p>
        </div>
      )}
    </div>
  );
};