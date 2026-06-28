import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSignOut } from "@/hooks/useAuth";
import { Loader2, LogOut, Plus, Lock, Ban, Eye, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Master {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_super_admin: boolean;
  areas: { id: string; name: string }[];
}

export default function SuperHome() {
  const signOut = useSignOut();
  const [loading, setLoading] = useState(true);
  const [masters, setMasters] = useState<Master[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showPwd, setShowPwd] = useState<Master | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("super-admin-list-masters");
    if (error) toast.error(error.message);
    else setMasters((data as { masters: Master[] }).masters || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (m: Master) => {
    setBusyId(m.id);
    const { error } = await supabase.functions.invoke("super-admin-toggle-master", {
      body: { user_id: m.id, block: !m.banned_until },
    });
    setBusyId(null);
    if (error) toast.error(error.message);
    else {
      toast.success(m.banned_until ? "Desbloqueado" : "Bloqueado");
      load();
    }
  };

  const impersonate = async (m: Master) => {
    setBusyId(m.id);
    const { data, error } = await supabase.functions.invoke("super-admin-impersonate", {
      body: { user_id: m.id, redirect_to: "/home" },
    });
    setBusyId(null);
    if (error || !data?.action_link) {
      toast.error(error?.message || "Falha ao gerar acesso");
      return;
    }
    localStorage.setItem("impersonator_email", data.impersonator_email || "super_admin");
    window.open(data.action_link, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-body">
      <header className="h-14 flex items-center justify-between border-b border-white/10 px-5 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#d95e10]" />
          <span className="font-gta text-lg tracking-wide">Super Admin</span>
        </div>
        <button onClick={signOut} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
          <LogOut className="h-3.5 w-3.5" /> Sair
        </button>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-gta text-2xl">Administradores Master</h1>
            <p className="text-xs text-gray-400">Gerencie todos os administradores master da plataforma.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#d95e10] hover:bg-[#b54e0d] text-white text-sm font-semibold rounded px-3 py-2"
          >
            <Plus className="h-4 w-4" /> Novo Master
          </button>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Áreas</th>
                <th className="text-left p-3">Último login</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="h-5 w-5 animate-spin inline" />
                  </td>
                </tr>
              ) : masters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum master cadastrado.
                  </td>
                </tr>
              ) : (
                masters.map((m) => (
                  <tr key={m.id} className="border-t border-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {m.email}
                        {m.is_super_admin && (
                          <span className="text-[9px] uppercase rounded bg-[#d95e10]/20 text-[#d95e10] px-1.5 py-0.5">
                            super
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                      {m.areas.length === 0 ? "—" : m.areas.map((a) => a.name).join(", ")}
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                      {m.last_sign_in_at ? new Date(m.last_sign_in_at).toLocaleString("pt-BR") : "Nunca"}
                    </td>
                    <td className="p-3">
                      {m.banned_until ? (
                        <span className="text-[10px] uppercase rounded bg-red-500/15 text-red-400 px-2 py-0.5">Bloqueado</span>
                      ) : (
                        <span className="text-[10px] uppercase rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5">Ativo</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Acessar conta"
                          disabled={busyId === m.id || !!m.banned_until}
                          onClick={() => impersonate(m)}
                          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Alterar senha"
                          disabled={busyId === m.id}
                          onClick={() => setShowPwd(m)}
                          className="p-1.5 rounded hover:bg-white/10"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {!m.is_super_admin && (
                          <button
                            title={m.banned_until ? "Desbloquear" : "Bloquear"}
                            disabled={busyId === m.id}
                            onClick={() => toggleBlock(m)}
                            className="p-1.5 rounded hover:bg-white/10 text-red-400"
                          >
                            {m.banned_until ? <Lock className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showCreate && <CreateMasterModal onClose={() => setShowCreate(false)} onCreated={load} />}
      {showPwd && <PasswordModal master={showPwd} onClose={() => setShowPwd(null)} />}
    </div>
  );
}

function CreateMasterModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.functions.invoke("super-admin-create-master", {
      body: { email, password, full_name: fullName || null },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Master criado");
    onCreated();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0a0a] p-5 space-y-3"
      >
        <h2 className="font-gta text-lg">Novo administrador master</h2>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Nome (opcional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Senha (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="text-xs px-3 py-2 text-gray-400 hover:text-white">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-xs px-3 py-2 rounded bg-[#d95e10] text-white font-semibold flex items-center gap-2"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />} Criar
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordModal({ master, onClose }: { master: Master; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.functions.invoke("super-admin-update-master-password", {
      body: { user_id: master.id, password },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha alterada");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0a0a] p-5 space-y-3"
      >
        <h2 className="font-gta text-lg">Alterar senha</h2>
        <p className="text-xs text-gray-400">{master.email}</p>
        <input
          required
          type="password"
          minLength={6}
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="text-xs px-3 py-2 text-gray-400 hover:text-white">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-xs px-3 py-2 rounded bg-[#d95e10] text-white font-semibold flex items-center gap-2"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />} Salvar
          </button>
        </div>
      </form>
    </div>
  );
}