import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEfiCheckout } from "@/hooks/useEfiCheckout";

interface PixStepProps {
  data: { order_id: string; copia_cola: string; qrcode_image: string; expires_in: number };
  onPaid: () => void;
}

export const PixStep = ({ data, onPaid }: PixStepProps) => {
  const { checkStatus } = useEfiCheckout();
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(data.expires_in);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let stop = false;
    const poll = async () => {
      try {
        const r = await checkStatus(data.order_id);
        if (r.status === "paid") {
          if (!stop) onPaid();
          return;
        }
      } catch (e) {
        console.warn("status poll error", e);
      }
      if (!stop) setTimeout(poll, 4000);
    };
    poll();
    return () => {
      stop = true;
    };
  }, [data.order_id, checkStatus, onPaid]);

  const copy = async () => {
    await navigator.clipboard.writeText(data.copia_cola);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2500);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <p className="text-sm text-gray-300">Escaneie o QR Code ou copie o código abaixo</p>
      <div className="rounded-lg overflow-hidden bg-white p-2">
        <img src={`data:image/png;base64,${data.qrcode_image.replace(/^data:image\/png;base64,/, "")}`} alt="QR Code Pix" className="w-56 h-56" />
      </div>
      <div className="w-full">
        <div className="text-xs text-gray-400 break-all bg-black/40 border border-white/10 rounded-md p-3 max-h-24 overflow-auto font-mono">
          {data.copia_cola}
        </div>
        <Button onClick={copy} className="mt-3 w-full h-12 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide whitespace-normal">
          {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
          {copied ? "Copiado" : "Copiar código Pix"}
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Aguardando pagamento... expira em {mm}:{ss}
      </div>
    </div>
  );
};
