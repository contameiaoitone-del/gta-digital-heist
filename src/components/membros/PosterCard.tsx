import { Link } from "react-router-dom";
import { Play, CheckCircle2 } from "lucide-react";

interface PosterCardProps {
  to: string;
  title: string;
  cover: string | null;
  description?: string | null;
  meta?: string;
  progressPct?: number;
  completed?: boolean;
}

const PosterCard = ({ to, title, cover, description, meta, progressPct = 0, completed }: PosterCardProps) => {
  return (
    <Link
      to={to}
      className="group/card relative flex-shrink-0 w-[150px] md:w-[200px] snap-start hover:z-20"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#141414] border border-white/5 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:border-white/30">
        {cover ? (
          <img src={cover} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
            className="text-sm font-bold line-clamp-2 mb-1"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.03em" }}
          >
            {title}
          </h3>
          {description && <p className="text-[11px] text-gray-300 line-clamp-2">{description}</p>}
        </div>
      </div>

      {/* Title under card on mobile */}
      <p className="md:hidden mt-2 text-xs text-gray-300 line-clamp-2 px-1">{title}</p>
    </Link>
  );
};

export default PosterCard;
