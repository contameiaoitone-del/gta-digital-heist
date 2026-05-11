import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2, KeyRound, Check, X, UserPlus, Fingerprint, Search } from "lucide-react";
import { useResolvedArea } from "@/hooks/useResolvedArea";

interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: string[];
  access: { product: string; active: boolean }[];
}

interface PaidModule {
  id: string;
  title: string;
  product: string; // mentoria:{id}
}

const Users = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const { product: productParam } = useParams<{ product?: string }>();
  const [searchParams] = useSearchParams();
  const resolved = useResolvedArea();
  const routeParam = productParam || searchParams.get("product") || "treinamento";
  const productFilter = resolved.loading ? "" : (resolved.product || routeParam);
  const [areaName, setAreaName] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [paidModules, setPaidModules] = useState<PaidModule[]>([]);
  const [busy, setBusy] = useState(false);
  const [pwUserId, setPwUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [cFullName, setCFullName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cCpf, setCCpf] = useState("");
  const [cAdmin, setCAdmin] = useState(false);
  const [cTrein, setCTrein] = useState(true);
  const [creating, setCreating] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [filterTreinamento, setFilterTreinamento] = useState(false);
  const [filterPaidProduct, setFilterPaidProduct] = useState<string>(""); // "" = todos

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body });
    if (error) { toast.error(error.message); return null; }
    if ((data as { error?: string })?.error) { toast.error((data as { error: string }).error); return null; }
    return data;
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    const [usersRes, modsRes] = await Promise.all([
      call({ action: "list" }),
      supabase.from("modules").select("id, title, kind, product").eq("kind", "mentoria").eq("product", productFilter).order("position"),
    ]);
    setBusy(false);
    if (usersRes) setUsers((usersRes as { users: AdminUser[] }).users);
    const paid = ((modsRes.data as { id: string; title: string }[] | null) || []).map((m) => ({
      id: m.id,
      title: m.title,
      product: `mentoria:${m.id}`,
    }));
    setPaidModules(paid);
    // Reset filter if it's no longer valid
    if (filterPaidProduct && !paid.some((p) => p.product === filterPaidProduct)) setFilterPaidProduct("");
  }, [call, filterPaidProduct, productFilter]);

  useEffect(() => {
    document.title = "Admin · Usuários";
    if (isAdmin && productFilter) load();
  }, [isAdmin, load, productFilter]);

  useEffect(() => {
    setAreaName(resolved.areaName || (productFilter || null));
  }, [resolved.areaName, productFilter]);

  const hasAccessTo = (u: AdminUser, product: string) =>
    u.access.some((a) => a.product === product && a.active);
  const hasAnyMentoriaAccess = (u: AdminUser) =>
    u.access.some((a) => a.active && a.product === "mentoria");

  const toggleAdmin = async (u: AdminUser) => {
    const isCurrentlyAdmin = u.roles.includes("admin");
    if (!confirm(isCurrentlyAdmin ? `Remover admin de ${u.email}?` : `Tornar ${u.email} admin?`)) return;
    const r = await call({ action: "set_admin", user_id: u.id, is_admin: !isCurrentlyAdmin });
    if (r) { toast.success("Atualizado"); load(); }
  };

  const toggleAccess = async (u: AdminUser, product: string) => {
    const has = hasAccessTo(u, product);
    const r = await call({ action: "set_access", user_id: u.id, product, active: !has });
    if (r) { toast.success(has ? "Acesso removido" : "Acesso liberado"); load(); }
  };

  const createUser = async () => {
    if (!cEmail.includes("@")) return toast.error("Email inválido");
    if (cPassword.length < 6) return toast.error("Senha mínima de 6 caracteres");
    setCreating(true);
    const r = await call({
      action: "create_user", email: cEmail, password: cPassword,
      full_name: cFullName.trim() || undefined,
      phone: cPhone.trim() || undefined,
      cpf: cCpf.trim() || undefined,
      is_admin: cAdmin, access_treinamento: cTrein, access_product: productFilter, access_mentoria: false,
    });
    setCreating(false);
    if (r) {
      toast.success("Usuário criado");
      setShowCreate(false);
      setCEmail(""); setCPassword(""); setCFullName(""); setCPhone(""); setCCpf(""); setCAdmin(false); setCTrein(true);
      load();
    }
  };

  const savePassword = async () => {
    if (!pwUserId || newPassword.length < 6) { toast.error("Mínimo de 6 caracteres"); return; }
    const r = await call({ action: "set_password", user_id: pwUserId, password: newPassword });
    if (r) { toast.success("Senha atualizada — anote e envie ao usuário"); setPwUserId(null); setNewPassword(""); }
  };

  const deleteUser = async (u: AdminUser) => {
    if (!confirm(`Excluir definitivamente ${u.email}? Esta ação NÃO pode ser desfeita.`)) return;
    const r = await call({ action: "delete_user", user_id: u.id });
    if (r) { toast.success("Usuário excluído"); load(); }
  };

  const resetBiometrics = async (u: AdminUser) => {
    if (!confirm(`Resetar biometria de ${u.email}? Ele(a) precisará cadastrar novamente.`)) return;
    const r = await call({ action: "reset_biometrics", user_id: u.id });
    if (r) { toast.success("Biometria resetada"); load(); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q && !(u.email || "").toLowerCase().includes(q) && !(u.full_name || "").toLowerCase().includes(q)) return false;
      if (filterAdmin && !u.roles.includes("admin")) return false;
      if (filterTreinamento && !hasAccessTo(u, productFilter)) return false;
      if (filterPaidProduct && !hasAccessTo(u, filterPaidProduct)) return false;
      if (productFilter && !u.roles.includes("admin") && !hasAccessTo(u, productFilter)) return false;
      return true;
    });
  }, [users, search, filterAdmin, filterTreinamento, filterPaidProduct, productFilter]);

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to={`/${encodeURIComponent(routeParam)}/membros`} replace />;

  const productPath = encodeURIComponent(routeParam);
  const adminPath = `/${productPath}/admin`;

  const CheckCell = ({ active, onClick, title }: { active: boolean; onClick: () => void; title: string }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-1 rounded hover:bg-white/10 transition"
    >
      {active ? <Check className="h-4 w-4 text-[#00ff88]" /> : <X className="h-4 w-4 text-gray-600" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={adminPath} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            ADMIN <span style={{ color: "#00ff88" }}>· Usuários{areaName ? ` · ${areaName}` : ""}</span>
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

      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por email ou nome"
              className="w-full h-10 rounded bg-black/40 border border-white/15 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-[#00ff88]"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300 px-3 py-2 rounded border border-white/15 cursor-pointer">
            <input type="checkbox" checked={filterAdmin} onChange={(e) => setFilterAdmin(e.target.checked)} />
            Apenas admins
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300 px-3 py-2 rounded border border-white/15 cursor-pointer">
            <input type="checkbox" checked={filterTreinamento} onChange={(e) => setFilterTreinamento(e.target.checked)} />
            Apenas com acesso ao treinamento
          </label>
          {paidModules.length > 0 && (
            <select
              value={filterPaidProduct}
              onChange={(e) => setFilterPaidProduct(e.target.value)}
              className="h-10 rounded bg-black/40 border border-white/15 px-3 text-white text-sm focus:outline-none focus:border-[#00ff88]"
            >
              <option value="">Todos os módulos pagos</option>
              {paidModules.map((p) => (
                <option key={p.product} value={p.product}>Acesso {p.title}</option>
              ))}
            </select>
          )}
          <span className="text-xs text-gray-500 ml-auto">{filtered.length} de {users.length}</span>
        </div>

        {busy && users.length === 0 ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="text-left px-3 py-2">Nome completo</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Criado</th>
                  <th className="text-left px-3 py-2">Último login</th>
                  <th className="text-left px-3 py-2">Admin</th>
                  <th className="text-left px-3 py-2">Acesso Treinamento</th>
                  {paidModules.map((p) => (
                    <th key={p.product} className="text-left px-3 py-2 whitespace-nowrap">Acesso {p.title}</th>
                  ))}
                  <th className="text-right px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isU = u.roles.includes("admin");
                  const hasTrein = hasAccessTo(u, productFilter);
                  return (
                    <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-3 py-2">
                        <div className="font-medium">{u.full_name || <span className="text-gray-600">—</span>}</div>
                        {u.phone && <div className="text-xs text-gray-500">{u.phone}</div>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium">{u.email}</div>
                        <div className="text-xs text-gray-500">{u.email_confirmed_at ? "Confirmado" : "Não confirmado"}</div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                      <td className="px-3 py-2 text-xs text-gray-400">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR") : "—"}</td>
                      <td className="px-3 py-2">
                        <CheckCell active={isU} onClick={() => toggleAdmin(u)} title={isU ? "Remover admin" : "Tornar admin"} />
                      </td>
                      <td className="px-3 py-2">
                        <CheckCell active={hasTrein} onClick={() => toggleAccess(u, productFilter)} title={hasTrein ? "Remover acesso ao treinamento" : "Liberar acesso ao treinamento"} />
                      </td>
                      {paidModules.map((p) => {
                        const has = hasAccessTo(u, p.product) || hasAnyMentoriaAccess(u);
                        return (
                          <td key={p.product} className="px-3 py-2">
                            <CheckCell active={has} onClick={() => toggleAccess(u, p.product)} title={has ? `Remover acesso a ${p.title}` : `Liberar acesso a ${p.title}`} />
                          </td>
                        );
                      })}
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
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
                {filtered.length === 0 && !busy && (
                  <tr><td colSpan={7 + paidModules.length} className="px-3 py-10 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>
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
          <div className="bg-[#111] border border-white/10 rounded-lg p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>Criar novo usuário</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider">Email <span className="text-[#ff2d78]">*</span></label>
                <input type="email" autoFocus value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="email@exemplo.com" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider">Senha <span className="text-[#ff2d78]">*</span></label>
                <input type="text" value={cPassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 uppercase tracking-wider">Nome completo</label>
                <input type="text" value={cFullName} onChange={(e) => setCFullName(e.target.value)} placeholder="Opcional" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-400 uppercase tracking-wider">Telefone</label>
                  <input type="text" value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="Opcional" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 uppercase tracking-wider">CPF</label>
                  <input type="text" value={cCpf} onChange={(e) => setCCpf(e.target.value)} placeholder="Opcional" className="w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white focus:outline-none focus:border-[#00ff88] text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cTrein} onChange={(e) => setCTrein(e.target.checked)} /> Liberar acesso ao treinamento
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cAdmin} onChange={(e) => setCAdmin(e.target.checked)} /> Tornar admin
              </label>
              <p className="text-[11px] text-gray-500">Acessos a módulos pagos podem ser liberados clicando no X da coluna correspondente após criar o usuário.</p>
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
