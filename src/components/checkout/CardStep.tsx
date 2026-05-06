import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cardSchema } from "@/lib/validators";
import { useEfiCheckout } from "@/hooks/useEfiCheckout";
import { supabase } from "@/integrations/supabase/client";

interface CardStepProps {
  customer: { name: string; email: string; phone: string; cpf: string };
  onPaid: () => void;
  onPending: () => void;
}

const PRICE_CENTS = 6700;

const SDK_URL =
  "https://cdn.jsdelivr.net/npm/payment-token-efi@latest/dist/payment-token-efi.umd.min.js";

// Loads the official EfiPay payment-token JS SDK (production-safe).
// Docs: https://github.com/efipay/js-payment-token-efi
async function loadEfiSdk(): Promise<unknown> {
  // @ts-ignore
  if (typeof window.EfiPay !== "undefined") return window.EfiPay;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SDK_URL}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("efi sdk load failed")));
      // @ts-ignore — already loaded
      if (typeof window.EfiPay !== "undefined") resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("efi sdk load failed"));
    document.head.appendChild(s);
  });

  // @ts-ignore
  return window.EfiPay;
}

const installmentLabel = (n: number) => {
  const value = (PRICE_CENTS / 100 / n).toFixed(2).replace(".", ",");
  return n === 1 ? `1x de R$ 67,00 (à vista)` : `${n}x de R$ ${value} sem juros`;
};

const inputCls =
  "w-full h-11 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="text-xs text-gray-300 uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-xs text-[#ff2d78]">{error}</p>}
  </div>
);

export const CardStep = ({ customer, onPaid, onPending }: CardStepProps) => {
  const { createCard } = useEfiCheckout();
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [birth, setBirth] = useState("");
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payeeCode, setPayeeCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.functions.invoke("efi-config").then(({ data }) => {
      if (data && typeof (data as { payee_code?: string }).payee_code === "string") {
        setPayeeCode((data as { payee_code: string }).payee_code);
      }
    });
    loadEfiSdk().catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = cardSchema.safeParse({ number, holder, expiry, cvv, birth, installments });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, (v as string[])[0]])));
      return;
    }
    setErrors({});

    if (!payeeCode) {
      toast.error("Configuração de cartão indisponível. Tente Pix.");
      return;
    }

    setLoading(true);
    try {
      // @ts-ignore
      const EfiPay: any = await loadEfiSdk();
      if (!EfiPay?.CreditCard) {
        toast.error("Não foi possível carregar o módulo de cartão. Tente novamente ou pague com Pix.");
        setLoading(false);
        return;
      }

      const [mm, yy] = expiry.split("/");
      const cleanNumber = number.replace(/\D/g, "");
      const cleanCpf = customer.cpf.replace(/\D/g, "");

      let tokenResp: { payment_token?: string; card_mask?: string };
      try {
        tokenResp = await EfiPay.CreditCard
          .setAccount(payeeCode)
          .setEnvironment("production")
          .setCreditCardData({
            number: cleanNumber,
            cvv,
            expirationMonth: mm,
            expirationYear: `20${yy}`,
            holderName: holder,
            holderDocument: cleanCpf,
            reuse: false,
          })
          .getPaymentToken();
      } catch (err: any) {
        console.error("efi tokenize error", err);
        const msg = err?.error_description || err?.message || "Não foi possível validar o cartão.";
        toast.error(typeof msg === "string" ? msg : "Verifique os dados do cartão.");
        setLoading(false);
        return;
      }

      if (!tokenResp?.payment_token) {
        toast.error("Não foi possível validar o cartão. Verifique os dados.");
        setLoading(false);
        return;
      }

      const [bd, bm, by] = birth.split("/");
      const birthIso = `${by}-${bm}-${bd}`;

      const result = await createCard({
        ...customer,
        payment_token: tokenResp.payment_token,
        installments,
        birth: birthIso,
      });

      if (result.status === "paid") onPaid();
      else if (result.status === "failed") toast.error("Pagamento recusado pela operadora.");
      else onPending();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao processar cartão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Número do cartão" error={errors.number}>
        <IMaskInput mask="0000 0000 0000 0000" value={number} onAccept={(v) => setNumber(v as string)} placeholder="0000 0000 0000 0000" className={inputCls} />
      </Field>
      <Field label="Nome impresso no cartão" error={errors.holder}>
        <input value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} placeholder="COMO ESTÁ NO CARTÃO" className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Validade" error={errors.expiry}>
          <IMaskInput mask="00/00" value={expiry} onAccept={(v) => setExpiry(v as string)} placeholder="MM/AA" className={inputCls} />
        </Field>
        <Field label="CVV" error={errors.cvv}>
          <IMaskInput mask="0000" value={cvv} onAccept={(v) => setCvv(v as string)} placeholder="123" className={inputCls} />
        </Field>
      </div>
      <Field label="Data de nascimento" error={errors.birth}>
        <IMaskInput mask="00/00/0000" value={birth} onAccept={(v) => setBirth(v as string)} placeholder="DD/MM/AAAA" className={inputCls} />
      </Field>
      <Field label="Parcelas">
        <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className={inputCls}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="bg-black">{installmentLabel(n)}</option>
          ))}
        </select>
      </Field>

      <Button type="submit" disabled={loading} className="w-full h-12 mt-2 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide whitespace-normal h-auto py-3">
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Pagar R$ 67,00
      </Button>
      <p className="text-[11px] text-gray-500 text-center">Pagamento processado por Efí Bank · Seus dados são criptografados</p>
    </form>
  );
};
