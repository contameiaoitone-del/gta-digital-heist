import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Zap } from "lucide-react";

interface SettingsResponse {
  active_pix_gateway: "efi" | "zzgate";
  zzgate_client_id: string;
  zzgate_client_secret_masked: string;
  zzgate_has_secret: boolean;
  webhook_url: string;
}

const PaymentCredentials = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [gateway, setGateway] = useState<"efi" | "zzgate">("efi");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    document.title = "Credenciais de Pagamento — Admin";
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase.functions.invoke("payment-settings", {
        method: "GET",
      });
      if (error) {
        toast.error("Erro ao carregar configurações");
        return;
      }
      const s = data as SettingsResponse;
      setData(s);
      setGateway(s.active_pix_gateway);
      setClientId(s.zzgate_client_id || "");
    })();
  }, [isAdmin]);

  const save = async () => {
    setBusy(true);
    const body: Record<string, unknown> = {
      active_pix_gateway: gateway,
      zzgate_client_id: clientId,
    };
    if (clientSecret.trim()) body.zzgate_client_secret = clientSecret.trim();
    const { error } = await supabase.functions.invoke("payment-settings?action=update", { body });
    setBusy(false);
    if (error) {
      toast.error("Erro ao salvar");
      return;
    }
    toast.success("Configurações salvas");
    setClientSecret("");
    // Refresh
    const { data: refreshed } = await supabase.functions.invoke("payment-settings", { method: "GET" });
    if (refreshed) setData(refreshed as SettingsResponse);
  };

  const testZzgate = async () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      toast.error("Preencha Client ID e Client Secret para testar");
      return;
    }
    setTesting(true);
    const { data, error } = await supabase.functions.invoke("payment-settings?action=test", {
      body: {
        gateway: "zzgate",
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
      },
    });
    setTesting(false);
    if (error) {
      toast.error("Falha no teste: " + error.message);
      return;
    }
    if ((data as { ok: boolean }).ok) toast.success("Conexão OK com a ZZGate");
    else toast.error("Credenciais ZZGate inválidas");
  };

  if (loading || !checkedAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/membros" replace />;

  const inputCls =
    "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

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
                  gateway === g
                    ? "border-[#00ff88] bg-[#00ff88]/5"
                    : "border-white/15 hover:border-white/40"
                }`}
              >
                <p className="font-bold">{g === "efi" ? "Efí Bank" : "ZZGate"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {g === "efi"
                    ? "Configuração via secrets do projeto (mTLS)"
                    : "Client ID + Secret editáveis abaixo"}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Credenciais ZZGate
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Obtenha no painel da ZZGate. O secret só é exibido uma vez — para alterá-lo, cole o novo valor e salve.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Client ID</label>
              <input
                className={inputCls}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="zzg_..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Client Secret{" "}
                {data?.zzgate_has_secret && (
                  <span className="text-gray-600">
                    (atual: {data.zzgate_client_secret_masked} — deixe em branco para manter)
                  </span>
                )}
              </label>
              <input
                className={inputCls}
                value={clientSecret}
                type="password"
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder={data?.zzgate_has_secret ? "•••••• (não alterar)" : "Cole o secret aqui"}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">URL de Webhook (postback)</label>
              <input
                className={inputCls + " font-mono"}
                value={data?.webhook_url || ""}
                readOnly
                onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
              />
              <p className="text-xs text-gray-500 mt-1">
                Cadastre essa URL no painel da ZZGate como destino dos webhooks (RECEIVEPIX).
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={testZzgate}
                disabled={testing}
                className="px-4 py-2 rounded border border-white/15 hover:border-[#00ff88] text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Testar conexão
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={busy}
            className="px-5 py-2.5 bg-[#00ff88] text-black rounded font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar configurações
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center">
          Cartão de crédito é sempre processado via Efí — esta página afeta apenas o Pix.
        </p>
      </div>
    </div>
  );
};

export default PaymentCredentials;