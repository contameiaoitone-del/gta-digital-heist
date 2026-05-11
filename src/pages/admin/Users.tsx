import { useEffect, useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2, KeyRound, Shield, ShieldOff, Check, X, UserPlus, Fingerprint } from "lucide-react";

interface AdminUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: string[];
  access: { product: string; active: boolean }[];
}

const Users = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [busy, setBusy] = useState(false);
  const [pwUserId, setPwUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [cAdmin, setCAdmin] = useState(false);
  const [cTrein, setCTrein] = useState(true);
  const [cMent, setCMent] = useState(false);
  const [creating, setCreating] = useState(false);

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body });
    if (error) {
      toast.error(error.message);
      return null;
    }
    if ((data as { error?: string })?.error) {
      toast.error((data as { error: string }).error);
      return null;
    }
    return data;
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await call({ action: "list" });
    setBusy(false);
    if (res) setUsers((res as { users: AdminUser[] }).users);
  }, [call]);

  useEffect(() => {
    document.title = "Admin · Usuários";
    if (isAdmin) load();
  }, [isAdmin, load]);

  const toggleAdmin = async (u: AdminUser) => {
    const isCurrentlyAdmin = u.roles.includes("admin");
    if (!confirm(isCurrentlyAdmin ? `Remover admin de ${u.email}?` : `Tornar ${u.email} admin?`)) return;
    const r = await call({ action: "set_admin", user_id: u.id, is_admin: !isCurrentlyAdmin });
    if (r) {
      toast.success("Atualizado");
      load();
    }
  };

  const toggleAccess = async (u: AdminUser) => {
    const has = u.access.some((a) => a.product === "infozap" && a.active);
    const r = await call({ action: "set_access", user_id: u.id, product: "infozap", active: !has });
    if (r) {
      toast.success(has ? "Acesso removido" : "Acesso liberado");
      load();
    }
  };

  const toggleMentoria = async (u: AdminUser) => {
    const has = u.access.some((a) => a.product === "mentoria" && a.active);
    const r = await call({ action: "set_access", user_id: u.id, product: "mentoria", active: !has });
    if (r) {
      toast.success(has ? "Mentoria removida" : "Mentoria liberada");
      load();
    }
  };

  const createUser = async () => {
    if (!cEmail.includes("@")) return toast.error("Email inválido");
    if (cPassword.length < 6) return toast.error("Senha mínima de 6 caracteres");
    setCreating(true);
    const r = await call({
      action: "create_user",
      email: cEmail,
      password: cPassword,
      is_admin: cAdmin,
      access_treinamento: cTrein,
      access_mentoria: cMent,
    });
    setCreating(false);
    if (r) {
      toast.success("Usuário criado");
      setShowCreate(false);
      setCEmail(""); setCPassword(""); setCAdmin(false); setCTrein(true); setCMent(false);
      load();
    }
  };

  const savePassword = async () => {
    if (!pwUserId || newPassword.length < 6) {
      toast.error("Mínimo de 6 caracteres");
      return;
    }
    const r = await call({ action: "set_password", user_id: pwUserId, password: newPassword });
    if (r) {
      toast.success("Senha atualizada — anote e envie ao usuário");
      setPwUserId(null);
      setNewPassword("");
    }
  };

  const deleteUser = async (u: AdminUser) => {
    if (!confirm(`Excluir definitivamente ${u.email}? Esta ação NÃO pode ser desfeita.`)) return;
    const r = await call({ action: "delete_user", user_id: u.id });
    if (r) {
      toast.success("Usuário excluído");
      load();
    }
  };

  const resetBiometrics = async (u: AdminUser) => {
    if (!confirm(`Resetar biometria de ${u.email}? Ele(a) precisará cadastrar novamente.`)) return;
    const r = await call({ action: "reset_biometrics", user_id: u.id });
    if (r) {
      toast.success("Biometria resetada");
      load();
    }
  };

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to="/membros" replace />;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/admin" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            ADMIN <span style={{ color: "#00ff88" }}>· Usuários</span>
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded bg-[#00ff88] text-black font-bold text-sm uppercase"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
          >
            <UserPlus className="h-4 w-4" /> Novo usuário
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {busy && users.length === 0 ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Criado</th>
                  <th className="text-left px-3 py-2">Último login</th>
                  <th className="text-left px-3 py-2">Admin</th>
                  <th className="text-left px-3 py-2">Acesso Treinamento</th>
                  <th className="text-left px-3 py-2">Acesso Mentoria</th>
                  <th className="text-right px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isU = u.roles.includes("admin");
                  const hasAccess = u.access.some((a) => a.product === "infozap" && a.active);
                  const hasMent = u.access.some((a) => a.product === "mentoria" && a.active);
                  return (
                    <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-3 py-2">
                        <div className="font-medium">{u.email}</div>
                        <div className="text-xs text-gray-500">{u.email_confirmed_at ? "Confirmado" : "Não confirmado"}</div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                      <td className="px-3 py-2 text-xs text-gray-400">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR") : "—"}</td>
                      <td className="px-3 py-2">{isU ? <Check className="h-4 w-4 text-[#00ff88]" /> : <X className="h-4 w-4 text-gray-600" />}</td>
                      <td className="px-3 py-2">{hasAccess ? <Check className="h-4 w-4 text-[#00ff88]" /> : <X className="h-4 w-4 text-gray-600" />}</td>
                      <td className="px-3 py-2">{hasMent ? <Check className="h-4 w-4 text-[#00ff88]" /> : <X className="h-4 w-4 text-gray-600" />}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => toggleAccess(u)} className="px-2 py-1 text-xs rounded border border-white/15 hover:border-[#00ff88]" title={hasAccess ? "Remover acesso" : "Liberar acesso"}>
                            {hasAccess ? "Remover acesso" : "Liberar acesso"}
                          </button>
                          <button onClick={() => toggleMentoria(u)} className="px-2 py-1 text-xs rounded border border-white/15 hover:border-[#ff2d78]" title={hasMent ? "Remover mentoria" : "Liberar mentoria"}>
                            {hasMent ? "Remover mentoria" : "Liberar mentoria"}
                          </button>
                          <button onClick={() => toggleAdmin(u)} className="p-2 rounded border border-white/15 hover:border-[#00ff88]" title={isU ? "Remover admin" : "Tornar admin"}>
                            {isU ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                          </button>
                          <button onClick={() => { setPwUserId(u.id); setNewPassword(""); }} className="p-2 rounded border border-white/15 hover:border-[#00ff88]" title="Alterar senha">
                            <KeyRound className="h-4 w-4" />
                          </button>
                          <button onClick={() => resetBiometrics(u)} className="p-2 rounded border border-white/15 hover:border-[#00ff88]" title="Resetar biometria">
                            <Fingerprint className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteUser(u)} className="p-2 rounded border border-white/15 hover:border-[#ff2d78] text-gray-400 hover:text-[#ff2d78]" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && !busy && (
                  <tr><td colSpan={7} className="px-3 py-10 text-center text-gray-500">Nenhum usuário.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pwUserId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPwUserId(null)}>
          <div className="bg-[#111] border border-white/10 rounded-lg p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>Definir nova senha</h3>
            <p className="text-xs text-gray-500 mb-3">{users.find((u) => u.id === pwUserId)?.email}</p>
            <input
              type="text"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm"
            />
            <p className="text-xs text-yellow-300/70 mt-2">Anote e envie ao usuário — não será possível ver depois.</p>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setPwUserId(null)} className="px-4 py-2 text-sm text-gray-400">Cancelar</button>
              <button onClick={savePassword} className="px-4 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-[#111] border border-white/10 rounded-lg p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>Criar novo usuário</h3>
            <div className="space-y-3">
              <input type="email" autoFocus value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="Email" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
              <input type="text" value={cPassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Senha (mínimo 6)" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cTrein} onChange={(e) => setCTrein(e.target.checked)} /> Acesso Treinamento
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cMent} onChange={(e) => setCMent(e.target.checked)} /> Acesso Mentoria
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cAdmin} onChange={(e) => setCAdmin(e.target.checked)} /> Tornar admin
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-400">Cancelar</button>
              <button onClick={createUser} disabled={creating} className="px-4 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;