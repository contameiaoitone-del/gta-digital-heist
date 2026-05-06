import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  youtube_url: string | null;
  duration_seconds: number | null;
  position: number;
}
interface Module {
  id: string;
  title: string;
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
  const playerRef = useRef<HTMLIFrameElement>(null);
  const tickRef = useRef<number>(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const { data: lessonData } = await supabase.from("lessons").select("*").eq("id", id).maybeSingle();
      if (!lessonData) {
        setLoading(false);
        return;
      }
      const l = lessonData as Lesson;
      setLesson(l);
      const [mRes, sRes, pRes] = await Promise.all([
        supabase.from("modules").select("id, title").eq("id", l.module_id).maybeSingle(),
        supabase.from("lessons").select("*").eq("module_id", l.module_id).order("position"),
        session ? supabase.from("lesson_progress").select("completed, watched_seconds").eq("user_id", session.user.id).eq("lesson_id", l.id).maybeSingle() : Promise.resolve({ data: null }),
      ]);
      setModule((mRes.data as Module) || null);
      setSiblings((sRes.data as Lesson[]) || []);
      setCompleted(!!(pRes as { data: { completed?: boolean } | null }).data?.completed);
      setLoading(false);
      document.title = `${l.title} — Real Life Academy`;
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
            {lesson.youtube_id ? (
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
              {lesson.description && <p className="text-gray-300 leading-relaxed">{lesson.description}</p>}
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
