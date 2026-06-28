import { useEffect, useState } from "react";
import MasterLayout from "./MasterLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, ExternalLink, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Area {
  id: string;
  slug: string;
  name: string;
  product: string;
  created_at: string;
  owner_id: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MemberAreas() {
  const { session, isSuperAdmin } = useAuth();
  const userId = session?.user?.id;
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    setLoading(true);
    let q = supabase.from("member_areas").select("*").order("created_at");
    if (!isSuperAdmin && userId) q = q.eq("owner_id", userId);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setAreas((data as Area[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId !== undefined) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isSuperAdmin]);

  const create = async () => {
    const name = newName.trim();
    if (!name || !userId) return;
    const slug = slugify(name);
    if (!slug) {
      toast.error("Nome inválido");
      return;
    }
    // Generate a unique product/slug per owner to keep legacy columns consistent
    const uniqueSuffix = crypto.randomUUID().slice(0, 8);
    const product = `${slug}-${uniqueSuffix}`;
    const { error } = await supabase
      .from("member_areas")
      .insert({ name, slug: product, product, owner_id: userId });
    if (error) toast.error(error.message);
    else {
      toast.success("Área criada");
      setNewName("");
      setCreating(false);
      load();
    }
  };

  const save = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const { error } = await supabase.from("member_areas").update({ name }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Atualizado");
      setEditingId(null);
      load();
    }
  };

  const remove = async (a: Area) => {
    if (!confirm(`Excluir a área "${a.name}"? Os módulos e acessos continuarão existindo no banco.`)) return;
    const { error } = await supabase.from("member_areas").delete().eq("id", a.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Removida");
      load();
    }
  };

  return (
    <MasterLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-gta text-2xl tracking-wide">Áreas de membro</h1>
            <p className="text-sm text-gray-400">Cada área tem seu próprio painel admin e usuários separados.</p>
          </div>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold"
            >
              <Plus className="h-4 w-4" /> Nova área
            </button>
          )}
        </div>

        {creating && (
          <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4 flex items-center gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do produto / área (ex: Close Friends)"
              className="flex-1 bg-black border border-white/15 rounded px-3 py-2 text-sm"
            />
            <button onClick={create} className="px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold flex items-center gap-1">
              <Save className="h-4 w-4" /> Criar
            </button>
            <button onClick={() => { setCreating(false); setNewName(""); }} className="px-3 py-2 border border-white/15 rounded text-sm flex items-center gap-1">
              <X className="h-4 w-4" /> Cancelar
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-8"><Loader2 className="h-5 w-5 animate-spin text-gray-500" /></div>
        ) : (
          <div className="space-y-2">
            {areas.map((a) => (
              <div key={a.id} className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-[#ff2d78]" />
                {editingId === a.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-black border border-white/15 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono">id: {a.id}</div>
                  </div>
                )}
                {editingId === a.id ? (
                  <>
                    <button onClick={() => save(a.id)} className="px-2 py-1 text-xs bg-[#00ff88] text-black rounded font-bold">Salvar</button>
                    <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs border border-white/15 rounded">Cancelar</button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${a.id}/admin`}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Painel
                    </Link>
                    <button onClick={() => { setEditingId(a.id); setEditName(a.name); }} className="text-gray-400 hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(a)} className="text-gray-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {areas.length === 0 && (
              <p className="text-sm text-gray-500">Nenhuma área cadastrada.</p>
            )}
          </div>
        )}
      </div>
    </MasterLayout>
  );
}