import { Link } from "react-router-dom";
import SmartThumb from "./SmartThumb";

interface EpisodeCardProps {
  to: string;
  title: string;
  thumb?: string | null;
  thumbs?: (string | null | undefined)[];
  moduleTitle?: string;
  progressPct?: number;
}

const EpisodeCard = ({ to, title, thumb, thumbs, moduleTitle, progressPct = 0 }: EpisodeCardProps) => (
  <Link
    to={to}
    className="group/ep relative flex-shrink-0 w-[260px] md:w-[320px] snap-start"
  >
    <div className="relative aspect-video rounded-md overflow-hidden bg-[#141414] border border-white/5 transition-transform duration-300 group-hover/ep:scale-[1.04] group-hover/ep:border-white/30">
      <SmartThumb
        sources={thumbs && thumbs.length > 0 ? thumbs : [thumb]}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        {moduleTitle && (
          <p className="text-[10px] text-[#00ff88] uppercase tracking-wider mb-0.5 line-clamp-1">{moduleTitle}</p>
        )}
        <p className="text-sm font-semibold line-clamp-2">{title}</p>
      </div>
      {progressPct > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
          <div className="h-full bg-[#00ff88]" style={{ width: `${progressPct}%` }} />
        </div>
      )}
    </div>
  </Link>
);

export default EpisodeCard;
