import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  position: number;
  published: boolean;
  status?: "hidden" | "published" | "coming_soon";
  category: string | null;
  kind?: string;
  price_cents?: number | null;
  release_days?: number;
}
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  youtube_id: string | null;
  vturb_player_id: string | null;
  vturb_optimization_code?: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  position: number;
  published: boolean;
  status?: "hidden" | "published" | "coming_soon";
  cta_enabled?: boolean;
  cta_label?: string | null;
  cta_url?: string | null;
  release_days?: number;
  content_mode?: "video" | "text";
  header_image_url?: string | null;
  text_content?: string | null;
}
interface LessonCTA {
  id?: string;
  label: string;
  url: string;
  position: number;
}
interface LessonAttachment {
  id?: string;
  name: string;
  file_url: string;
  size_bytes?: number | null;
  mime?: string | null;
  position: number;
}
interface Category {
  id: string;
  name: string;
  position: number;
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
  const [searchParams] = useSearchParams();
  const productFilter = searchParams.get("product");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [lessonCtas, setLessonCtas] = useState<LessonCTA[]>([]);
  const [lessonAttachments, setLessonAttachments] = useState<LessonAttachment[]>([]);
  const [showVideoYT, setShowVideoYT] = useState(false);
  const [showVideoVturb, setShowVideoVturb] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [busy, setBusy] = useState(false);

