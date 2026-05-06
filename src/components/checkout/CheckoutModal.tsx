import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, QrCode, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { customerSchema } from "@/lib/validators";
import { useEfiCheckout, type PixResponse } from "@/hooks/useEfiCheckout";
import { PixStep } from "./PixStep";
import { CardStep } from "./CardStep";
import { useTracking, getSessionId } from "@/hooks/useTracking";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type Step = "form" | "method" | "pix" | "card";

export const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const { createPix, loading } = useEfiCheckout();
  const { trackInitiateCheckout, saveLead } = useTracking();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const initiateFiredRef = useRef(false);

  const reset = () => {
    setStep("form");
    setPixData(null);
    setErrors({});
    initiateFiredRef.current = false;
  };

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const customer = { name, email, phone, cpf };

  // Fire InitiateCheckout exactly once when the user reaches the payment-method step.
  useEffect(() => {
    if (step === "method" && !initiateFiredRef.current) {
      initiateFiredRef.current = true;
      trackInitiateCheckout({ value: 67 });
    }
  }, [step, trackInitiateCheckout]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, (v as string[])[0]])));
      return;
    }
    setErrors({});
    saveLead({ name, email, phone, cpf });
    setStep("method");
  };

  const goPix = async () => {
    try {
      const r = await createPix({ ...customer, session_id: getSessionId() });
      setPixData(r);
      setStep("pix");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar Pix");
    }
  };

  const goCard = () => setStep("card");

  const onPixPaid = () => {
    const eid = pixData?.event_id_purchase || "";
    onOpenChange(false);
    navigate(`/obrigado?metodo=pix&eventId=${encodeURIComponent(eid)}&value=67&orderId=${encodeURIComponent(pixData?.order_id || "")}`);
  };
  const onCardPaid = (info: { eventId: string; orderId: string }) => {
    onOpenChange(false);
    navigate(`/obrigado?metodo=cartao&eventId=${encodeURIComponent(info.eventId)}&value=67&orderId=${encodeURIComponent(info.orderId)}`);
  };
  const onCardPending = () => {
    onOpenChange(false);
    navigate("/obrigado?metodo=cartao&status=pendente");
  };

  const inputCls = "w-full h-11 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md bg-[#0b0b0b] border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {step !== "form" && step !== "pix" && (
              <button onClick={() => setStep(step === "method" ? "form" : "method")} className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <DialogTitle className="text-xl flex-1 text-center" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
              {step === "pix" ? "Pague com Pix" : step === "card" ? "Pague com Cartão" : "Finalizar Compra"}
            </DialogTitle>
            <span className="w-5" />
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between bg-[#111] border border-white/10 rounded-lg px-4 py-3 mb-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">InfoZap</p>
            <p className="text-sm text-gray-300">Acesso vitalício + bônus</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 line-through">R$ 1.379</p>
            <p className="text-2xl font-bold" style={{ color: "#00ff88", fontFamily: "'Bebas Neue', cursive" }}>R$ 67,00</p>
          </div>
        </div>

        {step === "form" && (
          <form onSubmit={submitForm} className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">Nome completo</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Seu nome" />
              {errors.name && <p className="text-xs text-[#ff2d78] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="seu@email.com" />
              {errors.email && <p className="text-xs text-[#ff2d78] mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">Telefone</label>
              <IMaskInput mask="(00) 00000-0000" value={phone} onAccept={(v) => setPhone(v as string)} className={inputCls} placeholder="(11) 99999-9999" />
              {errors.phone && <p className="text-xs text-[#ff2d78] mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">CPF</label>
              <IMaskInput mask="000.000.000-00" value={cpf} onAccept={(v) => setCpf(v as string)} className={inputCls} placeholder="000.000.000-00" />
              {errors.cpf && <p className="text-xs text-[#ff2d78] mt-1">{errors.cpf}</p>}
            </div>
            <Button type="submit" className="w-full h-12 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide whitespace-normal h-auto py-3">
              Continuar
            </Button>
          </form>
        )}

        {step === "method" && (
          <div className="space-y-3">
            <button
              onClick={goPix}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-lg border border-white/15 bg-black/40 hover:border-[#00ff88] px-4 py-4 transition-colors text-left disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <QrCode className="h-6 w-6" style={{ color: "#00ff88" }} />
                <div>
                  <p className="font-semibold">Pix</p>
                  <p className="text-xs text-gray-400">Aprovação imediata</p>
                </div>
              </div>
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <span className="text-xs text-gray-500">→</span>}
            </button>
            <button
              onClick={goCard}
              className="w-full flex items-center justify-between rounded-lg border border-white/15 bg-black/40 hover:border-[#00ff88] px-4 py-4 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" style={{ color: "#00ff88" }} />
                <div>
                  <p className="font-semibold">Cartão de Crédito</p>
                  <p className="text-xs text-gray-400">Em até 12x sem juros</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </button>
            <p className="text-[11px] text-gray-500 text-center pt-2">Pagamento seguro processado pela Efí Bank</p>
          </div>
        )}

        {step === "pix" && pixData && <PixStep data={pixData} onPaid={onPixPaid} />}

        {step === "card" && (
          <CardStep customer={customer} onPaid={onCardPaid} onPending={onCardPending} />
        )}
      </DialogContent>
    </Dialog>
  );
};
