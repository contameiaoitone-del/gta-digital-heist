import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTracking, getSessionId } from "@/hooks/useTracking";
import { devSandbox, invokeIntl, type CheckoutGeo, type IntlMethod } from "@/lib/checkoutGeo";

// Checkout fora do Brasil (Xpag), sem Pix: México (OXXO, SPEI), Colômbia (Nequi, Bre-B), Chile (página de
// pagamento) e USDT (TRC20) em todos. O servidor define país, moeda, valor e métodos; aqui só se coleta e mostra.

type Geo = CheckoutGeo & Required<Pick<CheckoutGeo, "currency" | "amount" | "methods" | "lang">>;
type Step = "form" | "method" | "rut" | "pay" | "paid";
type Instructions =
  | { kind: "oxxo"; reference: string; barcode_url: string; checkout_url: string }
  | { kind: "spei"; clabe: string; bank: string; beneficiary: string; checkout_url: string }
  | { kind: "qr"; code: string; breb_key: string; checkout_url: string }
  | { kind: "redirect"; url: string }
  | { kind: "crypto"; address: string; network: string };
type Charge = { method: IntlMethod; currency: string; amount: number; price: number; expires_at: string | null; instructions: Instructions };

const LOCALE: Record<string, string> = { MXN: "es-MX", COP: "es-CO", CLP: "es-CL", USDT: "en-US" };
const money = (n: number, currency: string, exact = false) => {
  const d = currency === "COP" || currency === "CLP" ? 0 : 2;
  const f = new Intl.NumberFormat(LOCALE[currency] || "en-US", { minimumFractionDigits: exact ? 2 : d, maximumFractionDigits: exact ? 6 : d }).format(n);
  return `${currency === "USDT" ? "" : "$"}${f} ${currency}`;
};
const metaCurrency = (c: string) => (c === "USDT" ? "USD" : c); // Meta/TikTok não conhecem USDT

