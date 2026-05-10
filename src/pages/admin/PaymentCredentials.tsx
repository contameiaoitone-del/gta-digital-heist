import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2, Save, Zap } from "lucide-react";

interface SettingsResponse {
  active_pix_gateway: "efi" | "zzgate";
  zzgate_client_id: string;
  zzgate_client_secret_masked: string;
  zzgate_has_secret: boolean;
  efi_client_id: string;
  efi_client_secret_masked: string;
  efi_has_secret: boolean;
  efi_pix_key: string;
  efi_payee_code: string;
  efi_has_cert: boolean;
  efi_has_key: boolean;
}

const inputCls =
  "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

const taCls =
  "w-full min-h-[120px] rounded bg-black/40 border border-white/15 px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-xs font-mono";

function SecretInput({
  value,
  onChange,
  placeholder,
  hasCurrent,
  currentMask,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasCurrent?: boolean;
  currentMask?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <input
          className={inputCls + " pr-10"}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (hasCurrent ? "•••••• (deixe em branco para manter)" : "")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
          aria-label={show ? "Ocultar" : "Mostrar"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hasCurrent && (
        <p className="text-[11px] text-gray-600 mt-1">
          Atual: {currentMask} — deixe em branco para manter o valor.
        </p>
      )}
    </div>
  );
}

