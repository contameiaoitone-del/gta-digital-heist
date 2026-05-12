import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check, AlertTriangle, QrCode, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { IMaskInput } from "react-imask";
import EfiPay from "payment-token-efi";
import { cardSchema } from "@/lib/validators";

interface Props {
  moduleId: string;
  moduleTitle: string;
  priceCents: number;
  notice?: string | null;
  defaultName?: string;
  defaultEmail?: string;
  onPaid: () => void;
}

interface PixData {
  order_id: string;
  copia_cola: string;
  qrcode_image: string;
}

export const MentoriaPaywall = ({ moduleId, moduleTitle, priceCents, notice, defaultName, defaultEmail, onPaid }: Props) => {
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [name, setName] = useState(defaultName || "");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState(defaultEmail || "");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [pix, setPix] = useState<PixData | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);
  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [payeeCode, setPayeeCode] = useState<string | null>(null);

  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  useEffect(() => {
    supabase.functions.invoke("efi-config").then(({ data }) => {
      if (data && typeof (data as { payee_code?: string }).payee_code === "string") {
        setPayeeCode((data as { payee_code: string }).payee_code);
      }
    }).catch(() => {});
  }, []);

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

  const submitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Digite seu nome completo");
    if (cpf.replace(/\D/g, "").length !== 11) return toast.error("CPF inválido");
    if (!email.trim()) return toast.error("E-mail obrigatório");
    if (phone.replace(/\D/g, "").length < 10) return toast.error("Telefone inválido");
    const parsed = cardSchema.safeParse({ number: cardNumber, holder, expiry, cvv, installments });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      const first = Object.values(f).flat()[0] as string | undefined;
      return toast.error(first || "Dados do cartão inválidos");
    }
    if (!payeeCode) return toast.error("Cartão indisponível. Use Pix.");
    setBusy(true);
    try {
      const [mm, yy] = expiry.split("/");
      const cleanNumber = cardNumber.replace(/\D/g, "");
      const cleanCpf = cpf.replace(/\D/g, "");
      // @ts-ignore
      const brand = await EfiPay.CreditCard.setCardNumber(cleanNumber).verifyCardBrand();
      if (!brand || brand === "undefined" || brand === "unsupported") {
        toast.error("Bandeira não aceita. Tente outro cartão ou Pix.");
        setBusy(false); return;
      }
      // @ts-ignore
      const tokenResp = await EfiPay.CreditCard
        .setAccount(payeeCode)
        .setEnvironment("production")
        .setCreditCardData({
          brand, number: cleanNumber, cvv,
          expirationMonth: mm, expirationYear: `20${yy}`,
          holderName: holder, holderDocument: cleanCpf, reuse: false,
        })
        .getPaymentToken();
      if (!tokenResp?.payment_token) {
        toast.error("Não foi possível validar o cartão.");
        setBusy(false); return;
      }
      const { data, error } = await supabase.functions.invoke("mentoria-create-card", {
        body: {
          module_id: moduleId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.replace(/\D/g, ""),
          cpf: cleanCpf,
          payment_token: tokenResp.payment_token,
          installments,
        },
      });
      if (error || (data as { error?: string })?.error) {
        toast.error((data as { error?: string })?.error || error?.message || "Erro no pagamento");
        setBusy(false); return;
      }
      const status = (data as { status?: string })?.status;
      if (status === "paid") {
        setPaid(true);
        setTimeout(onPaid, 1200);
      } else if (status === "failed") {
        toast.error("Pagamento recusado pela operadora.");
      } else {
        toast("Pagamento em análise. Você receberá confirmação em instantes.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao processar cartão");
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputCls = "w-full h-11 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";
  const totalLabel = (priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-md mx-auto bg-[#111] border border-white/10 rounded-xl p-6">
      <p className="text-xs uppercase tracking-widest text-[#ff2d78] mb-1">Mentoria</p>
      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>{moduleTitle}</h2>
      {notice && (
        <div className="my-3 flex items-start gap-2 rounded-md border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-200 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-300" />
          <span>{notice}</span>
        </div>
      )}
      <p className="text-3xl font-bold text-[#00ff88] mb-5" style={{ fontFamily: "'Bebas Neue', cursive" }}>R$ {(priceCents / 100).toFixed(2)}</p>

      {paid ? (
        <div className="text-center py-6">
          <Check className="h-12 w-12 text-[#00ff88] mx-auto mb-3" />
          <p className="font-bold text-lg">Pagamento confirmado!</p>
          <p className="text-sm text-gray-400">Liberando seu acesso...</p>
        </div>
      ) : pix ? (
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
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button type="button" onClick={() => setMethod("pix")} className={`h-10 rounded text-sm font-bold uppercase flex items-center justify-center gap-2 border ${method === "pix" ? "bg-[#00ff88] text-black border-[#00ff88]" : "border-white/20 text-gray-300"}`}>
              <QrCode className="h-4 w-4" /> Pix
            </button>
            <button type="button" onClick={() => setMethod("card")} className={`h-10 rounded text-sm font-bold uppercase flex items-center justify-center gap-2 border ${method === "card" ? "bg-[#8b3fdb] text-white border-[#8b3fdb]" : "border-white/20 text-gray-300"}`}>
              <CreditCard className="h-4 w-4" /> Cartão
            </button>
          </div>
          {method === "pix" ? (
        <div className="space-y-3">
          <input className={inputCls} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} placeholder="CPF (apenas números)" value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength={14} />
          <button onClick={startCheckout} disabled={busy} className="w-full h-11 bg-[#00ff88] text-black font-bold rounded uppercase whitespace-normal h-auto py-3" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            {busy ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : `Liberar acesso · R$ ${(priceCents / 100).toFixed(2)}`}
          </button>
          <p className="text-xs text-gray-500 text-center">Pagamento via Pix. Acesso liberado automaticamente após confirmação.</p>
        </div>
          ) : (
            <form onSubmit={submitCard} className="space-y-3">
              <input className={inputCls} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputCls} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength={14} />
                <IMaskInput mask="(00) 00000-0000" value={phone} onAccept={(v) => setPhone(v as string)} placeholder="Telefone" className={inputCls} />
              </div>
              <IMaskInput mask="0000 0000 0000 0000" value={cardNumber} onAccept={(v) => setCardNumber(v as string)} placeholder="Número do cartão" className={inputCls} />
              <input className={inputCls} placeholder="Nome impresso no cartão" value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} />
              <div className="grid grid-cols-2 gap-2">
                <IMaskInput mask="00/00" value={expiry} onAccept={(v) => setExpiry(v as string)} placeholder="MM/AA" className={inputCls} />
                <IMaskInput mask="0000" value={cvv} onAccept={(v) => setCvv(v as string)} placeholder="CVV" className={inputCls} />
              </div>
              <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className={inputCls}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                  const v = (priceCents / 100 / n).toFixed(2).replace(".", ",");
                  return <option key={n} value={n} className="bg-black">{n === 1 ? `1x de R$ ${totalLabel} (à vista)` : `${n}x de R$ ${v} sem juros`}</option>;
                })}
              </select>
              <button type="submit" disabled={busy} className="w-full h-11 bg-[#8b3fdb] hover:bg-[#7530c0] text-white font-bold rounded uppercase whitespace-normal h-auto py-3" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : `Pagar R$ ${totalLabel}`}
              </button>
              <p className="text-xs text-gray-500 text-center">Acesso liberado automaticamente após aprovação.</p>
            </form>
          )}
        </>
      )}
    </div>
  );
};