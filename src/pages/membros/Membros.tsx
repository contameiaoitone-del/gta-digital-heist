import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Play, LogOut, Settings } from "lucide-react";
import { useAuth, useSignOut } from "@/hooks/useAuth";
import Row from "@/components/membros/Row";
import PosterCard from "@/components/membros/PosterCard";
import EpisodeCard from "@/components/membros/EpisodeCard";
import infozapBanner from "@/assets/membros-billboard.png";
import infozapLogo from "@/assets/infozap-logo.png";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  position: number;
  created_at?: string;
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
    document.title = "Área de Membros — InfoZap";
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
      .slice(0, 12);
  }, [lessons, progress]);

  const heroLesson = continueWatching[0] || lessons[0];
  const heroModule = heroLesson ? modules.find((m) => m.id === heroLesson.module_id) : modules[0];

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-transparent">
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
          <Link to="/membros" className="flex items-center">
            <img src={infozapLogo} alt="InfoZap" className="h-16 md:h-20 lg:h-24 w-auto select-none" />
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

      {/* BILLBOARD fixo InfoZap (estilo Netflix) */}
      <section className="relative h-[58vh] min-h-[420px] max-h-[640px] w-full overflow-hidden pt-16">
        <img
          src={infozapBanner}
          alt="InfoZap"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-[#080808]/20" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />

        <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 h-full flex flex-col justify-end pb-16 md:pb-20">
          <img
            src={infozapLogo}
            alt="InfoZap"
            className="w-auto max-w-[260px] md:max-w-[340px] lg:max-w-[400px] h-auto max-h-[110px] md:max-h-[140px] lg:max-h-[160px] object-contain object-left -ml-2 mb-3 drop-shadow-2xl select-none pointer-events-none"
          />
          <p className="text-sm md:text-base text-gray-200 max-w-xl mb-5 line-clamp-3 drop-shadow-lg">
            O método completo para escalar produtos digitais no WhatsApp. Tráfego pago, criativos, copy, escala e os bastidores reais de quem fatura todo dia.
          </p>
          <div className="flex flex-wrap gap-3">
            {heroLesson && (
              <button
                onClick={() => navigate(`/membros/aula/${heroLesson.id}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded font-bold uppercase bg-white text-black hover:bg-white/85 transition-colors text-sm"
                style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
              >
                <Play className="h-4 w-4 fill-black" /> {progress[heroLesson.id] ? "Continuar assistindo" : "Começar agora"}
              </button>
            )}
          </div>
        </div>
      </section>

      {!loading && modules.length === 0 && (
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
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

      <div className="max-w-[1800px] mx-auto mt-6 md:mt-8 relative z-20 space-y-2">
        {/* Continue assistindo */}
        {continueWatching.length > 0 && (
          <Row title="Continue assistindo">
            {continueWatching.map((l) => {
              const p = progress[l.id];
              const pct = p && l.duration_seconds ? Math.min(100, (p.watched_seconds / l.duration_seconds) * 100) : 0;
              return (
                <EpisodeCard
                  key={l.id}
                  to={`/membros/aula/${l.id}`}
                  title={l.title}
                  thumb={l.thumbnail_url || ytThumb(l.youtube_id)}
                  moduleTitle={modules.find((m) => m.id === l.module_id)?.title}
                  progressPct={pct}
                />
              );
            })}
          </Row>
        )}

        {/* Módulos (cards 2:3 estilo Netflix) */}
        {modules.length > 0 && (
          <Row title="Módulos">
            {modules.map((m) => {
              const list = lessonsByModule[m.id] || [];
              const total = list.length;
              const done = list.filter((l) => progress[l.id]?.completed).length;
              const pct = total ? (done / total) * 100 : 0;
              return (
                <PosterCard
                  key={m.id}
                  to={`/membros/modulo/${m.id}`}
                  title={m.title}
                  cover={m.cover_url}
                  description={m.description}
                  meta={`${total} ${total === 1 ? "aula" : "aulas"}`}
                  progressPct={pct}
                  completed={pct === 100 && total > 0}
                />
              );
            })}
          </Row>
        )}

      </div>
    </div>
  );
};

export default Membros;