const T = {
  es: {
    title: "Finalizar compra", titlePay: "Realizar el pago",
    name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono / WhatsApp", rut: "RUT (ej. 12.345.678-5)",
    continue: "Continuar", back: "Atrás",
    errName: "Escribe tu nombre completo.", errEmail: "Correo inválido.", errPhone: "Teléfono inválido.",
    errPhoneCo: "Ingresa un celular colombiano válido (10 dígitos, empieza con 3).", errRut: "El RUT no es válido. Revísalo e intenta de nuevo.",
    errGeneric: "No pudimos generar el pago ahora. Intenta de nuevo en unos instantes.", errRate: "Demasiados intentos. Espera un minuto.",
    choose: "Elige cómo pagar", chooseHint: "Tu acceso se libera automáticamente al confirmarse el pago y te llega por correo.",
    methods: {
      OXXO: ["OXXO", "Efectivo en cualquier tienda OXXO"], SPEI: ["SPEI", "Transferencia bancaria"],
      NEQUI: ["Nequi", "Pago con QR"], BREB: ["Bre-B", "Pago con QR desde tu banco"],
      CHECKOUT: ["Pagar ahora", "Transferencia, tarjeta o billetera"], USDT: ["USDT", "Red TRON (TRC20)"],
    } as Record<IntlMethod, [string, string]>,
    generating: "Generando…", copy: "Copiar", copied: "¡Copiado!", waiting: "Esperando el pago…",
    closeHint: "Puedes cerrar esta ventana: tu acceso se activa solo y te lo enviamos por correo cuando recibamos el pago.",
    expiredT: "Este pago venció", expiredNew: "Generar uno nuevo", until: (d: string) => `Vigente hasta: ${d}`,
    oxxoTitle: "Paga en OXXO", oxxoHow: "Muestra esta referencia en caja y paga el monto exacto en cualquier tienda OXXO.", reference: "Referencia de pago", viewSlip: "Ver ficha de pago",
    speiTitle: "Paga por SPEI", speiHow: "Haz una transferencia SPEI por el monto exacto. Un monto distinto será devuelto.", clabe: "CLABE", bank: "Banco", beneficiary: "Beneficiario", amount: "Monto exacto",
    nequiTitle: "Paga con Nequi", nequiHow: "Abre Nequi, elige Pagar con QR y escanea este código.",
    brebTitle: "Paga con Bre-B", brebHow: "Escanea este QR con la app de tu banco o paga a la llave Bre-B.", brebKey: "Llave Bre-B", code: "Código de pago",
    clTitle: "Paga de forma segura", clHow: "Se abrirá la página de pago (transferencia, tarjeta o billetera). Cuando termines, vuelve aquí: tu acceso se activa solo.", clGo: "Ir a pagar",
    usdtTitle: "Paga con USDT", usdtHow: "Envía exactamente este monto en USDT por la red TRON (TRC20). Otra red o un monto distinto puede perderse.", address: "Dirección (TRC20)", network: "Red",
    paidT: "¡Pago confirmado!", paidS: "Liberando tu acceso…", simulate: "Simular pago (sandbox, solo local)",
  },
  en: {
    title: "Checkout", titlePay: "Complete your payment",
    name: "Full name", email: "Email", phone: "Phone / WhatsApp", rut: "ID",
    continue: "Continue", back: "Back",
    errName: "Enter your full name.", errEmail: "Invalid email.", errPhone: "Invalid phone number.",
    errPhoneCo: "Enter a valid phone number.", errRut: "Invalid ID.",
    errGeneric: "We couldn't create the payment right now. Please try again in a moment.", errRate: "Too many attempts. Please wait a minute.",
    choose: "Choose how to pay", chooseHint: "Your access is unlocked automatically once the payment is confirmed, and sent to your email.",
    methods: {
      OXXO: ["OXXO", "Cash"], SPEI: ["SPEI", "Bank transfer"], NEQUI: ["Nequi", "QR"], BREB: ["Bre-B", "QR"],
      CHECKOUT: ["Pay now", "Bank transfer, card or wallet"], USDT: ["USDT", "TRON network (TRC20)"],
    } as Record<IntlMethod, [string, string]>,
    generating: "Creating payment…", copy: "Copy", copied: "Copied!", waiting: "Waiting for payment…",
    closeHint: "You can close this window: your access unlocks automatically and we email it to you once the payment is received.",
    expiredT: "This payment expired", expiredNew: "Create a new one", until: (d: string) => `Valid until: ${d}`,
    oxxoTitle: "Pay at OXXO", oxxoHow: "", reference: "Payment reference", viewSlip: "View payment slip",
    speiTitle: "Pay by SPEI", speiHow: "", clabe: "CLABE", bank: "Bank", beneficiary: "Beneficiary", amount: "Exact amount",
    nequiTitle: "Pay with Nequi", nequiHow: "", brebTitle: "Pay with Bre-B", brebHow: "", brebKey: "Bre-B key", code: "Payment code",
    clTitle: "Pay securely", clHow: "", clGo: "Go to payment",
    usdtTitle: "Pay with USDT", usdtHow: "Send exactly this amount in USDT on the TRON network (TRC20). Another network or a different amount may be lost.", address: "Address (TRC20)", network: "Network",
    paidT: "Payment confirmed!", paidS: "Unlocking your access…", simulate: "Simulate payment (sandbox, local only)",
  },
};

const maskRut = (v: string) => {
  const s = v.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
  if (s.length <= 1) return s;
  return `${s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${s.slice(-1)}`;
};
const rutOk = (v: string) => {
  const s = v.replace(/[^0-9kK]/g, "").toUpperCase();
  if (s.length < 8 || s.length > 9) return false;
  let sum = 0, mul = 2;
  for (let i = s.length - 2; i >= 0; i--) { sum += Number(s[i]) * mul; mul = mul === 7 ? 2 : mul + 1; }
  const r = 11 - (sum % 11);
  return s.slice(-1) === (r === 11 ? "0" : r === 10 ? "K" : String(r));
};