  const syncModuleCategories = useCallback(async (moduleList: Module[], savedCategories: Category[]) => {
    const savedNames = new Set(savedCategories.map((c) => c.name.trim().toLowerCase()));
    const moduleCategoryNames = Array.from(
      new Set(moduleList.map((m) => m.category?.trim()).filter(Boolean) as string[])
    ).filter((name) => !savedNames.has(name.toLowerCase()));

    if (moduleCategoryNames.length === 0) {
      setCategories(savedCategories);
      return;
    }

    const maxPosition = savedCategories.reduce((max, c) => Math.max(max, c.position), 0);
    const pendingCategories = moduleCategoryNames.map((name, index) => ({
      id: `module-${name}`,
      name,
      position: maxPosition + index + 1,
    }));
    setCategories([...savedCategories, ...pendingCategories]);

    const { data, error } = await supabase
      .from("module_categories")
      .insert(moduleCategoryNames.map((name, index) => ({ name, position: maxPosition + index + 1 })))
      .select("*");

    if (!error && data) {
      setCategories([...savedCategories, ...((data as Category[]) || [])].sort((a, b) => a.position - b.position));
    }
  }, []);
  const loadAdminContent = useCallback(async () => {
    let modulesQuery = supabase.from("modules").select("*").order("position");
    if (productFilter) modulesQuery = modulesQuery.eq("product", productFilter);
    let categoriesQuery = supabase.from("module_categories").select("*").order("position");
    if (productFilter) categoriesQuery = categoriesQuery.eq("product", productFilter);
    const [{ data: modulesData }, { data: categoriesData }] = await Promise.all([
      modulesQuery,
      categoriesQuery,
    ]);
    const loadedModules = (modulesData as Module[]) || [];
    const loadedCategories = (categoriesData as Category[]) || [];
    setModules(loadedModules);
    await syncModuleCategories(loadedModules, loadedCategories);
  }, [syncModuleCategories, productFilter]);
  const loadModules = useCallback(async () => {
    let q = supabase.from("modules").select("*").order("position");
    if (productFilter) q = q.eq("product", productFilter);
    const { data } = await q;
    const loadedModules = (data as Module[]) || [];
    setModules(loadedModules);
    await syncModuleCategories(loadedModules, categories);
  }, [categories, syncModuleCategories, productFilter]);
  const loadCategories = useCallback(async () => {
    let q = supabase.from("module_categories").select("*").order("position");
    if (productFilter) q = q.eq("product", productFilter);
    const { data } = await q;
    setCategories((data as Category[]) || []);
  }, [productFilter]);
  const addCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const { error } = await supabase.from("module_categories").insert({
      name,
      position: categories.length + 1,
      ...(productFilter ? { product: productFilter } : { product: "infozap" }),
    });
    if (error) toast.error(error.message);
    else {
      setNewCategoryName("");
      loadAdminContent();
    }
  };
  const deleteCategory = async (id: string) => {
    if (!confirm("Excluir categoria? (módulos não serão excluídos)")) return;
    const { error } = await supabase.from("module_categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else loadAdminContent();
  };
  const moveCategory = async (id: string, dir: -1 | 1) => {
    const idx = categories.findIndex((c) => c.id === id);
    const swap = categories[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("module_categories").update({ position: swap.position }).eq("id", id),
      supabase.from("module_categories").update({ position: categories[idx].position }).eq("id", swap.id),
    ]);
    loadCategories();
  };
  const loadLessons = useCallback(async (modId: string) => {
    const { data } = await supabase.from("lessons").select("*").eq("module_id", modId).order("position");
    setLessons((data as Lesson[]) || []);
  }, []);

  useEffect(() => {
    document.title = "Admin — Treinamento";
    if (isAdmin) {
      loadAdminContent();
    }
  }, [isAdmin, loadAdminContent]);

  useEffect(() => {
    if (selectedModuleId) loadLessons(selectedModuleId);
    else setLessons([]);
  }, [selectedModuleId, loadLessons]);

  const saveModule = async () => {
    if (!editingModule || !editingModule.title) return;
    const kind = (editingModule.kind as string) || "treinamento";
    if (kind === "mentoria" && (!editingModule.price_cents || editingModule.price_cents <= 0)) {
      toast.error("Defina o valor da mentoria (em R$).");
      return;
    }
    setBusy(true);
    const payload = {
      title: editingModule.title,
      description: editingModule.description || null,
      cover_url: editingModule.cover_url || null,
      position: editingModule.position ?? modules.length + 1,
      published: (editingModule.status ?? (editingModule.published ? "published" : "hidden")) === "published",
      status: editingModule.status ?? (editingModule.published ? "published" : "hidden"),
      category: editingModule.category?.trim() || null,
      kind,
      price_cents: kind === "mentoria" ? editingModule.price_cents! : null,
      release_days: Math.max(0, Number(editingModule.release_days) || 0),
      ...(productFilter ? { product: productFilter } : {}),
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
    // Mutual exclusion: only one video source can be active. If any video toggle is on, force video mode.
    const hasVideo = showVideoYT || showVideoVturb;
    const contentMode: "video" | "text" = hasVideo ? "video" : (editingLesson.content_mode || "video");
    const payload = {
      module_id: selectedModuleId,
      title: editingLesson.title,
      description: editingLesson.description || null,
      youtube_url: contentMode === "video" && showVideoYT ? (editingLesson.youtube_url || null) : null,
      youtube_id: contentMode === "video" && showVideoYT ? ytId : null,
      vturb_player_id: contentMode === "video" && showVideoVturb ? (editingLesson.vturb_player_id?.trim() || null) : null,
      vturb_optimization_code: contentMode === "video" && showVideoVturb ? (editingLesson.vturb_optimization_code?.trim() || null) : null,
      thumbnail_url: ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : editingLesson.thumbnail_url || null,
      duration_seconds: editingLesson.duration_seconds ?? null,
      position: editingLesson.position ?? lessons.length + 1,
      published: (editingLesson.status ?? (editingLesson.published === false ? "hidden" : "published")) === "published",
      status: editingLesson.status ?? (editingLesson.published === false ? "hidden" : "published"),
      cta_enabled: false,
      cta_label: null,
      cta_url: null,
      release_days: Math.max(0, Number(editingLesson.release_days) || 0),
      content_mode: contentMode,
      header_image_url: contentMode === "text" ? (editingLesson.header_image_url || null) : null,
      text_content: contentMode === "text" ? (editingLesson.text_content || null) : null,
    };
    let lessonId = editingLesson.id;
    let saveErr;
    if (lessonId) {
      const { error } = await supabase.from("lessons").update(payload).eq("id", lessonId);
      saveErr = error;
    } else {
      const { data, error } = await supabase.from("lessons").insert(payload).select("id").single();
      saveErr = error;
      lessonId = (data as { id: string } | null)?.id;
    }
    if (saveErr || !lessonId) {
      setBusy(false);
      toast.error(saveErr?.message || "Erro ao salvar");
      return;
    }
    // Sync CTAs (delete all, reinsert)
    await supabase.from("lesson_ctas").delete().eq("lesson_id", lessonId);
    const validCtas = lessonCtas.filter((c) => c.label.trim() && c.url.trim());
    if (validCtas.length > 0) {
      await supabase.from("lesson_ctas").insert(
        validCtas.map((c, i) => ({ lesson_id: lessonId, label: c.label.trim(), url: c.url.trim(), position: i }))
      );
    }
    // Sync attachments (delete removed, insert new ones)
    const { data: existingAtt } = await supabase.from("lesson_attachments").select("id").eq("lesson_id", lessonId);
    const keptIds = new Set(lessonAttachments.filter((a) => a.id).map((a) => a.id));
    const toDelete = ((existingAtt as { id: string }[] | null) || []).filter((a) => !keptIds.has(a.id)).map((a) => a.id);
    if (toDelete.length > 0) await supabase.from("lesson_attachments").delete().in("id", toDelete);
    // Update positions on existing
    for (let i = 0; i < lessonAttachments.length; i++) {
      const a = lessonAttachments[i];
      if (a.id) {
        await supabase.from("lesson_attachments").update({ position: i }).eq("id", a.id);
      } else {
        await supabase.from("lesson_attachments").insert({
          lesson_id: lessonId,
          name: a.name,
          file_url: a.file_url,
          size_bytes: a.size_bytes ?? null,
          mime: a.mime ?? null,
          position: i,
        });
      }
    }
    setBusy(false);
    toast.success("Salvo");
    setEditingLesson(null);
    setLessonCtas([]);
    setLessonAttachments([]);
    loadLessons(selectedModuleId);
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

  const uploadLessonFile = async (file: File): Promise<{ url: string; size: number; mime: string } | null> => {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${selectedModuleId || "misc"}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("lesson-attachments").upload(path, file, { contentType: file.type || undefined });
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("lesson-attachments").getPublicUrl(path);
    return { url: data.publicUrl, size: file.size, mime: file.type || "application/octet-stream" };
  };

  const openLessonEditor = async (lesson: Partial<Lesson> | null) => {
    if (lesson?.id) {
      const [ctaRes, attRes] = await Promise.all([
        supabase.from("lesson_ctas").select("*").eq("lesson_id", lesson.id).order("position"),
        supabase.from("lesson_attachments").select("*").eq("lesson_id", lesson.id).order("position"),
      ]);
      setLessonCtas(((ctaRes.data as LessonCTA[] | null) || []).map((c) => ({ id: c.id, label: c.label, url: c.url, position: c.position })));
      setLessonAttachments(((attRes.data as LessonAttachment[] | null) || []).map((a) => ({ id: a.id, name: a.name, file_url: a.file_url, size_bytes: a.size_bytes, mime: a.mime, position: a.position })));
      setShowVideoYT(!!lesson.youtube_url);
      setShowVideoVturb(!!lesson.vturb_player_id);
    } else {
      setLessonCtas([]);
      setLessonAttachments([]);
      setShowVideoYT(false);
      setShowVideoVturb(false);
    }
    setEditingLesson(lesson);
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
          <div className="ml-auto flex items-center gap-2">
            <Link to="/admin/usuarios" className="text-xs px-3 py-1.5 rounded border border-white/15 hover:border-[#00ff88] text-gray-300 hover:text-white">
              Usuários
            </Link>
            <Link to="/admin/trackeamento" className="text-xs px-3 py-1.5 rounded border border-white/15 hover:border-[#00ff88] text-gray-300 hover:text-white">
              Trackeamento
            </Link>
            <Link to="/admin/configuracoes" className="text-xs px-3 py-1.5 rounded border border-white/15 hover:border-[#00ff88] text-gray-300 hover:text-white">
              Configurações
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        {/* CATEGORIES */}
        <section className="lg:col-span-2 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>Sessões / Categorias</h2>
              <p className="text-xs text-gray-500">Defina a ordem em que as sessões aparecem na área de membros (independente da ordem dos módulos).</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <input className={inputCls} placeholder="Nome da nova categoria (ex.: Avançado)" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <button onClick={addCategory} className="px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold whitespace-nowrap">Adicionar</button>
          </div>
          {categories.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhuma categoria ainda. Categorias usadas pelos módulos aparecerão automaticamente no fim da lista — adicione aqui para controlar a ordem.</p>
          ) : (
            <ul className="space-y-1">
              {categories.map((c, i) => (
                <li key={c.id} className="flex items-center gap-2 p-2 rounded border border-white/10">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveCategory(c.id, -1)} disabled={i === 0} className="text-gray-500 disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                    <button onClick={() => moveCategory(c.id, 1)} disabled={i === categories.length - 1} className="text-gray-500 disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                  </div>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <button onClick={() => deleteCategory(c.id)} className="text-gray-400 hover:text-[#ff2d78] p-1"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* MODULES */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>Módulos</h2>
            <button onClick={() => setEditingModule({ position: modules.length + 1, status: "hidden", published: false })} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold">
              <Plus className="h-4 w-4" /> Novo módulo
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">O <span className="text-[#00ff88]">primeiro módulo da lista</span> aparece como banner principal na área de membros. Use as setas ↑↓ para reordenar.</p>
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
                    {m.status === "published" ? <span className="text-[#00ff88]">Publicado</span>
                      : m.status === "coming_soon" ? <span className="text-[#facc15]">Em breve</span>
                      : <span className="text-gray-500">Oculto</span>}
                    {m.category && <> · <span className="text-[#a855f7]">{m.category}</span></>}
                    {m.kind === "mentoria" && (
                      <> · <span className="text-[#ff2d78]">Mentoria · R$ {((m.price_cents || 0) / 100).toFixed(2)}</span></>
                    )}
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
              <button onClick={() => openLessonEditor({ position: lessons.length + 1, status: "published", published: true, content_mode: "video", release_days: 0 })} className="flex items-center gap-1 px-3 py-2 bg-[#00ff88] text-black rounded text-sm font-bold">
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
                      {l.status === "published" ? <span className="text-[#00ff88]">Publicada</span>
                        : l.status === "coming_soon" ? <span className="text-[#facc15]">Em breve</span>
                        : <span className="text-gray-500">Oculta</span>} · {l.youtube_id ? `YT: ${l.youtube_id}` : "Sem vídeo"}
                    </p>
                  </div>
                  <button onClick={() => openLessonEditor(l)} className="text-gray-400 hover:text-white p-1"><Pencil className="h-4 w-4" /></button>
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
            <Field label="Categoria (sessão)">
              <input
                className={inputCls}
                list="module-categories"
                placeholder="Ex.: Base do X1"
                value={editingModule.category || ""}
                onChange={(e) => setEditingModule({ ...editingModule, category: e.target.value })}
              />
              <datalist id="module-categories">
                {Array.from(new Set([
                  ...categories.map((c) => c.name),
                  ...(modules.map((m) => m.category).filter(Boolean) as string[]),
                ])).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-1">Módulos com a mesma categoria aparecem agrupados em uma sessão na área de membros.</p>
            </Field>
            <Field label="Descrição"><textarea className={inputCls + " h-24"} value={editingModule.description || ""} onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })} /></Field>
            <Field label="Tipo de módulo">
              <select
                className={inputCls}
                value={(editingModule.kind as string) || "treinamento"}
                onChange={(e) => setEditingModule({ ...editingModule, kind: e.target.value })}
              >
                <option value="treinamento">Liberado a quem comprou</option>
                <option value="mentoria">Módulo pago</option>
              </select>
            </Field>
            {(editingModule.kind === "mentoria") && (
              <Field label="Valor (R$) cobrado por este módulo pago">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputCls}
                  placeholder="Ex.: 197.00"
                  value={editingModule.price_cents ? (editingModule.price_cents / 100).toString() : ""}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setEditingModule({ ...editingModule, price_cents: Number.isFinite(v) ? Math.round(v * 100) : null });
                  }}
                />
              </Field>
            )}
            <Field label="Capa do módulo (2:3 vertical — recomendado 800×1200, estilo cartaz Netflix)">
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadCover(f);
                if (url) setEditingModule({ ...editingModule, cover_url: url });
              }} className="text-sm text-gray-300" />
              <p className="text-xs text-gray-500 mt-1">Esta capa aparece no grid estilo Netflix da área de membros.</p>
              {editingModule.cover_url && <img src={editingModule.cover_url} alt="" className="mt-2 max-h-32 rounded" />}
            </Field>
            <Field label="Visibilidade">
              <select
                className={inputCls}
                value={editingModule.status || (editingModule.published ? "published" : "hidden")}
                onChange={(e) => setEditingModule({ ...editingModule, status: e.target.value as "hidden" | "published" | "coming_soon" })}
              >
                <option value="hidden">Oculto (não aparece)</option>
                <option value="published">Publicado (acesso liberado)</option>
                <option value="coming_soon">Em breve (aparece com tag, sem acesso)</option>
              </select>
            </Field>
            <Field label="Liberação (drip)">
              <div className="flex gap-2 items-center">
                <select
                  className={inputCls + " max-w-[220px]"}
                  value={(editingModule.release_days ?? 0) > 0 ? "delayed" : "immediate"}
                  onChange={(e) => setEditingModule({ ...editingModule, release_days: e.target.value === "immediate" ? 0 : (editingModule.release_days || 7) })}
                >
                  <option value="immediate">Imediata após pagamento</option>
                  <option value="delayed">Liberar após N dias</option>
                </select>
                {(editingModule.release_days ?? 0) > 0 && (
                  <input type="number" min={1} className={inputCls + " max-w-[120px]"} value={editingModule.release_days || 0}
                    onChange={(e) => setEditingModule({ ...editingModule, release_days: Math.max(1, Number(e.target.value) || 1) })} />
                )}
                <span className="text-xs text-gray-500">dias após a compra</span>
              </div>
            </Field>
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

            {/* CONTEÚDO DA AULA */}
            <div className="border border-white/10 rounded-lg">
              <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-300 font-semibold">
                Conteúdo da aula
              </div>
              <div className="p-3 space-y-4">
                {/* Vídeo: YT/Vturb mutuamente exclusivos via toggle */}
                <div className="border border-white/10 rounded p-3 space-y-3">
                  <p className="text-sm font-semibold">Vídeo</p>
                  <p className="text-[11px] text-gray-500 -mt-2">Escolha uma única fonte de vídeo por aula (YouTube ou Vturb).</p>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>Adicionar URL de YouTube</span>
                    <Switch
                      checked={showVideoYT}
                      onCheckedChange={(v) => {
                        setShowVideoYT(v);
                        if (v) {
                          setShowVideoVturb(false);
                          setEditingLesson((l) => l ? { ...l, content_mode: "video" } : l);
                        }
                      }}
                    />
                  </div>
                  {showVideoYT && (
                    <input className={inputCls} placeholder="https://youtube.com/watch?v=..." value={editingLesson.youtube_url || ""} onChange={(e) => setEditingLesson({ ...editingLesson, youtube_url: e.target.value })} />
                  )}

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>Adicionar Vturb</span>
                    <Switch
                      checked={showVideoVturb}
                      onCheckedChange={(v) => {
                        setShowVideoVturb(v);
                        if (v) {
                          setShowVideoYT(false);
                          setEditingLesson((l) => l ? { ...l, content_mode: "video" } : l);
                        }
                      }}
                    />
                  </div>
                  {showVideoVturb && (
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-400">URL do vídeo / código do player Vturb</label>
                      <textarea
                        className={inputCls + " h-24 font-mono text-xs"}
                        placeholder='Cole aqui o trecho do <vturb-smartplayer id="vid-..."></vturb-smartplayer> + <script>...</script>'
                        value={editingLesson.vturb_player_id || ""}
                        onChange={(e) => setEditingLesson({ ...editingLesson, vturb_player_id: e.target.value })}
                      />
                      <label className="block text-xs text-gray-400">Código de otimização (opcional)</label>
                      <textarea
                        className={inputCls + " h-20 font-mono text-xs"}
                        placeholder='Cole aqui as tags <link rel="preload" ...> fornecidas pela Vturb'
                        value={editingLesson.vturb_optimization_code || ""}
                        onChange={(e) => setEditingLesson({ ...editingLesson, vturb_optimization_code: e.target.value })}
                      />
                      <p className="text-[11px] text-gray-500">Os códigos do player e de otimização são injetados na página da aula exatamente como a Vturb fornece.</p>
                    </div>
                  )}
                </div>

                {/* Conteúdo em texto — só aparece se nenhum vídeo está habilitado */}
                {!showVideoYT && !showVideoVturb && (
                  <div className="border border-white/10 rounded p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span>Habilitar conteúdo apenas em texto (sem vídeo)</span>
                      <Switch
                        checked={editingLesson.content_mode === "text"}
                        onCheckedChange={(v) => setEditingLesson({ ...editingLesson, content_mode: v ? "text" : "video" })}
                      />
                    </div>
                    {editingLesson.content_mode === "text" && (
                      <>
                        <Field label="Imagem de cabeçalho (cobre o topo da aula)">
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const r = await uploadLessonFile(f);
                            if (r) setEditingLesson({ ...editingLesson, header_image_url: r.url });
                          }} className="text-sm text-gray-300" />
                          {editingLesson.header_image_url && (
                            <img src={editingLesson.header_image_url} alt="" className="mt-2 max-h-32 rounded" />
                          )}
                        </Field>
                        <Field label="Texto da aula (links viram clicáveis)">
                          <textarea
                            className={inputCls + " min-h-[160px] py-2"}
                            style={{ resize: "vertical", height: "auto" }}
                            placeholder="Escreva aqui o conteúdo da aula. URLs serão clicáveis automaticamente."
                            value={editingLesson.text_content || ""}
                            onChange={(e) => setEditingLesson({ ...editingLesson, text_content: e.target.value })}
                          />
                        </Field>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Field label="Descrição curta (opcional, exibida abaixo do título)">
              <textarea
                className={inputCls + " h-24"}
                placeholder="Resumo curto da aula. Links serão clicáveis."
                value={editingLesson.description || ""}
                onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
              />
            </Field>
            <Field label="Duração (segundos)"><input type="number" className={inputCls} value={editingLesson.duration_seconds ?? ""} onChange={(e) => setEditingLesson({ ...editingLesson, duration_seconds: e.target.value ? Number(e.target.value) : null })} /></Field>

            {/* Botões de redirect (CTAs) */}
            <div className="border border-white/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Botões de redirect (acima da descrição)</p>
                <button onClick={() => setLessonCtas([...lessonCtas, { label: "", url: "", position: lessonCtas.length }])} className="text-xs px-2 py-1 rounded bg-[#00ff88] text-black font-bold flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Adicionar botão
                </button>
              </div>
              {lessonCtas.length === 0 && <p className="text-xs text-gray-500">Nenhum botão. Adicione um para criar um CTA acima da descrição.</p>}
              {lessonCtas.map((c, i) => (
                <div key={i} className="border border-white/10 rounded p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">#{i + 1}</span>
                    <div className="flex flex-col gap-0.5 ml-auto">
                      <button disabled={i === 0} onClick={() => {
                        const a = [...lessonCtas]; [a[i-1], a[i]] = [a[i], a[i-1]]; setLessonCtas(a);
                      }} className="text-gray-400 disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                      <button disabled={i === lessonCtas.length - 1} onClick={() => {
                        const a = [...lessonCtas]; [a[i+1], a[i]] = [a[i], a[i+1]]; setLessonCtas(a);
                      }} className="text-gray-400 disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => setLessonCtas(lessonCtas.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-[#ff2d78]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <input className={inputCls} placeholder="Texto do botão" value={c.label} onChange={(e) => {
                    const a = [...lessonCtas]; a[i] = { ...c, label: e.target.value }; setLessonCtas(a);
                  }} />
                  <input className={inputCls} placeholder="https://..." value={c.url} onChange={(e) => {
                    const a = [...lessonCtas]; a[i] = { ...c, url: e.target.value }; setLessonCtas(a);
                  }} />
                </div>
              ))}
            </div>

            {/* Anexos / materiais */}
            <div className="border border-white/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Materiais / anexos para download</p>
                <label className="text-xs px-2 py-1 rounded bg-[#00ff88] text-black font-bold flex items-center gap-1 cursor-pointer">
                  <Plus className="h-3 w-3" /> Adicionar arquivo
                  <input type="file" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = await uploadLessonFile(f);
                    if (r) setLessonAttachments([...lessonAttachments, { name: f.name, file_url: r.url, size_bytes: r.size, mime: r.mime, position: lessonAttachments.length }]);
                    e.target.value = "";
                  }} />
                </label>
              </div>
              {lessonAttachments.length === 0 && <p className="text-xs text-gray-500">Nenhum arquivo. Os anexos ficam disponíveis para download para o aluno.</p>}
              {lessonAttachments.map((a, i) => (
                <div key={i} className="flex items-center gap-2 border border-white/10 rounded p-2">
                  <div className="flex flex-col gap-0.5">
                    <button disabled={i === 0} onClick={() => {
                      const arr = [...lessonAttachments]; [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; setLessonAttachments(arr);
                    }} className="text-gray-400 disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                    <button disabled={i === lessonAttachments.length - 1} onClick={() => {
                      const arr = [...lessonAttachments]; [arr[i+1], arr[i]] = [arr[i], arr[i+1]]; setLessonAttachments(arr);
                    }} className="text-gray-400 disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                  </div>
                  <a href={a.file_url} target="_blank" rel="noreferrer" className="flex-1 text-sm truncate text-gray-200 hover:text-[#00ff88]">{a.name}</a>
                  <span className="text-xs text-gray-500">{a.size_bytes ? (a.size_bytes / 1024 / 1024).toFixed(2) + " MB" : ""}</span>
                  <button onClick={() => setLessonAttachments(lessonAttachments.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-[#ff2d78]"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <Field label="Visibilidade">
              <select
                className={inputCls}
                value={editingLesson.status || (editingLesson.published === false ? "hidden" : "published")}
                onChange={(e) => setEditingLesson({ ...editingLesson, status: e.target.value as "hidden" | "published" | "coming_soon" })}
              >
                <option value="hidden">Oculta (não aparece)</option>
                <option value="published">Publicada (acesso liberado)</option>
                <option value="coming_soon">Em breve (aparece com tag, sem acesso)</option>
              </select>
            </Field>
            <Field label="Liberação (drip)">
              <div className="flex gap-2 items-center flex-wrap">
                <select
                  className={inputCls + " max-w-[220px]"}
                  value={(editingLesson.release_days ?? 0) > 0 ? "delayed" : "immediate"}
                  onChange={(e) => setEditingLesson({ ...editingLesson, release_days: e.target.value === "immediate" ? 0 : (editingLesson.release_days || 7) })}
                >
                  <option value="immediate">Imediata após pagamento</option>
                  <option value="delayed">Liberar após N dias</option>
                </select>
                {(editingLesson.release_days ?? 0) > 0 && (
                  <input type="number" min={1} className={inputCls + " max-w-[120px]"} value={editingLesson.release_days || 0}
                    onChange={(e) => setEditingLesson({ ...editingLesson, release_days: Math.max(1, Number(e.target.value) || 1) })} />
                )}
                <span className="text-xs text-gray-500">dias após a compra</span>
              </div>
            </Field>
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
    <div className="bg-[#111] border border-white/10 rounded-xl max-w-2xl w-full p-5 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>{title}</h3>
      {children}
    </div>
  </div>
);

export default Admin;
