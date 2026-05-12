import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, CheckCircle2, LogOut, Settings } from "lucide-react";
import { useAuth, useSignOut } from "@/hooks/useAuth";
import { MentoriaPaywall } from "@/components/membros/MentoriaPaywall";
import { useResolvedArea } from "@/hooks/useResolvedArea";
import SmartThumb from "@/components/membros/SmartThumb";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  kind?: string;
  price_cents?: number | null;
  status?: string;
  product?: string;
  release_days?: number | null;
  paywall_notice?: string | null;
}
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  vturb_player_id?: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  position: number;
  status?: string;
  release_days?: number | null;
}
interface Progress {
  lesson_id: string;
  watched_seconds: number;
  completed: boolean;
}

const ytThumb = (id: string | null) => (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);
const vturbThumbs = (embed: string | null | undefined): string[] => {
  if (!embed) return [];
  const match = embed.match(/scripts\.converteai\.net\/([0-9a-f-]+)\/players\/([0-9a-f]+)/i);
  if (!match) return [];
  const [, account, player] = match;
  return [
    `https://images.converteai.net/${account}/players/${player}/thumbnail.jpg?width=1280`,
    `https://images.converteai.net/${account}/players/${player}/thumbnail.jpg`,
  ];
};
const fmtDuration = (s: number | null) => {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}min`;
  return `${m}min ${sec ? sec + "s" : ""}`.trim();
};

const Modulo = () => {
  const { product: routeParamRaw = "treinamento", id } = useParams<{ product?: string; id: string }>();
  const resolved = useResolvedArea();
  const product = resolved.loading ? "" : (resolved.product || routeParamRaw);
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const signOut = useSignOut();
  const [mod, setMod] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [hasMentoriaAccess, setHasMentoriaAccess] = useState(false);
  const [accessGrantedAt, setAccessGrantedAt] = useState<string | null>(null);
  const productPath = `/${encodeURIComponent(routeParamRaw)}`;

  useEffect(() => {
    if (!id || !product) return;
    (async () => {
      const [mRes, lRes, pRes] = await Promise.all([
        supabase.from("modules").select("*").eq("id", id).eq("product", product).maybeSingle(),
        supabase.from("lessons").select("*").eq("module_id", id).in("status", ["published", "coming_soon"]).order("position"),
        session ? supabase.from("lesson_progress").select("*").eq("user_id", session.user.id) : Promise.resolve({ data: [] as Progress[] }),
      ]);
      if (!mRes.data) setNotFound(true);
      else {
        setMod(mRes.data as Module);
        document.title = `${(mRes.data as Module).title} — Treinamento`;
      }
      setLessons((lRes.data as Lesson[]) || []);
      const pmap: Record<string, Progress> = {};
      ((pRes as { data: Progress[] | null }).data || []).forEach((p) => (pmap[p.lesson_id] = p));
      setProgress(pmap);
      // Check mentoria access
      const m = mRes.data as Module | null;
      if (m?.kind === "mentoria" && session) {
        const { data: acc } = await supabase
          .from("member_access")
          .select("id")
          .eq("user_id", session.user.id)
          .in("product", [`mentoria:${m.id}`, "mentoria"])
          .eq("active", true)
          .maybeSingle();
        setHasMentoriaAccess(!!acc);
      } else {
        setHasMentoriaAccess(true);
      }
      // Drip access lookup for treinamento
      if (m?.kind === "treinamento" && session && m.product) {
        const { data: acc } = await supabase
          .from("member_access")
          .select("granted_at")
          .eq("user_id", session.user.id)
          .eq("product", m.product)
          .eq("active", true)
          .order("granted_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        setAccessGrantedAt((acc as { granted_at: string } | null)?.granted_at || null);
      }
      setLoading(false);
    })();
  }, [id, session, product]);

  const lessonLockDays = (l: Lesson): number | null => {
    if (!mod || mod.kind !== "treinamento") return null;
    const days = Math.max(mod.release_days || 0, l.release_days || 0);
    if (days <= 0 || !accessGrantedAt) return null;
    const remaining = new Date(accessGrantedAt).getTime() + days * 86400000 - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 86400000) : null;
  };

  const nextLesson = useMemo(() => {
    const playable = lessons.filter((l) => l.status !== "coming_soon");
    const inProgress = playable.find((l) => progress[l.id] && !progress[l.id].completed);
    return inProgress || playable.find((l) => !progress[l.id]?.completed) || playable[0];
  }, [lessons, progress]);

  if (notFound) return <Navigate to={`${productPath}/membros`} replace />;

  const isMentoriaLocked = mod?.kind === "mentoria" && !hasMentoriaAccess;

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-24">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#080808] via-[#080808]/95 to-transparent">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to={`${productPath}/membros`} className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm uppercase tracking-wider">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to={`${productPath}/admin`} className="hidden sm:flex items-center gap-1 px-3 py-2 rounded text-sm border border-white/15 hover:border-[#00ff88]">
                <Settings className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-2 rounded text-sm text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* HERO do módulo */}
      {mod && (
        <section className="relative -mt-16 h-[55vh] min-h-[380px] w-full overflow-hidden">
          {mod.cover_url && (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mod.cover_url})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/85 via-[#080808]/40 to-transparent" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-10">
            <p className="text-xs uppercase tracking-widest text-[#00ff88] mb-2">Módulo</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 max-w-3xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}>
              {mod.title}
            </h1>
            {mod.description && <p className="text-gray-300 max-w-2xl mb-5 line-clamp-3">{mod.description}</p>}
            {nextLesson && !isMentoriaLocked && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`${productPath}/membros/aula/${nextLesson.id}`)}
                  className="flex items-center gap-2 px-6 py-3 rounded font-bold uppercase"
                  style={{ backgroundColor: "#fff", color: "#000", fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}
                >
                  <Play className="h-5 w-5 fill-black" />
                  {progress[nextLesson.id] ? "Continuar" : "Começar"}
                </button>
                <span className="px-4 py-3 text-sm text-gray-300">
                  {lessons.length} {lessons.length === 1 ? "aula" : "aulas"}
                </span>
              </div>
            )}
            {isMentoriaLocked && (
              <div className="px-4 py-3 text-sm text-gray-300 inline-block bg-black/40 rounded border border-white/10">
                {lessons.length} {lessons.length === 1 ? "aula" : "aulas"} · acesso bloqueado
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lista de aulas */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 mt-10">
        {isMentoriaLocked && mod ? (
          <MentoriaPaywall
            moduleId={mod.id}
            moduleTitle={mod.title}
            priceCents={mod.price_cents || 0}
            defaultName={(session?.user?.user_metadata as { full_name?: string })?.full_name || ""}
            onPaid={() => window.location.reload()}
          />
        ) : (
          <>
        <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.04em" }}>
          Aulas
        </h2>
        {!loading && lessons.length === 0 && (
          <p className="text-gray-400">Nenhuma aula publicada ainda.</p>
        )}
        <ul className="divide-y divide-white/5 border-y border-white/5">
          {lessons.map((l, idx) => {
            const p = progress[l.id];
            const pct = p && l.duration_seconds ? Math.min(100, (p.watched_seconds / l.duration_seconds) * 100) : p?.completed ? 100 : 0;
            const coming = l.status === "coming_soon";
            const lockDays = lessonLockDays(l);
            const locked = coming || (lockDays !== null && lockDays > 0);
            const RowEl: React.ElementType = locked ? "div" : Link;
            const rowProps = locked ? { "aria-disabled": true } : { to: `${productPath}/membros/aula/${l.id}` };
            return (
              <li key={l.id}>
                <RowEl
                  {...rowProps}
                  className={`group flex gap-4 py-4 px-2 -mx-2 rounded transition-colors ${locked ? "cursor-not-allowed opacity-70" : "hover:bg-white/[0.03]"}`}
                >
                  <div className="text-2xl md:text-3xl text-gray-600 font-bold w-8 md:w-10 text-center flex-shrink-0" style={{ fontFamily: "'Bebas Neue', cursive" }}>
                    {idx + 1}
                  </div>
                  <div className="relative w-32 md:w-48 aspect-video flex-shrink-0 rounded overflow-hidden bg-[#1a1a1a]">
                    <SmartThumb
                      sources={[l.thumbnail_url, ytThumb(l.youtube_id), ...vturbThumbs(l.vturb_player_id), mod?.cover_url]}
                      alt={l.title}
                      className={`w-full h-full object-cover ${locked ? "grayscale" : ""}`}
                    />
                    {!locked && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    )}
                    {coming && (
                      <div className="absolute top-1 left-1 bg-[#facc15] text-black rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
                        Em breve
                      </div>
                    )}
                    {!coming && lockDays !== null && lockDays > 0 && (
                      <div className="absolute top-1 left-1 bg-[#facc15] text-black rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
                        Libera em {lockDays}d
                      </div>
                    )}
                    {pct > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                        <div className="h-full bg-[#00ff88]" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base md:text-lg line-clamp-1">{l.title}</h3>
                      {p?.completed && <CheckCircle2 className="h-4 w-4 text-[#00ff88] flex-shrink-0" />}
                      {coming && <span className="text-[10px] bg-[#facc15] text-black rounded px-1.5 py-0.5 font-bold uppercase">Em breve</span>}
                      {!coming && lockDays !== null && lockDays > 0 && (
                        <span className="text-[10px] bg-[#facc15] text-black rounded px-1.5 py-0.5 font-bold uppercase">Libera em {lockDays}d</span>
                      )}
                    </div>
                    {l.description && <p className="text-sm text-gray-400 line-clamp-2 mb-1">{l.description}</p>}
                    {l.duration_seconds && <p className="text-xs text-gray-500">{fmtDuration(l.duration_seconds)}</p>}
                  </div>
                </RowEl>
              </li>
            );
          })}
        </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Modulo;
