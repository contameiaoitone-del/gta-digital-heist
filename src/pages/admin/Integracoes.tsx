import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Pencil,
  Save,
  X,
  Trash2,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Dices,
} from "lucide-react";

type EventKey = "initiate_checkout" | "purchase" | "lead";

const EVENT_LABELS: Record<EventKey, string> = {
  initiate_checkout: "InitiateCheckout",
  purchase: "Purchase",
  lead: "Lead",
};

// orders.product já codifica a rota/landing page de origem da venda.
const ROUTE_OPTIONS = [
  { value: "", label: "Todas as rotas" },
  { value: "lp2", label: "/lp2 (R$ 147)" },
  { value: "lp2_97", label: "/lp97-vsl (R$ 97)" },
  { value: "lp2_5", label: "/lp2-5 (R$ 5)" },
  { value: "treinamento", label: "/lp1 · treinamento" },
];

interface IntegrationRow {
  id: string;
  name: string;
  target_url: string;
  events: EventKey[];
  product: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  secret_masked: string;
  has_secret: boolean;
  api_key_masked: string;
  has_api_key: boolean;
}

interface DeliveryRow {
  id: string;
  integration_id: string;
  order_id: string | null;
  event: string;
  response_status: number | null;
  magic_link: string | null;
  error: string | null;
  created_at: string;
}

const inputCls =
  "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

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
        <p className="text-[11px] text-gray-600 mt-1">Atual: {currentMask} — deixe em branco para manter o valor.</p>
      )}
    </div>
  );
}

function EventCheckboxes({ value, onChange }: { value: EventKey[]; onChange: (v: EventKey[]) => void }) {
  const toggle = (k: EventKey) => onChange(value.includes(k) ? value.filter((x) => x !== k) : [...value, k]);
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {(Object.keys(EVENT_LABELS) as EventKey[]).map((k) => (
          <label key={k} className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={value.includes(k)} onChange={() => toggle(k)} className="accent-[#00ff88]" />
            {EVENT_LABELS[k]}
          </label>
        ))}
      </div>
      <p className="text-[11px] text-gray-600 mt-1">
        Hoje apenas <b className="text-gray-400">Purchase</b> dispara o webhook. Lead e InitiateCheckout ficam salvos, mas
        ainda não acionam nada.
      </p>
    </div>
  );
}

const emptyForm = { name: "", targetUrl: "", secret: "", apiKey: "", events: ["purchase"] as EventKey[], product: "", active: true };

function randomEventId(): string {
  return `test-${Math.random().toString(36).slice(2, 10)}`;
}

const emptyTestParams = {
  email: "teste@example.com",
  name: "Teste Integração",
  phone: "",
  amountReais: "1,00",
  eventId: "",
};

interface TestResult {
  ok: boolean;
  status?: number | null;
  response?: unknown;
  error?: string;
  sent?: unknown;
}

