import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EfiPay from "payment-token-efi";
import { cardSchema } from "@/lib/validators";
import { useEfiCheckout } from "@/hooks/useEfiCheckout";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useTracking";

interface CardStepProps {
  customer: { name: string; email: string; phone: string; cpf: string };
  onPaid: (info: { eventId: string; orderId: string }) => void;
  onPending: () => void;
  product?: "treinamento" | "lp2" | "lp2_97" | "lp2_5";
  priceCents?: number;
}

const inputCls =
  "w-full h-11 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b3fdb] font-body";

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

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout:${label}`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

export const CardStep = ({ customer, onPaid, onPending, product = "treinamento", priceCents = 6700 }: CardStepProps) => {
  const totalLabel = (priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const installmentLabel = (n: number) => {
    const value = (priceCents / 100 / n).toFixed(2).replace(".", ",");
    return n === 1 ? `1x de R$ ${totalLabel} (à vista)` : `${n}x de R$ ${value} sem juros`;
  };
  const { createCard } = useEfiCheckout();
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payeeCode, setPayeeCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.functions.invoke("efi-config").then(({ data }) => {
      if (data && typeof (data as { payee_code?: string }).payee_code === "string") {
        setPayeeCode((data as { payee_code: string }).payee_code);
      }
    }).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = cardSchema.safeParse({ number, holder, expiry, cvv, installments });
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
      const [mm, yy] = expiry.split("/");
      const cleanNumber = number.replace(/\D/g, "");
      const cleanCpf = customer.cpf.replace(/\D/g, "");

      let brand = "undefined";
      try {
        brand = await withTimeout(
          // @ts-ignore
          EfiPay.CreditCard.setCardNumber(cleanNumber).verifyCardBrand(),
          15000,
          "verifyCardBrand",
        );
      } catch (err) {
        console.error("efi verifyCardBrand error", err);
        toast.error("Não foi possível validar a bandeira do cartão. Tente novamente ou use Pix.");
        setLoading(false);
        return;
      }

      if (!brand || brand === "undefined" || brand === "unsupported") {
        toast.error("Bandeira de cartão não aceita. Tente outro cartão ou pague com Pix.");
        setLoading(false);
        return;
      }

      let tokenResp: { payment_token?: string; card_mask?: string };
      try {
        tokenResp = (await withTimeout(
          // @ts-ignore
          EfiPay.CreditCard
            .setAccount(payeeCode)
            .setEnvironment("production")
            .setCreditCardData({
              brand,
              number: cleanNumber,
              cvv,
              expirationMonth: mm,
              expirationYear: `20${yy}`,
              holderName: holder,
              holderDocument: cleanCpf,
              reuse: false,
            })
            .getPaymentToken(),
          20000,
          "getPaymentToken",
        )) as { payment_token?: string; card_mask?: string };
      } catch (err: any) {
        console.error("efi tokenize error", err);
        const msg = err?.error_description || err?.message || "Não foi possível validar o cartão.";
        if (typeof msg === "string" && msg.startsWith("timeout:")) {
          toast.error("A validação do cartão demorou demais. Tente novamente ou use Pix.");
        } else {
          toast.error(typeof msg === "string" ? msg : "Verifique os dados do cartão.");
        }
        setLoading(false);
        return;
      }

      if (!tokenResp?.payment_token) {
        toast.error("Não foi possível validar o cartão. Verifique os dados.");
        setLoading(false);
        return;
      }

      const result = await createCard({
        ...customer,
        payment_token: tokenResp.payment_token,
        installments,
        session_id: getSessionId(),
        product,
      });

      if (result.status === "paid") onPaid({ eventId: result.event_id_purchase, orderId: result.order_id });
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
      <Field label="Parcelas">
        <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className={inputCls}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="bg-black">{installmentLabel(n)}</option>
          ))}
        </select>
      </Field>

      <Button type="submit" disabled={loading} className="w-full h-12 mt-2 bg-[#8b3fdb] hover:bg-[#7530c0] text-white font-bold uppercase tracking-wide whitespace-normal h-auto py-3 font-gta text-lg">
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Pagar R$ {totalLabel}
      </Button>
      <p className="text-[11px] text-gray-500 text-center">Pagamento seguro processado pelo Banco Central do Brasil · Seus dados são criptografados</p>
    </form>
  );
};
