import { Link } from "react-router-dom";
import { Play, CheckCircle2 } from "lucide-react";

interface PosterCardProps {
  to: string;
  title: string;
  cover: string | null;
  description?: string | null;
  category?: string | null;
  meta?: string;
  progressPct?: number;
  completed?: boolean;
  comingSoon?: boolean;
  lockedDays?: number | null;
  categoryColor?: string | null;
}

const PosterCard = ({ to, title, cover, description, category, meta, progressPct = 0, completed, comingSoon, lockedDays, categoryColor }: PosterCardProps) => {
  const isLocked = comingSoon || (typeof lockedDays === "number" && lockedDays > 0);
  const Wrapper: React.ElementType = isLocked ? "div" : Link;
  const wrapperProps = isLocked ? { "aria-disabled": true } : { to };
  return (
    <Wrapper
      {...wrapperProps}
      className={`group/card relative flex-shrink-0 w-[180px] md:w-[240px] lg:w-[260px] snap-start hover:z-20 ${isLocked ? "cursor-not-allowed" : ""}`}
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#141414] border border-white/5 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:border-white/30">
        {cover ? (
          <img src={cover} alt={title} className={`absolute inset-0 w-full h-full object-cover ${isLocked ? "grayscale opacity-60" : ""}`} loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
            <span
              className="text-xl text-center px-3 text-white/40"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              {title}
            </span>
          </div>
        )}

        {comingSoon && (
          <div className="absolute top-2 left-2 bg-[#facc15] text-black rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider z-10" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
            Em breve
          </div>
        )}
        {!comingSoon && typeof lockedDays === "number" && lockedDays > 0 && (
          <div className="absolute top-2 left-2 bg-[#facc15] text-black rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider z-10" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em" }}>
            Libera em {lockedDays}d
          </div>
        )}

        {completed && (
          <div className="absolute top-2 right-2 bg-[#00ff88] text-black rounded-full p-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}

        {progressPct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
            <div className="h-full bg-[#00ff88]" style={{ width: `${progressPct}%` }} />
          </div>
        )}

        {/* Hover overlay (desktop) */}
        <div className="absolute inset-0 hidden md:flex flex-col justify-end p-3 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
          <div className="rounded-full bg-white/95 text-black p-3 self-start mb-2">
            <Play className="h-4 w-4 fill-black" />
          </div>
          {meta && <p className="text-[10px] text-[#00ff88] uppercase tracking-wider mb-1">{meta}</p>}
          <h3
            className="text-base font-bold line-clamp-2 mb-1"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}
          >
            {title}
          </h3>
          {description && <p className="text-[11px] text-gray-300 line-clamp-2">{description}</p>}
        </div>
      </div>

      {/* Title + category under card */}
      <div className="mt-2 px-1">
        <p className="text-xs md:text-sm text-gray-200 line-clamp-2 font-semibold">{title}</p>
        {category && (
          <p
            className="text-[10px] uppercase tracking-wider mt-0.5"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.08em", color: categoryColor || "#9ca3af" }}
          >
            {category}
          </p>
        )}
      </div>
    </Wrapper>
  );
};

export default PosterCard;