function IntegrationForm({
  initial,
  onCancel,
  onSaved,
  has_secret,
  secret_masked,
  has_api_key,
  api_key_masked,
}: {
  initial: typeof emptyForm & { id?: string };
  onCancel?: () => void;
  onSaved: () => void;
  has_secret?: boolean;
  secret_masked?: string;
  has_api_key?: boolean;
  api_key_masked?: string;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testParams, setTestParams] = useState(emptyTestParams);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const save = async () => {
    if (!form.name.trim()) return toast.error("Informe um nome");
    if (!form.targetUrl.trim()) return toast.error("Informe a URL de destino");
    setSaving(true);
    const body: Record<string, unknown> = {
      name: form.name.trim(),
      target_url: form.targetUrl.trim(),
      events: form.events,
      product: form.product || null,
      active: form.active,
    };
    if (form.secret.trim()) body.secret = form.secret.trim();
    if (form.apiKey.trim()) body.api_key = form.apiKey.trim();
    const action = initial.id ? "update" : "create";
    if (initial.id) body.id = initial.id;
    const { error } = await supabase.functions.invoke(`integrations?action=${action}`, { body });
    setSaving(false);
    if (error) return toast.error("Erro ao salvar: " + error.message);
    toast.success(initial.id ? "Integração atualizada" : "Integração cadastrada");
    onSaved();
  };

  const test = async () => {
    if (!testParams.email.trim()) return toast.error("Informe um e-mail de teste");
    const amountCents = Math.round((parseFloat(testParams.amountReais.replace(",", ".")) || 0) * 100);
    setTesting(true);
    setTestResult(null);
    const { data, error } = await supabase.functions.invoke("integrations?action=test", {
      body: {
        id: initial.id,
        target_url: form.targetUrl.trim() || undefined,
        secret: form.secret.trim() || undefined,
        api_key: form.apiKey.trim() || undefined,
        sample_email: testParams.email.trim(),
        sample_name: testParams.name.trim() || undefined,
        sample_phone: testParams.phone.trim() || undefined,
        sample_amount: amountCents,
        sample_event_id: testParams.eventId.trim() || undefined,
      },
    });
    setTesting(false);
    if (error) return toast.error("Falha ao testar: " + error.message);
    const r = data as TestResult;
    setTestResult(r);
    if (r.ok) {
      const magic = (r.response as { magic_link?: string } | undefined)?.magic_link;
      toast.success(`Teste OK — HTTP ${r.status}${magic ? " · magic_link recebido" : ""}`);
    } else {
      toast.error(`Teste falhou — ${r.status ? `HTTP ${r.status}` : r.error}`);
    }
  };

  return (
    <div className="space-y-3 border border-white/10 rounded p-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nome</label>
          <input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="ex.: ZZFUNNELS" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Rota / landing page</label>
          <select
            className={inputCls}
            value={form.product}
            onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
          >
            {ROUTE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">URL de destino</label>
        <input
          className={inputCls}
          value={form.targetUrl}
          onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))}
          placeholder="https://.../functions/v1/purchase-webhook?t=..."
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">x-webhook-secret</label>
          <SecretInput
            value={form.secret}
            onChange={(v) => setForm((f) => ({ ...f, secret: v }))}
            hasCurrent={has_secret}
            currentMask={secret_masked}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">apikey / Authorization (JWT)</label>
          <SecretInput
            value={form.apiKey}
            onChange={(v) => setForm((f) => ({ ...f, apiKey: v }))}
            hasCurrent={has_api_key}
            currentMask={api_key_masked}
          />
          <p className="text-[11px] text-gray-600 mt-1">Cole só o JWT — TAB e prefixo "Bearer" são removidos automaticamente.</p>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Eventos habilitados</label>
        <EventCheckboxes value={form.events} onChange={(v) => setForm((f) => ({ ...f, events: v }))} />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="accent-[#00ff88]" />
        Ativa
      </label>

      <div className="border border-white/10 rounded">
        <button
          type="button"
          onClick={() => setTestOpen((o) => !o)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-400 hover:text-white"
        >
          {testOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          Parâmetros do teste
        </button>
        {testOpen && (
          <div className="px-3 pb-3 space-y-2">
            <p className="text-[11px] text-gray-600">
              Body enviado no teste: só estes campos, sem produto — igual ao que uma compra real dispara.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">E-mail</label>
                <input
                  className={inputCls}
                  value={testParams.email}
                  onChange={(e) => setTestParams((p) => ({ ...p, email: e.target.value }))}
                  placeholder="teste@example.com"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Nome</label>
                <input
                  className={inputCls}
                  value={testParams.name}
                  onChange={(e) => setTestParams((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Telefone</label>
                <input
                  className={inputCls}
                  value={testParams.phone}
                  onChange={(e) => setTestParams((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="(opcional)"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Valor (R$)</label>
                <input
                  className={inputCls}
                  value={testParams.amountReais}
                  onChange={(e) => setTestParams((p) => ({ ...p, amountReais: e.target.value }))}
                  placeholder="1,00"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                event_id — deixe em branco para um aleatório, ou repita um valor para validar idempotência
                (o mesmo event_id 2x deve responder "already_processed")
              </label>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={testParams.eventId}
                  onChange={(e) => setTestParams((p) => ({ ...p, eventId: e.target.value }))}
                  placeholder="(aleatório)"
                />
                <button
                  type="button"
                  onClick={() => setTestParams((p) => ({ ...p, eventId: randomEventId() }))}
                  title="Gerar novo event_id"
                  className="px-3 rounded border border-white/15 text-gray-300 hover:text-white hover:border-[#00ff88]"
                >
                  <Dices className="h-4 w-4" />
                </button>
              </div>
            </div>

            {testResult && (
              <div className="mt-2 rounded border border-white/10 bg-black/40 p-3 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  {testResult.ok ? <CheckCircle2 className="h-4 w-4 text-[#00ff88]" /> : <XCircle className="h-4 w-4 text-[#ff2d78]" />}
                  <span className="font-semibold">{testResult.status ? `HTTP ${testResult.status}` : testResult.error || "sem resposta"}</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-1">Enviado:</p>
                <pre className="whitespace-pre-wrap break-all text-gray-400 mb-2">{JSON.stringify(testResult.sent, null, 2)}</pre>
                <p className="text-[11px] text-gray-500 mb-1">Resposta:</p>
                <pre className="whitespace-pre-wrap break-all text-gray-300">{JSON.stringify(testResult.response ?? testResult.error, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!testOpen) setTestOpen(true);
            void test();
          }}
          disabled={testing}
          className="px-4 py-2 rounded border border-white/15 hover:border-[#00ff88] text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} Testar
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-4 py-2 rounded border border-white/15 text-gray-300 hover:text-white text-sm flex items-center gap-2">
            <X className="h-4 w-4" /> Cancelar
          </button>
        )}
        <button onClick={save} disabled={saving} className="ml-auto px-5 py-2 bg-[#00ff88] text-black rounded font-bold flex items-center gap-2 text-sm disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
        </button>
      </div>
    </div>
  );
}

function IntegrationsManager() {
  const [items, setItems] = useState<IntegrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("integrations?action=list", { method: "GET" });
    if (error) toast.error("Erro ao carregar integrações: " + error.message);
    setItems((data as IntegrationRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleActive = async (it: IntegrationRow) => {
    const { error } = await supabase.functions.invoke("integrations?action=update", {
      body: { id: it.id, active: !it.active },
    });
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (it: IntegrationRow) => {
    if (!confirm(`Excluir a integração "${it.name}"?`)) return;
    const { error } = await supabase.functions.invoke("integrations?action=delete", { body: { id: it.id } });
    if (error) return toast.error(error.message);
    toast.success("Integração excluída");
    load();
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">
        Cada integração dispara um POST no formato de webhook de compra (ex.: ZZFUNNELS) sempre que um pedido é confirmado
        pago via Pix (Efí/ZZGate). Cartão via InfinitePay não passa por aqui hoje.
      </p>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="mb-4 flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black font-bold rounded text-sm"
        >
          <Plus className="h-4 w-4" /> Nova integração
        </button>
      )}
      {adding && (
        <div className="mb-5">
          <IntegrationForm
            initial={emptyForm}
            onCancel={() => setAdding(false)}
            onSaved={() => {
              setAdding(false);
              load();
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-500">Nenhuma integração cadastrada.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) =>
            editingId === it.id ? (
              <li key={it.id}>
                <IntegrationForm
                  initial={{
                    id: it.id,
                    name: it.name,
                    targetUrl: it.target_url,
                    secret: "",
                    apiKey: "",
                    events: it.events,
                    product: it.product || "",
                    active: it.active,
                  }}
                  has_secret={it.has_secret}
                  secret_masked={it.secret_masked}
                  has_api_key={it.has_api_key}
                  api_key_masked={it.api_key_masked}
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null);
                    load();
                  }}
                />
              </li>
            ) : (
              <li key={it.id} className="border border-white/10 rounded p-3">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{it.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${it.active ? "bg-[#00ff88]/20 text-[#00ff88]" : "bg-white/10 text-gray-400"}`}>
                        {it.active ? "ATIVA" : "INATIVA"}
                      </span>
                      {it.events.map((e) => (
                        <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">
                          {EVENT_LABELS[e]}
                        </span>
                      ))}
                      {it.product && <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">{it.product}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 break-all">{it.target_url}</p>
                    <p className="text-[11px] text-gray-600 mt-1">
                      secret: {it.has_secret ? it.secret_masked : <i>não informado</i>} · apikey:{" "}
                      {it.has_api_key ? it.api_key_masked : <i>não informado</i>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(it)} className="text-xs px-2 py-1 rounded border border-white/15 text-gray-300 hover:text-white">
                      {it.active ? "Desativar" : "Ativar"}
                    </button>
                    <button onClick={() => setEditingId(it.id)} className="text-xs px-2 py-1 rounded border border-white/15 text-gray-300 hover:text-white inline-flex items-center gap-1">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button onClick={() => remove(it)} className="p-2 text-gray-400 hover:text-[#ff2d78]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function DeliveriesLog() {
  const [rows, setRows] = useState<DeliveryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("integrations?action=deliveries", { method: "GET" });
    if (error) toast.error("Erro ao carregar entregas: " + error.message);
    setRows((data as DeliveryRow[]) || []);
    setLoading(false);
  };

  const retry = async (r: DeliveryRow) => {
    setRetrying(r.id);
    const { data, error } = await supabase.functions.invoke("integrations?action=retry", {
      body: { delivery_id: r.id },
    });
    setRetrying(null);
    if (error) return toast.error("Erro ao reenviar: " + error.message);
    const res = data as { ok: boolean; status?: number | null; error?: string | null };
    if (res.status && res.status < 400) toast.success(`Reenviado — HTTP ${res.status}`);
    else toast.error(`Falhou de novo — ${res.error || res.status || "erro"}`);
    load();
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-3">
        <p className="text-xs text-gray-500">Últimas 200 tentativas de disparo, mais recentes primeiro.</p>
        <button
          onClick={load}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider bg-[#00ff88] text-black hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-xs text-gray-500">Nenhuma entrega registrada ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-white/10">
          <table className="w-full text-xs">
            <thead className="bg-white/5 text-left uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-3 py-2">Quando</th>
                <th className="px-3 py-2">Evento</th>
                <th className="px-3 py-2">Pedido</th>
                <th className="px-3 py-2">OK</th>
                <th className="px-3 py-2">HTTP</th>
                <th className="px-3 py-2">Magic link</th>
                <th className="px-3 py-2">Erro</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const failed = !r.response_status || r.response_status >= 400;
                return (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2">{r.event}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-gray-400" title={r.order_id || ""}>
                      {r.order_id?.slice(0, 8) || "-"}
                    </td>
                    <td className="px-3 py-2">
                      {!failed ? <CheckCircle2 className="h-4 w-4 text-[#00ff88]" /> : <XCircle className="h-4 w-4 text-[#ff2d78]" />}
                    </td>
                    <td className="px-3 py-2">{r.response_status ?? "-"}</td>
                    <td className="px-3 py-2 max-w-[240px] truncate">
                      {r.magic_link ? (
                        <a href={r.magic_link} target="_blank" rel="noreferrer" className="text-[#00ff88] hover:underline">
                          abrir
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 text-[#ff2d78] max-w-xs truncate" title={r.error || ""}>
                      {r.error || ""}
                    </td>
                    <td className="px-3 py-2">
                      {failed && (
                        <button
                          onClick={() => retry(r)}
                          disabled={retrying === r.id}
                          className="text-[11px] px-2 py-1 rounded border border-white/15 text-gray-300 hover:text-white hover:border-[#00ff88] disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {retrying === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} Reenviar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Integracoes = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const { product = "treinamento" } = useParams<{ product?: string }>();
  const productPath = `/${encodeURIComponent(product)}`;

  useEffect(() => {
    document.title = "Integração — Admin";
  }, []);

  if (loading || !checkedAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to={`${productPath}/membros`} replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`${productPath}/admin`} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            ADMIN <span style={{ color: "#00ff88" }}>· Integração</span>
          </h1>
        </div>
      </header>
      <div className="max-w-[1100px] mx-auto px-4 py-6 space-y-6">
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Webhooks de compra
          </h2>
          <IntegrationsManager />
        </section>
        <section className="border border-white/10 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Entregas
          </h2>
          <DeliveriesLog />
        </section>
      </div>
    </div>
  );
};

export default Integracoes;
