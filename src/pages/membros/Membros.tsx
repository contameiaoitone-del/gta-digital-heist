import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Play, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useAuth, useSignOut } from "@/hooks/useAuth";
import Row from "@/components/membros/Row";
import PosterCard from "@/components/membros/PosterCard";
import EpisodeCard from "@/components/membros/EpisodeCard";
import PasskeySetup from "@/components/membros/PasskeySetup";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProfileDialog from "@/components/membros/ProfileDialog";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  position: number;
  category: string | null;
  status?: string;
  created_at?: string;
  product?: string;
  kind?: string;
  release_days?: number | null;
}
interface Category {
  id: string;
  name: string;
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
  status?: string;
  release_days?: number | null;
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
  const { product = "treinamento" } = useParams<{ product?: string }>();
  const { isAdmin, session } = useAuth();
  const signOut = useSignOut();
  const { settings } = useSiteSettings();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [accessByProduct, setAccessByProduct] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userVars, setUserVars] = useState<{ name: string; full_name: string; email: string; phone: string }>({ name: "", full_name: "", email: "", phone: "" });
  const productPath = `/${encodeURIComponent(product)}`;

  useEffect(() => {
    document.title = "Área de Membros — Treinamento";
    (async () => {
      const [mRes, lRes, cRes, pRes, aRes] = await Promise.all([
        supabase.from("modules").select("*").eq("product", product).order("position"),
        supabase.from("lessons").select("*").order("position"),
        supabase.from("module_categories").select("*").eq("product", product).order("position"),
        session ? supabase.from("lesson_progress").select("*").eq("user_id", session.user.id) : Promise.resolve({ data: [] as Progress[] }),
        session ? supabase.from("member_access").select("product, granted_at").eq("user_id", session.user.id).eq("active", true) : Promise.resolve({ data: [] }),
      ]);
      const loadedModules = (mRes.data as Module[]) || [];
      const moduleIds = new Set(loadedModules.map((m) => m.id));
      setModules(loadedModules);
      setLessons(((lRes.data as Lesson[]) || []).filter((l) => moduleIds.has(l.module_id)));
      setCategories((cRes.data as Category[]) || []);
      const pmap: Record<string, Progress> = {};
      ((pRes as { data: Progress[] | null }).data || []).forEach((p) => (pmap[p.lesson_id] = p));
      setProgress(pmap);
      const amap: Record<string, string> = {};
      ((aRes as { data: { product: string; granted_at: string }[] | null }).data || []).forEach((a) => {
        if (!amap[a.product] || a.granted_at < amap[a.product]) amap[a.product] = a.granted_at;
      });
      setAccessByProduct(amap);
      setLoading(false);

      if (session) {
        const email = session.user.email || "";
        const { data: prof } = await supabase.from("profiles").select("full_name, email").eq("id", session.user.id).maybeSingle();
        const fullName = (prof?.full_name as string | null) || (session.user.user_metadata?.full_name as string | undefined) || "";
        let phone = (session.user.user_metadata?.phone as string | undefined) || "";
        if (!phone && email) {
          const { data: ord } = await supabase.from("orders").select("customer_phone, customer_name").eq("customer_email", email).order("created_at", { ascending: false }).limit(1).maybeSingle();
          if (ord?.customer_phone) phone = ord.customer_phone as string;
        }
        const first = (fullName || "").trim().split(/\s+/)[0] || "";
        setUserVars({ name: first, full_name: fullName, email, phone });
      }
    })();
  }, [session, product]);

  const computeLockDays = (m: Module): number | null => {
    if (m.kind !== "treinamento") return null;
    const days = m.release_days || 0;
    if (days <= 0) return null;
    const grantedAt = m.product ? accessByProduct[m.product] : null;
    if (!grantedAt) return null;
    const unlockMs = new Date(grantedAt).getTime() + days * 86400000;
    const remaining = unlockMs - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 86400000) : null;
  };

  const lessonsByModule = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach((l) => {
      (map[l.module_id] ||= []).push(l);
    });
    return map;
  }, [lessons]);

  const continueWatching = useMemo(() => {
    return lessons
      .filter((l) => l.status !== "coming_soon" && progress[l.id] && !progress[l.id].completed && progress[l.id].watched_seconds > 5)
      .sort((a, b) => new Date(progress[b.id].last_watched_at).getTime() - new Date(progress[a.id].last_watched_at).getTime())
      .slice(0, 12);
  }, [lessons, progress]);

  const heroLesson = continueWatching[0] || lessons.find((l) => l.status !== "coming_soon");
  const heroModule = heroLesson ? modules.find((m) => m.id === heroLesson.module_id) : modules[0];

  const renderVars = (html: string) =>
    html
      .replace(/\{\{\s*name\s*\}\}/g, userVars.name)
      .replace(/\{\{\s*full_name\s*\}\}/g, userVars.full_name)
      .replace(/\{\{\s*email\s*\}\}/g, userVars.email)
      .replace(/\{\{\s*phone\s*\}\}/g, userVars.phone);

  const totalLessons = lessons.filter((l) => l.status !== "coming_soon").length;
  const completedLessons = lessons.filter((l) => l.status !== "coming_soon" && progress[l.id]?.completed).length;
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="relative min-h-screen text-white pb-20" style={{ backgroundColor: settings.primary_color || "#080808" }}>
      <header className="fixed top-0 left-0 right-0 z-40" style={{ background: `linear-gradient(to bottom, ${settings.primary_color || "#080808"}, ${settings.primary_color || "#080808"}cc, transparent)` }}>
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="block max-h-16 w-auto" />
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to={`${productPath}/admin`} className="hidden sm:flex items-center gap-1 px-3 py-2 rounded text-sm border border-white/15 hover:border-[var(--ms-secondary,#00ff88)]" style={{ ['--ms-secondary' as any]: settings.secondary_color || "#00ff88" }}>
                <Settings className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={() => setProfileOpen(true)} className="flex items-center gap-1 px-3 py-2 rounded text-sm text-gray-300 hover:text-white border border-white/15 hover:border-[var(--ms-secondary,#00ff88)]" style={{ ['--ms-secondary' as any]: settings.secondary_color || "#00ff88" }}>
              <UserIcon className="h-4 w-4" /> Perfil
            </button>
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-2 rounded text-sm text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* BILLBOARD fixo Treinamento (estilo Netflix) */}
      <section className="relative h-[58vh] min-h-[420px] max-h-[640px] w-full overflow-hidden pt-16">
        {settings.hero_media_type === "image" ? (
          <img
            src={settings.hero_media_url || "/membros-hero.mp4"}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <video
            src={settings.hero_media_url || "/membros-hero.mp4"}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            // @ts-expect-error - non-standard but supported attribute
            fetchpriority="high"
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${settings.primary_color || "#080808"}, ${settings.primary_color || "#080808"}cc, ${settings.primary_color || "#080808"}33)` }} />
        <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: `linear-gradient(to top, ${settings.primary_color || "#080808"}, ${settings.primary_color || "#080808"}d9, transparent)` }} />

        <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 h-full flex flex-col justify-end pb-16 md:pb-20">
          {settings.hero_title_html ? (
            <h1
              className="mb-3 font-gta uppercase leading-none drop-shadow-2xl select-none text-white text-5xl md:text-7xl lg:text-8xl"
              style={{ letterSpacing: "0.02em" }}
              dangerouslySetInnerHTML={{ __html: renderVars(settings.hero_title_html) }}
            />
          ) : (
            <h1
              className="mb-3 font-gta uppercase leading-none drop-shadow-2xl select-none text-white text-5xl md:text-7xl lg:text-8xl"
              style={{ letterSpacing: "0.02em" }}
            >
              {settings.hero_title || "Treinamento de X1"}
            </h1>
          )}
          {settings.hero_description_html ? (
            <div
              className="text-sm md:text-base text-gray-200 max-w-xl mb-5 drop-shadow-lg whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: renderVars(settings.hero_description_html) }}
            />
          ) : (
            <p className="text-sm md:text-base text-gray-200 max-w-xl mb-5 line-clamp-3 drop-shadow-lg whitespace-pre-line">
              {settings.hero_description}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {heroLesson && (
              <button
                onClick={() => navigate(`${productPath}/membros/aula/${heroLesson.id}`)}
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
            <Link to={`${productPath}/admin`} className="inline-block mt-6 px-5 py-3 rounded bg-[#00ff88] text-black font-bold uppercase text-sm">
              Cadastrar conteúdo no admin
            </Link>
          )}
        </div>
      )}

      <div className="max-w-[1800px] mx-auto mt-6 md:mt-8 relative z-20 space-y-2">
        <PasskeySetup />
        {/* Continue assistindo */}
        {continueWatching.length > 0 && (
          <Row title="Continue assistindo">
            {continueWatching.map((l) => {
              const p = progress[l.id];
              const pct = p && l.duration_seconds ? Math.min(100, (p.watched_seconds / l.duration_seconds) * 100) : 0;
              return (
                <EpisodeCard
                  key={l.id}
                  to={`${productPath}/membros/aula/${l.id}`}
                  title={l.title}
                  thumb={l.thumbnail_url || ytThumb(l.youtube_id)}
                  moduleTitle={modules.find((m) => m.id === l.module_id)?.title}
                  progressPct={pct}
                />
              );
            })}
          </Row>
        )}

        {/* Módulos agrupados por categoria */}
        {(() => {
          if (modules.length === 0) return null;
          const seen = new Map<string, Module[]>();
          modules.forEach((m) => {
            const key = m.category?.trim() || "Módulos";
            if (!seen.has(key)) seen.set(key, []);
            seen.get(key)!.push(m);
          });
          const orderMap = new Map(categories.map((c) => [c.name, c.position]));
          const groups = Array.from(seen.entries())
            .map(([category, mods]) => ({ category, mods }))
            .sort((a, b) => {
              const ai = orderMap.has(a.category) ? orderMap.get(a.category)! : 9999;
              const bi = orderMap.has(b.category) ? orderMap.get(b.category)! : 9999;
              return ai - bi;
            });
          return groups.map(({ category, mods }) => (
            <Row key={category} title={category}>
              {mods.map((m) => {
                const list = lessonsByModule[m.id] || [];
                const total = list.length;
                const done = list.filter((l) => progress[l.id]?.completed).length;
                const pct = total ? (done / total) * 100 : 0;
                return (
                  <PosterCard
                    key={m.id}
                    to={`${productPath}/membros/modulo/${m.id}`}
                    title={m.title}
                    cover={m.cover_url}
                    description={m.description}
                    category={m.category}
                    meta={`${total} ${total === 1 ? "aula" : "aulas"}`}
                    progressPct={pct}
                    completed={pct === 100 && total > 0}
                    comingSoon={m.status === "coming_soon"}
                    lockedDays={computeLockDays(m)}
                    categoryColor={settings.category_color_enabled ? (settings.category_color || "#a855f7") : null}
                  />
                );
              })}
            </Row>
          ));
        })()}

      </div>

      {/* Footer gradient — sutil, somente no fim do site */}
      {settings.footer_gradient_enabled && (
        <div
          className="pointer-events-none relative h-20 mt-12"
          style={{
            background: `linear-gradient(to top, ${settings.footer_gradient_color || "#a855f7"}26, ${settings.footer_gradient_color || "#a855f7"}0d, transparent)`,
          }}
        />
      )}

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        email={userVars.email}
        progressPct={overallPct}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />
    </div>
  );
};

export default Membros;
