import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft, ChevronRight } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  position: number;
  published: boolean;
}
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  position: number;
  published: boolean;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const Admin = () => {
  const { isAdmin, loading, checkedAccess } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin — Real Life Academy";
    if (isAdmin) loadModules();
  }, [isAdmin]);

  useEffect(() => {
    if (selectedModuleId) loadLessons(selectedModuleId);
    else setLessons([]);
  }, [selectedModuleId]);

  const loadModules = async () => {
    const { data } = await supabase.from("modules").select("*").order("position");
    setModules((data as Module[]) || []);
  };
  const loadLessons = async (modId: string) => {
    const { data } = await supabase.from("lessons").select("*").eq("module_id", modId).order("position");
    setLessons((data as Lesson[]) || []);
  };

  const saveModule = async () => {
    if (!editingModule || !editingModule.title) return;
    setBusy(true);
    const payload = {
      title: editingModule.title,
      description: editingModule.description || null,
      cover_url: editingModule.cover_url || null,
      position: editingModule.position ?? modules.length + 1,
      published: editingModule.published ?? false,
    };
    const { error } = editingModule.id
      ? await supabase.from("modules").update(payload).eq("id", editingModule.id)
      : await supabase.from("modules").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo");
      setEditingModule(null);
      loadModules();
    }
  };
  const deleteModule = async (id: string) => {
    if (!confirm("Excluir módulo e todas as aulas dele?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      if (selectedModuleId === id) setSelectedModuleId(null);
      loadModules();
    }
  };
  const moveModule = async (id: string, dir: -1 | 1) => {
    const idx = modules.findIndex((m) => m.id === id);
    const swap = modules[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("modules").update({ position: swap.position }).eq("id", id),
      supabase.from("modules").update({ position: modules[idx].position }).eq("id", swap.id),
    ]);
    loadModules();
  };

  const saveLesson = async () => {
    if (!editingLesson || !editingLesson.title || !selectedModuleId) return;
    setBusy(true);
    const ytId = extractYouTubeId(editingLesson.youtube_url || "");
    const payload = {
      module_id: selectedModuleId,
      title: editingLesson.title,
      description: editingLesson.description || null,
      youtube_url: editingLesson.youtube_url || null,
      youtube_id: ytId,
      thumbnail_url: ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : editingLesson.thumbnail_url || null,
      duration_seconds: editingLesson.duration_seconds ?? null,
      position: editingLesson.position ?? lessons.length + 1,
      published: editingLesson.published ?? true,
    };
    const { error } = editingLesson.id
      ? await supabase.from("lessons").update(payload).eq("id", editingLesson.id)
      : await supabase.from("lessons").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo");
      setEditingLesson(null);
      loadLessons(selectedModuleId);
    }
  };
  const deleteLesson = async (id: string) => {
    if (!confirm("Excluir aula?")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) toast.error(error.message);
    else if (selectedModuleId) loadLessons(selectedModuleId);
  };
  const moveLesson = async (id: string, dir: -1 | 1) => {
    const idx = lessons.findIndex((l) => l.id === id);
    const swap = lessons[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("lessons").update({ position: swap.position }).eq("id", id),
      supabase.from("lessons").update({ position: lessons[idx].position }).eq("id", swap.id),
    ]);
    if (selectedModuleId) loadLessons(selectedModuleId);
  };

  const uploadCover = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("module-covers").upload(path, file);
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("module-covers").getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading || !checkedAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!isAdmin) return <Navigate to="/membros" replace />;

  const inputCls = "w-full h-10 rounded bg-black/40 border border-white/15 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88] text-sm";

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/membros" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
            ADMIN <span style={{ color: "#00ff88" }}>· Conteúdo</span>
          </h1>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        {/* MODULES */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>Módulos</h2>
            <button onClick={() => setEditingModule({ position: modules.length + 1, published: false })} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold">
              <Plus className="h-4 w-4" /> Novo módulo
            </button>
          </div>
          <ul className="space-y-2">
            {modules.map((m, i) => (
              <li key={m.id} className={`flex items-center gap-2 p-3 rounded border ${selectedModuleId === m.id ? "border-[#00ff88] bg-white/5" : "border-white/10"}`}>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveModule(m.id, -1)} disabled={i === 0} className="text-gray-500 disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                  <button onClick={() => moveModule(m.id, 1)} disabled={i === modules.length - 1} className="text-gray-500 disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                </div>
                <button onClick={() => setSelectedModuleId(m.id)} className="flex-1 text-left">
                  <p className="font-semibold text-sm">{m.title}</p>
                  <p className="text-xs text-gray-500">
                    {m.published ? <span className="text-[#00ff88]">Publicado</span> : "Rascunho"}
                  </p>
                </button>
                <button onClick={() => setEditingModule(m)} className="text-gray-400 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteModule(m.id)} className="text-gray-400 hover:text-[#ff2d78] p-1"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => setSelectedModuleId(m.id)} className="text-gray-500"><ChevronRight className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </section>

        {/* LESSONS */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>
              Aulas {selectedModuleId && <span className="text-gray-500 text-sm">/ {modules.find((m) => m.id === selectedModuleId)?.title}</span>}
            </h2>
            {selectedModuleId && (
              <button onClick={() => setEditingLesson({ position: lessons.length + 1, published: true })} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold">
                <Plus className="h-4 w-4" /> Nova aula
              </button>
            )}
          </div>
          {!selectedModuleId ? (
            <p className="text-gray-500 text-sm">Selecione um módulo à esquerda para gerenciar as aulas.</p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((l, i) => (
                <li key={l.id} className="flex items-center gap-2 p-3 rounded border border-white/10">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveLesson(l.id, -1)} disabled={i === 0} className="text-gray-500 disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                    <button onClick={() => moveLesson(l.id, 1)} disabled={i === lessons.length - 1} className="text-gray-500 disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{l.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {l.published ? <span className="text-[#00ff88]">Publicada</span> : "Rascunho"} · {l.youtube_id ? `YT: ${l.youtube_id}` : "Sem vídeo"}
                    </p>
                  </div>
                  <button onClick={() => setEditingLesson(l)} className="text-gray-400 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteLesson(l.id)} className="text-gray-400 hover:text-[#ff2d78] p-1"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* MODULE EDITOR */}
      {editingModule && (
        <Modal onClose={() => setEditingModule(null)} title={editingModule.id ? "Editar módulo" : "Novo módulo"}>
          <div className="space-y-3">
            <Field label="Título"><input className={inputCls} value={editingModule.title || ""} onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })} /></Field>
            <Field label="Descrição"><textarea className={inputCls + " h-24"} value={editingModule.description || ""} onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })} /></Field>
            <Field label="Capa do módulo (16:9 — recomendado 1280×720)">
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadCover(f);
                if (url) setEditingModule({ ...editingModule, cover_url: url });
              }} className="text-sm text-gray-300" />
              <p className="text-xs text-gray-500 mt-1">Esta capa aparece no grid estilo Netflix da área de membros.</p>
              {editingModule.cover_url && <img src={editingModule.cover_url} alt="" className="mt-2 max-h-32 rounded" />}
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editingModule.published} onChange={(e) => setEditingModule({ ...editingModule, published: e.target.checked })} />
              Publicado
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditingModule(null)} className="px-4 py-2 text-sm text-gray-400">Cancelar</button>
              <button onClick={saveModule} disabled={busy} className="px-4 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">{busy ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* LESSON EDITOR */}
      {editingLesson && (
        <Modal onClose={() => setEditingLesson(null)} title={editingLesson.id ? "Editar aula" : "Nova aula"}>
          <div className="space-y-3">
            <Field label="Título"><input className={inputCls} value={editingLesson.title || ""} onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })} /></Field>
            <Field label="URL do YouTube"><input className={inputCls} placeholder="https://youtube.com/watch?v=..." value={editingLesson.youtube_url || ""} onChange={(e) => setEditingLesson({ ...editingLesson, youtube_url: e.target.value })} /></Field>
            <Field label="Descrição"><textarea className={inputCls + " h-24"} value={editingLesson.description || ""} onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })} /></Field>
            <Field label="Duração (segundos)"><input type="number" className={inputCls} value={editingLesson.duration_seconds ?? ""} onChange={(e) => setEditingLesson({ ...editingLesson, duration_seconds: e.target.value ? Number(e.target.value) : null })} /></Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editingLesson.published} onChange={(e) => setEditingLesson({ ...editingLesson, published: e.target.checked })} />
              Publicada
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditingLesson(null)} className="px-4 py-2 text-sm text-gray-400">Cancelar</button>
              <button onClick={saveLesson} disabled={busy} className="px-4 py-2 bg-[#00ff88] text-black font-bold rounded text-sm">{busy ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-gray-300 uppercase tracking-wider mb-1 block">{label}</label>
    {children}
  </div>
);
const Modal = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#111] border border-white/10 rounded-xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>{title}</h3>
      {children}
    </div>
  </div>
);

export default Admin;