const PaymentCredentials = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [gateway, setGateway] = useState<"efi" | "zzgate">("efi");

  // ZZGate
  const [zzClientId, setZzClientId] = useState("");
  const [zzClientSecret, setZzClientSecret] = useState("");

  // Efí
  const [efiClientId, setEfiClientId] = useState("");
  const [efiClientSecret, setEfiClientSecret] = useState("");
  const [efiPixKey, setEfiPixKey] = useState("");
  const [efiPayee, setEfiPayee] = useState("");
  const [efiCert, setEfiCert] = useState("");
  const [efiKey, setEfiKey] = useState("");

  const [savingEfi, setSavingEfi] = useState(false);
  const [savingZz, setSavingZz] = useState(false);
  const [testingZz, setTestingZz] = useState(false);
  const [testingEfi, setTestingEfi] = useState(false);

  const refresh = async () => {
    const { data, error } = await supabase.functions.invoke("payment-settings", { method: "GET" });
    if (error) {
      toast.error("Erro ao carregar configurações");
      return;
    }
    const s = data as SettingsResponse;
    setData(s);
    setGateway(s.active_pix_gateway);
    setZzClientId(s.zzgate_client_id || "");
    setEfiClientId(s.efi_client_id || "");
    setEfiPixKey(s.efi_pix_key || "");
    setEfiPayee(s.efi_payee_code || "");
  };

  useEffect(() => {
    document.title = "Credenciais de Pagamento — Admin";
    if (!isAdmin) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const saveGateway = async () => {
    const { error } = await supabase.functions.invoke("payment-settings?action=update", {
      body: { active_pix_gateway: gateway },
    });
    if (error) toast.error("Erro ao salvar gateway");
    else toast.success("Gateway atualizado");
  };

  const saveEfi = async () => {
    setSavingEfi(true);
    const body: Record<string, unknown> = {
      efi_client_id: efiClientId,
      efi_pix_key: efiPixKey,
      efi_payee_code: efiPayee,
    };
    if (efiClientSecret.trim()) body.efi_client_secret = efiClientSecret.trim();
    if (efiCert.trim()) body.efi_cert_pem = efiCert.trim();
    if (efiKey.trim()) body.efi_key_pem = efiKey.trim();
    const { error } = await supabase.functions.invoke("payment-settings?action=update", { body });
    setSavingEfi(false);
    if (error) return toast.error("Erro ao salvar credenciais Efí");
    toast.success("Credenciais Efí salvas");
    setEfiClientSecret("");
    setEfiCert("");
    setEfiKey("");
    await refresh();
  };

  const saveZz = async () => {
    setSavingZz(true);
    const body: Record<string, unknown> = { zzgate_client_id: zzClientId };
    if (zzClientSecret.trim()) body.zzgate_client_secret = zzClientSecret.trim();
    const { error } = await supabase.functions.invoke("payment-settings?action=update", { body });
    setSavingZz(false);
    if (error) return toast.error("Erro ao salvar credenciais ZZGate");
    toast.success("Credenciais ZZGate salvas");
    setZzClientSecret("");
    await refresh();
  };

  const testZzgate = async () => {
    if (!zzClientId.trim() || !zzClientSecret.trim()) {
      toast.error("Preencha Client ID e Client Secret para testar");
      return;
    }
    setTestingZz(true);
    const { data, error } = await supabase.functions.invoke("payment-settings?action=test", {
      body: {
        gateway: "zzgate",
        client_id: zzClientId.trim(),
        client_secret: zzClientSecret.trim(),
      },
    });
    setTestingZz(false);
    if (error) return toast.error("Falha no teste: " + error.message);
    if ((data as { ok: boolean }).ok) toast.success("Conexão OK com a ZZGate");
    else toast.error("Credenciais ZZGate inválidas");
  };

  const testEfi = async () => {
    setTestingEfi(true);
    const body: Record<string, unknown> = { gateway: "efi" };
    if (efiClientId.trim() && efiClientSecret.trim()) {
      body.client_id = efiClientId.trim();
      body.client_secret = efiClientSecret.trim();
    }
    const { data, error } = await supabase.functions.invoke("payment-settings?action=test", { body });
    setTestingEfi(false);
    if (error) return toast.error("Falha no teste: " + error.message);
    if ((data as { ok: boolean }).ok) toast.success("Conexão OK com a Efí Bank");
    else toast.error("Credenciais Efí inválidas (ou cert/chave ausente)");
  };

  if (loading || !checkedAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/membros" replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/admin" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            ADMIN <span style={{ color: "#00ff88" }}>· Credenciais de Pagamento</span>
          </h1>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 py-6 space-y-6">
        {/* Gateway picker */}
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Gateway do Pix
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Defina qual gateway será usado para gerar QR Codes Pix. Pagamentos com cartão continuam sempre via Efí.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(["efi", "zzgate"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGateway(g)}
                className={`text-left p-4 rounded-lg border transition ${
                  gateway === g ? "border-[#00ff88] bg-[#00ff88]/5" : "border-white/15 hover:border-white/40"
                }`}
              >
                <p className="font-bold">{g === "efi" ? "Efí Bank" : "ZZGate"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {g === "efi" ? "Pix via Efí (mTLS)" : "Pix via ZZGate (OAuth Bearer)"}
                </p>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={saveGateway}
              className="px-4 py-2 bg-[#00ff88] text-black rounded font-bold flex items-center gap-2 text-sm"
            >
              <Save className="h-4 w-4" /> Salvar gateway
            </button>
          </div>
        </section>

        {/* Efí credentials */}
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Credenciais Efí Bank
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Usado para Pix (quando Efí for o gateway ativo) e sempre para cartão de crédito. Os secrets só são exibidos
            mascarados — para alterar, cole o novo valor.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Client ID</label>
              <input className={inputCls} value={efiClientId} onChange={(e) => setEfiClientId(e.target.value)} placeholder="Client_Id_..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Client Secret</label>
              <SecretInput
                value={efiClientSecret}
                onChange={setEfiClientSecret}
                hasCurrent={data?.efi_has_secret}
                currentMask={data?.efi_client_secret_masked}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Chave Pix</label>
                <input className={inputCls} value={efiPixKey} onChange={(e) => setEfiPixKey(e.target.value)} placeholder="email / cpf / aleatória" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Código do Recebedor (CNPJ)</label>
                <input className={inputCls} value={efiPayee} onChange={(e) => setEfiPayee(e.target.value)} placeholder="00000000000000" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Certificado (.pem){" "}
                {data?.efi_has_cert && <span className="text-gray-600">(atual configurado — deixe em branco para manter)</span>}
              </label>
              <textarea
                className={taCls}
                value={efiCert}
                onChange={(e) => setEfiCert(e.target.value)}
                placeholder={data?.efi_has_cert ? "•••••• (não alterar)" : "-----BEGIN CERTIFICATE-----\n..."}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Chave Privada (.pem){" "}
                {data?.efi_has_key && <span className="text-gray-600">(atual configurada — deixe em branco para manter)</span>}
              </label>
              <textarea
                className={taCls}
                value={efiKey}
                onChange={(e) => setEfiKey(e.target.value)}
                placeholder={data?.efi_has_key ? "•••••• (não alterar)" : "-----BEGIN PRIVATE KEY-----\n..."}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={testEfi}
                disabled={testingEfi}
                className="px-4 py-2 rounded border border-white/15 hover:border-[#00ff88] text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {testingEfi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Testar conexão
              </button>
              <button
                onClick={saveEfi}
                disabled={savingEfi}
                className="ml-auto px-5 py-2 bg-[#00ff88] text-black rounded font-bold flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {savingEfi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar credenciais Efí
              </button>
            </div>
          </div>
        </section>

        {/* ZZGate credentials */}
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Credenciais ZZGate
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Obtenha no painel da ZZGate. A URL de postback é enviada automaticamente em cada cobrança — não é
            necessário cadastrar webhook no painel da ZZGate.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Client ID</label>
              <input
                className={inputCls}
                value={zzClientId}
                onChange={(e) => setZzClientId(e.target.value)}
                placeholder="zzg_..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Client Secret</label>
              <SecretInput
                value={zzClientSecret}
                onChange={setZzClientSecret}
                hasCurrent={data?.zzgate_has_secret}
                currentMask={data?.zzgate_client_secret_masked}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={testZzgate}
                disabled={testingZz}
                className="px-4 py-2 rounded border border-white/15 hover:border-[#00ff88] text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {testingZz ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Testar conexão
              </button>
              <button
                onClick={saveZz}
                disabled={savingZz}
                className="ml-auto px-5 py-2 bg-[#00ff88] text-black rounded font-bold flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {savingZz ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar credenciais ZZGate
              </button>
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-600 text-center">
          Cartão de crédito é sempre processado via Efí — o seletor acima afeta apenas o Pix.
        </p>
      </div>
    </div>
  );
};

export default PaymentCredentials;