const inputCls = "w-full h-11 rounded-md bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b3fdb] font-body";
const btnCls = "w-full h-12 flex items-center justify-center gap-2 rounded-md bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold uppercase tracking-wide font-gta text-lg disabled:opacity-50";

function CopyRow({ label, value, t, mono = true }: { label: string; value: string; t: { copy: string; copied: string }; mono?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-left">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <span className={`break-all text-sm text-white ${mono ? "font-mono" : ""}`}>{value.length > 64 ? `${value.slice(0, 30)}…${value.slice(-10)}` : value}</span>
        <button type="button" onClick={() => { navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1800); }}
          className="flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs text-white transition hover:bg-white/20">
          {done ? <Check className="h-3.5 w-3.5 text-[#00ff88]" /> : <Copy className="h-3.5 w-3.5" />} {done ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: string;
  productLabel: string;
  productSubtitle: string;
  geo: Geo;
}

export const IntlCheckoutModal = ({ open, onOpenChange, product, productLabel, productSubtitle, geo }: Props) => {
  const navigate = useNavigate();
  const { trackInitiateCheckout, saveLead } = useTracking();
  const t = T[geo.lang];
  const sandbox = devSandbox();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rut, setRut] = useState("");
  const [method, setMethod] = useState<IntlMethod | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [orderId, setOrderId] = useState("");
  const [eventId, setEventId] = useState("");
  const [charge, setCharge] = useState<Charge | null>(null);
  const [expired, setExpired] = useState(false);
  const icFired = useRef(false);

  const priceOf = (m: IntlMethod | null) => (m === "USDT" && geo.usdt ? geo.usdt : { currency: geo.currency, amount: geo.amount });
  const shown = priceOf(method);

  const reset = () => { setStep("form"); setMethod(null); setCharge(null); setErrors({}); setErr(""); setExpired(false); icFired.current = false; };
  const close = (v: boolean) => { if (!v) reset(); onOpenChange(v); };

  // InitiateCheckout assim que o modal abre (na moeda da oferta local).
  useEffect(() => {
    if (open && !icFired.current) {
      icFired.current = true;
      trackInitiateCheckout({ value: geo.amount, currency: metaCurrency(geo.currency) });
    }
  }, [open, geo.amount, geo.currency, trackInitiateCheckout]);

  // Confirmação: o servidor reconsulta a Xpag; aqui só se espera o status "paid" (a cada 5 s).
  useEffect(() => {
    if (step !== "pay" || !orderId) return;
    let stopped = false;
    const tick = async () => {
      const { data } = await invokeIntl("gta-xpag-check", { order_id: orderId });
      if (stopped) return;
      if (data?.status === "paid") {
        setStep("paid");
        const c = charge;
        setTimeout(() => {
          onOpenChange(false);
          navigate(`/obrigado?metodo=xpag&eventId=${encodeURIComponent(eventId)}&value=${c ? c.price : geo.amount}&currency=${metaCurrency(c ? c.currency : geo.currency)}&orderId=${encodeURIComponent(orderId)}&product=${encodeURIComponent(product)}`);
        }, 1200);
      } else if (data?.expired) setExpired(true);
    };
    const id = window.setInterval(tick, 5000);
    return () => { stopped = true; window.clearInterval(id); };
  }, [step, orderId, charge, eventId, geo.amount, geo.currency, navigate, onOpenChange, product]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = t.errName;
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email.trim())) next.email = t.errEmail;
    if (geo.region === "CO" ? !/^3\d{9}$/.test(digits) : digits.length < 8) next.phone = geo.region === "CO" ? t.errPhoneCo : t.errPhone;
    setErrors(next);
    if (Object.keys(next).length) return;
    saveLead({ name, email, phone, cpf: "" });
    if (geo.methods.length === 1) pick(geo.methods[0]); else setStep("method");
  };

  const create = async (m: IntlMethod, rutValue = "") => {
    setBusy(true); setErr(""); setExpired(false);
    const { data, error } = await invokeIntl("gta-xpag-create", {
      product, method: m, name: name.trim(), email: email.trim().toLowerCase(), phone, rut: rutValue || undefined, session_id: getSessionId(),
    });
    setBusy(false);
    if (error || !data?.intl) {
      let code = data?.error as string | undefined;
      if (!code && error) { try { code = (await (error as { context?: Response }).context?.json())?.error; } catch { /* noop */ } }
      setErr(code === "rut_invalid" ? t.errRut : code === "phone_invalid" ? t.errPhoneCo : code === "rate_limited" ? t.errRate : t.errGeneric);
      return;
    }
    setOrderId(data.order_id); setEventId(data.event_id_purchase || ""); setCharge(data.intl as Charge); setStep("pay");
  };
  const pick = (m: IntlMethod) => { setMethod(m); if (m === "CHECKOUT") setStep("rut"); else void create(m); };
  const startOver = () => { setStep(geo.methods.length === 1 ? "form" : "method"); setCharge(null); setExpired(false); };
  const simulate = async () => { await invokeIntl("gta-xpag-check", { action: "simulate", order_id: orderId }); };

  const ins = charge?.instructions;
  const until = charge?.expires_at ? new Date(charge.expires_at).toLocaleString(geo.lang === "es" ? "es-MX" : "en-US", { dateStyle: "medium", timeStyle: "short" }) : "";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md bg-black border-white/10 text-white max-h-[90vh] overflow-y-auto font-body">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {(step === "method" || step === "rut" || (step === "pay" && !expired)) ? (
              <button type="button" onClick={() => setStep(step === "rut" ? "method" : step === "pay" ? (geo.methods.length === 1 ? "form" : "method") : "form")} className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : <span className="w-5" />}
            <DialogTitle className="text-2xl flex-1 text-center font-gta tracking-wider">{step === "pay" || step === "paid" ? t.titlePay : t.title}</DialogTitle>
            <span className="w-5" />
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between bg-black border border-white/10 rounded-lg px-4 py-3 mb-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-gta">{productLabel}</p>
            <p className="text-sm text-gray-300">{productSubtitle}</p>
          </div>
          <p className="text-2xl font-bold font-gta tracking-wider text-right" style={{ color: "#00ff88" }}>{money(shown.amount, shown.currency)}</p>
        </div>

        {step === "form" && (
          <form onSubmit={submitForm} className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">{t.name}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
              {errors.name && <p className="text-xs text-[#ff2d78] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
              {errors.email && <p className="text-xs text-[#ff2d78] mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">{t.phone}</label>
              <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s()-]/g, ""))} className={inputCls} autoComplete="tel" />
              {errors.phone && <p className="text-xs text-[#ff2d78] mt-1">{errors.phone}</p>}
            </div>
            {err && <p className="text-xs text-[#ff2d78]">{err}</p>}
            <button type="submit" disabled={busy} className={btnCls}>{busy ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.generating}</> : t.continue}</button>
          </form>
        )}

        {step === "method" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 text-center">{t.chooseHint}</p>
            {geo.methods.map((m) => (
              <button key={m} type="button" onClick={() => pick(m)} disabled={busy}
                className="w-full rounded-lg border border-white/15 bg-black/40 hover:border-[#8b3fdb] px-4 py-3 text-left transition-colors disabled:opacity-60">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold font-gta tracking-wide text-lg">{t.methods[m][0]}</p>
                  <p className="text-sm font-semibold" style={{ color: "#00ff88" }}>{money(priceOf(m).amount, priceOf(m).currency)}</p>
                </div>
                <p className="text-xs text-gray-400">{t.methods[m][1]}</p>
              </button>
            ))}
            {busy && <p className="flex items-center justify-center gap-2 text-xs text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> {t.generating}</p>}
            {err && <p className="text-xs text-[#ff2d78] text-center">{err}</p>}
          </div>
        )}

        {step === "rut" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wider">{t.rut}</label>
              <input value={rut} onChange={(e) => setRut(maskRut(e.target.value))} className={inputCls} />
            </div>
            {err && <p className="text-xs text-[#ff2d78]">{err}</p>}
            <button type="button" onClick={() => void create("CHECKOUT", rut)} disabled={busy || !rutOk(rut)} className={btnCls}>
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.generating}</> : t.continue}
            </button>
          </div>
        )}

        {step === "pay" && charge && ins && (
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-300">
              {ins.kind === "oxxo" ? t.oxxoHow : ins.kind === "spei" ? t.speiHow : ins.kind === "redirect" ? t.clHow : ins.kind === "crypto" ? t.usdtHow : charge.method === "BREB" ? t.brebHow : t.nequiHow}
            </p>
            {expired ? (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 space-y-2">
                <p className="text-sm text-red-300">{t.expiredT}</p>
                <button type="button" onClick={startOver} className={btnCls}>{t.expiredNew}</button>
              </div>
            ) : (
              <>
                {ins.kind === "oxxo" && (
                  <>
                    <CopyRow label={t.reference} value={ins.reference} t={t} />
                    {ins.barcode_url && <div className="flex justify-center"><img src={ins.barcode_url} alt="" className="max-h-24 rounded-md bg-white p-2" /></div>}
                    {ins.checkout_url && <a href={ins.checkout_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-xs text-[#8b3fdb] hover:underline"><ExternalLink className="h-3 w-3" /> {t.viewSlip}</a>}
                  </>
                )}
                {ins.kind === "spei" && (
                  <>
                    <CopyRow label={t.clabe} value={ins.clabe} t={t} />
                    <CopyRow label={t.amount} value={String(charge.amount)} t={t} />
                    {ins.bank && <CopyRow label={t.bank} value={ins.bank} t={t} mono={false} />}
                    {ins.beneficiary && <CopyRow label={t.beneficiary} value={ins.beneficiary} t={t} mono={false} />}
                  </>
                )}
                {ins.kind === "qr" && (
                  <>
                    <div className="flex justify-center"><div className="rounded-lg bg-white p-3"><QRCodeSVG value={ins.code} size={190} level="M" /></div></div>
                    {ins.breb_key && <CopyRow label={t.brebKey} value={ins.breb_key} t={t} />}
                    <CopyRow label={t.code} value={ins.code} t={t} />
                  </>
                )}
                {ins.kind === "redirect" && (
                  <button type="button" onClick={() => window.open(ins.url, "_blank", "noopener,noreferrer")} className={btnCls}><ExternalLink className="h-5 w-5" /> {t.clGo}</button>
                )}
                {ins.kind === "crypto" && (
                  <>
                    <div className="flex justify-center"><div className="rounded-lg bg-white p-3"><QRCodeSVG value={ins.address} size={170} level="M" /></div></div>
                    <CopyRow label={t.amount} value={new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(charge.amount).replace(/,/g, "")} t={t} />
                    <CopyRow label={t.address} value={ins.address} t={t} />
                    <p className="text-xs text-gray-500">{t.network}: {ins.network}</p>
                  </>
                )}
                <p className="text-sm font-semibold">{money(charge.amount, charge.currency, ins.kind === "crypto")}</p>
                {until && <p className="text-xs text-gray-500">{t.until(until)}</p>}
                <p className="flex items-center justify-center gap-2 text-xs text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> {t.waiting}</p>
                <p className="text-[11px] leading-snug text-gray-500">{t.closeHint}</p>
                {sandbox && <button type="button" onClick={simulate} className="w-full rounded-md border border-dashed border-yellow-400/50 py-2 text-xs text-yellow-300">{t.simulate}</button>}
              </>
            )}
          </div>
        )}

        {step === "paid" && (
          <div className="text-center py-4">
            <Check className="mx-auto mb-3 h-12 w-12 text-[#00ff88]" />
            <h2 className="mb-1 text-2xl font-gta tracking-wider">{t.paidT}</h2>
            <p className="text-sm text-gray-400">{t.paidS}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
