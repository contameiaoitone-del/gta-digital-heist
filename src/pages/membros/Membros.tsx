import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Play, LogOut, Settings, ChevronRight, CheckCircle2 } from "lucide-react";
import { useAuth, useSignOut } from "@/hooks/useAuth";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  position: number;
}
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  position: number;
}
interface Progress {
  lesson_id: string;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: string;
}

const ytThumb = (id: string | null) => (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);

const Membros = () => {
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const signOut = useSignOut();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Área de Membros — Real Life Academy";
    (async () => {
      const [mRes, lRes, pRes] = await Promise.all([
        supabase.from("modules").select("*").order("position"),
        supabase.from("lessons").select("*").order("position"),
        session ? supabase.from("lesson_progress").select("*").eq("user_id", session.user.id) : Promise.resolve({ data: [] as Progress[] }),
      ]);
      setModules((mRes.data as Module[]) || []);
      setLessons((lRes.data as Lesson[]) || []);
      const pmap: Record<string, Progress> = {};
      ((pRes as { data: Progress[] | null }).data || []).forEach((p) => (pmap[p.lesson_id] = p));
      setProgress(pmap);
      setLoading(false);
    })();
  }, [session]);

  const lessonsByModule = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach((l) => {
      (map[l.module_id] ||= []).push(l);
    });
    return map;
  }, [lessons]);

  const continueWatching = useMemo(() => {
    return lessons
      .filter((l) => progress[l.id] && !progress[l.id].completed && progress[l.id].watched_seconds > 5)
      .sort((a, b) => new Date(progress[b.id].last_watched_at).getTime() - new Date(progress[a.id].last_watched_at).getTime())
      .slice(0, 8);
  }, [lessons, progress]);

  const heroLesson = continueWatching[0] || lessons[0];
  const heroModule = heroLesson ? modules.find((m) => m.id === heroLesson.module_id) : null;

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#080808] via-[#080808]/95 to-transparent">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/membros" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.06em" }}>
              REAL LIFE <span style={{ color: "#00ff88" }}>ACADEMY</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded text-sm border border-white/15 hover:border-[#00ff88]">
                <Settings className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-2 rounded text-sm text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      {heroLesson && heroModule && (
        <section className="relative -mt-16 h-[60vh] min-h-[420px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroModule.cover_url || heroLesson.thumbnail_url || ytThumb(heroLesson.youtube_id) || ""})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/50 to-transparent" />
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-12">
            <p className="text-xs uppercase tracking-widest text-[#00ff88] mb-2">{heroModule.title}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 max-w-2xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>
              {heroLesson.title}
            </h1>
            {heroLesson.description && <p className="text-gray-300 max-w-xl mb-5 line-clamp-3">{heroLesson.description}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/membros/aula/${heroLesson.id}`)}
                className="flex items-center gap-2 px-6 py-3 rounded font-bold uppercase"
                style={{ backgroundColor: "#fff", color: "#000", fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
              >
                <Play className="h-5 w-5 fill-black" /> {progress[heroLesson.id] ? "Continuar" : "Assistir"}
              </button>
              <button
                onClick={() => navigate(`/membros/modulo/${heroLesson.module_id}`)}
                className="flex items-center gap-2 px-6 py-3 rounded font-bold uppercase border border-white/30 hover:border-white"
                style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
              >
                Ver módulo
              </button>
            </div>
          </div>
        </section>
      )}

      {!loading && modules.length === 0 && (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            Conteúdo em breve
          </h2>
          <p className="text-gray-400">Os módulos serão liberados em breve. Volte logo!</p>
          {isAdmin && (
            <Link to="/admin" className="inline-block mt-6 px-5 py-3 rounded bg-[#00ff88] text-black font-bold uppercase text-sm">
              Cadastrar conteúdo no admin
            </Link>
          )}
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-8 space-y-12">
        {/* Continue assistindo (aulas individuais) */}
        {continueWatching.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.04em" }}>
                Continue assistindo
              </h2>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
              {continueWatching.map((l) => {
                const p = progress[l.id];
                const pct = p && l.duration_seconds ? Math.min(100, (p.watched_seconds / l.duration_seconds) * 100) : 0;
                return (
                  <Link
                    key={l.id}
                    to={`/membros/aula/${l.id}`}
                    className="group relative flex-shrink-0 w-[260px] md:w-[300px] aspect-video rounded-md overflow-hidden snap-start bg-[#1a1a1a] border border-white/5 hover:border-white/30 hover:scale-[1.03] transition-all"
                  >
                    {(l.thumbnail_url || ytThumb(l.youtube_id)) && (
                      <img src={l.thumbnail_url || ytThumb(l.youtube_id) || ""} alt={l.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-xs text-[#00ff88] uppercase tracking-wider mb-1 line-clamp-1">
                        {modules.find((m) => m.id === l.module_id)?.title}
                      </p>
                      <p className="text-sm font-semibold line-clamp-2">{l.title}</p>
                    </div>
                    {pct > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                        <div className="h-full bg-[#00ff88]" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* GRID DE MÓDULOS estilo Netflix */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.04em" }}>
              Módulos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {modules.map((m) => {
              const list = lessonsByModule[m.id] || [];
              const total = list.length;
              const done = list.filter((l) => progress[l.id]?.completed).length;
              const pct = total ? (done / total) * 100 : 0;
              return (
                <Link
                  key={m.id}
                  to={`/membros/modulo/${m.id}`}
                  className="group relative aspect-video rounded-lg overflow-hidden bg-[#141414] border border-white/5 hover:border-[#00ff88]/60 hover:scale-[1.03] transition-all"
                >
                  {m.cover_url ? (
                    <img src={m.cover_url} alt={m.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg md:text-xl font-bold line-clamp-2 mb-1" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>
                      {m.title}
                    </h3>
                    <p className="text-xs text-gray-300 mb-2">
                      {total} {total === 1 ? "aula" : "aulas"}
                      {done > 0 && <span className="text-[#00ff88]"> · {done} concluída{done === 1 ? "" : "s"}</span>}
                    </p>
                    {pct > 0 && (
                      <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00ff88]" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="rounded-full bg-white/95 text-black p-4">
                      <Play className="h-8 w-8 fill-black" />
                    </div>
                  </div>
                  {pct === 100 && total > 0 && (
                    <div className="absolute top-3 right-3 bg-[#00ff88] text-black rounded-full p-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Membros;
