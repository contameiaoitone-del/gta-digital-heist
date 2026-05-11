import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, Download, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MentoriaPaywall } from "@/components/membros/MentoriaPaywall";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  youtube_url: string | null;
  vturb_player_id: string | null;
  duration_seconds: number | null;
  position: number;
  status?: string;
  cta_enabled?: boolean | null;
  cta_label?: string | null;
  cta_url?: string | null;
  release_days?: number | null;
  content_mode?: string | null;
  header_image_url?: string | null;
  text_content?: string | null;
}
interface CTA { id: string; label: string; url: string; position: number }
interface Attachment { id: string; name: string; file_url: string; size_bytes: number | null; mime: string | null; position: number }

const linkify = (text: string) => {
  const re = /(https?:\/\/[^\s]+)/gi;
  const parts = text.split(re);
  return parts.map((part, i) =>
    /^https?:\/\//i.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00ff88] underline underline-offset-2 hover:brightness-110 break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};
interface Module {
  id: string;
  title: string;
  product?: string;
  kind?: string;
  release_days?: number | null;
}
interface LessonMeta {
  lesson_id: string;
  lesson_title: string;
  module_id: string;
  module_title: string;
  module_kind: string;
  module_price_cents: number | null;
  module_published: boolean;
  lesson_published: boolean;
}

const Aula = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [siblings, setSiblings] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<LessonMeta | null>(null);
  const [hasMentoriaAccess, setHasMentoriaAccess] = useState(false);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dripLockDays, setDripLockDays] = useState<number | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const tickRef = useRef<number>(0);
  const vturbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      // Always fetch metadata via SECURITY DEFINER fn so we know if it's a paid mentoria module
      const { data: metaRows } = await supabase.rpc("get_lesson_module_meta", { _lesson_id: id });
      const m = (metaRows as LessonMeta[] | null)?.[0] || null;
      setMeta(m);

      // Check mentoria access if applicable
      if (m?.module_kind === "mentoria" && session) {
        const { data: acc } = await supabase
          .from("member_access")
          .select("product, active")
          .eq("user_id", session.user.id)
          .in("product", ["mentoria", `mentoria:${m.module_id}`])
          .eq("active", true);
        setHasMentoriaAccess(((acc as { active: boolean }[] | null) || []).length > 0);
      } else {
        setHasMentoriaAccess(false);
      }

      const { data: lessonData } = await supabase.from("lessons").select("*").eq("id", id).maybeSingle();
      if (!lessonData) {
        setLoading(false);
        if (m) document.title = `${m.lesson_title} — Mentoria`;
        return;
      }
      const l = lessonData as Lesson;
      setLesson(l);
      const [mRes, sRes, pRes, ctaRes, attRes] = await Promise.all([
        supabase.from("modules").select("id, title, product, kind, release_days").eq("id", l.module_id).maybeSingle(),
        supabase.from("lessons").select("*").eq("module_id", l.module_id).order("position"),
        session ? supabase.from("lesson_progress").select("completed, watched_seconds").eq("user_id", session.user.id).eq("lesson_id", l.id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from("lesson_ctas").select("*").eq("lesson_id", l.id).order("position"),
        supabase.from("lesson_attachments").select("*").eq("lesson_id", l.id).order("position"),
      ]);
      const modData = (mRes.data as Module) || null;
      setModule(modData);
      setSiblings((sRes.data as Lesson[]) || []);
      setCompleted(!!(pRes as { data: { completed?: boolean } | null }).data?.completed);
      setCtas((ctaRes.data as CTA[]) || []);
      setAttachments((attRes.data as Attachment[]) || []);
      // Drip lock check (only treinamento)
      if (modData && session && modData.kind === "treinamento") {
        const moduleDays = modData.release_days || 0;
        const lessonDays = l.release_days || 0;
        const totalDays = Math.max(moduleDays, lessonDays);
        if (totalDays > 0 && modData.product) {
          const { data: acc } = await supabase
            .from("member_access")
            .select("granted_at")
            .eq("user_id", session.user.id)
            .eq("product", modData.product)
            .eq("active", true)
            .order("granted_at", { ascending: true })
            .limit(1)
            .maybeSingle();
          if (acc?.granted_at) {
            const unlockAt = new Date(new Date(acc.granted_at).getTime() + totalDays * 24 * 60 * 60 * 1000);
            const remainingMs = unlockAt.getTime() - Date.now();
            if (remainingMs > 0) {
              setDripLockDays(Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
            } else setDripLockDays(null);
          }
        } else setDripLockDays(null);
      } else setDripLockDays(null);
      setLoading(false);
      document.title = `${l.title} — Treinamento`;
    })();
  }, [id, session]);

  // Save progress every 10s while on page
  useEffect(() => {
    if (!lesson || !session) return;
    const interval = setInterval(async () => {
      tickRef.current += 10;
      await supabase.from("lesson_progress").upsert(
        {
          user_id: session.user.id,
          lesson_id: lesson.id,
          watched_seconds: tickRef.current,
          last_watched_at: new Date().toISOString(),
          completed: completed || (lesson.duration_seconds ? tickRef.current >= lesson.duration_seconds * 0.9 : false),
        },
        { onConflict: "user_id,lesson_id" },
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [lesson, session, completed]);

  // Inject VTURB embed (HTML + scripts) safely so <script> tags execute
  useEffect(() => {
    const container = vturbRef.current;
    if (!container || !lesson?.vturb_player_id) return;
    container.innerHTML = "";
    const tpl = document.createElement("template");
    tpl.innerHTML = lesson.vturb_player_id.trim();
    Array.from(tpl.content.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const s = document.createElement("script");
        Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
        s.text = old.text;
        container.appendChild(s);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });
  }, [lesson?.vturb_player_id]);

  const idx = useMemo(() => siblings.findIndex((s) => s.id === lesson?.id), [siblings, lesson]);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const markComplete = async () => {
    if (!lesson || !session) return;
    setCompleted(true);
    await supabase.from("lesson_progress").upsert(
      {
        user_id: session.user.id,
        lesson_id: lesson.id,
        completed: true,
        watched_seconds: lesson.duration_seconds || tickRef.current,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Mentoria locked: show paywall
  if (meta && meta.module_kind === "mentoria" && !hasMentoriaAccess) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <header className="sticky top-0 z-40 bg-[#080808]/95 border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/membros")} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold truncate">{meta.module_title}</p>
          </div>
        </header>
        <div className="px-4 py-10">
          <MentoriaPaywall
            moduleId={meta.module_id}
            moduleTitle={meta.module_title}
            priceCents={meta.module_price_cents || 0}
            onPaid={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-400">Aula não encontrada</p>
          <Link to="/membros" className="underline">Voltar</Link>
        </div>
      </div>
    );
  }

  if (lesson.status === "coming_soon") {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <header className="sticky top-0 z-40 bg-[#080808]/95 border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/membros")} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="text-sm font-semibold truncate">{lesson.title}</p>
          </div>
        </header>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <span className="inline-block bg-[#facc15] text-black rounded px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
            Em breve
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>
            {lesson.title}
          </h1>
          <p className="text-gray-400 mb-8">Esta aula ainda não foi liberada. Volte em breve!</p>
          <Link to={module ? `/membros/modulo/${module.id}` : "/membros"} className="inline-block px-5 py-3 rounded bg-[#00ff88] text-black font-bold uppercase text-sm">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-40 bg-[#080808]/95 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/membros")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#00ff88] uppercase tracking-wider truncate">{module?.title}</p>
            <p className="text-sm font-semibold truncate">{lesson.title}</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {lesson.vturb_player_id ? (
              <div ref={vturbRef} className="w-full h-full [&>*]:w-full [&>*]:h-full" />
            ) : lesson.youtube_id ? (
              <iframe
                ref={playerRef}
                src={`https://www.youtube.com/embed/${lesson.youtube_id}?rel=0&modestbranding=1`}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Vídeo ainda não disponível
              </div>
            )}
          </div>

          <div className="mt-5 flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>
                {lesson.title}
              </h1>
              {lesson.cta_enabled && lesson.cta_url && (
                <div className="flex justify-center my-4">
                  <a
                    href={lesson.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#00ff88] text-black font-bold uppercase text-sm hover:brightness-110 transition"
                    style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
                  >
                    {lesson.cta_label || "Acessar"}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              )}
              {lesson.description && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {linkify(lesson.description)}
                </p>
              )}
            </div>
            <button
              onClick={markComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded font-bold uppercase text-sm border ${
                completed ? "bg-[#00ff88] text-black border-[#00ff88]" : "border-white/20 text-white hover:border-[#00ff88]"
              }`}
              style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
            >
              <Check className="h-4 w-4" /> {completed ? "Concluída" : "Marcar como concluída"}
            </button>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            {prev ? (
              <Link to={`/membros/aula/${prev.id}`} className="flex items-center gap-2 px-4 py-2 rounded border border-white/15 hover:border-[#00ff88]">
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/membros/aula/${next.id}`} className="flex items-center gap-2 px-4 py-2 rounded bg-[#00ff88] text-black font-bold">
                Próxima <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <aside className="lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:sticky lg:top-20">
          <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-3">Aulas do módulo</h3>
          <ul className="space-y-1">
            {siblings.map((s, i) => (
              <li key={s.id}>
                <Link
                  to={`/membros/aula/${s.id}`}
                  className={`flex items-center gap-3 p-2 rounded hover:bg-white/5 ${s.id === lesson.id ? "bg-white/10 border-l-2 border-[#00ff88]" : ""}`}
                >
                  <span className="text-xs text-gray-500 w-6 text-right">{i + 1}.</span>
                  <span className="text-sm line-clamp-2 flex-1">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Aula;
