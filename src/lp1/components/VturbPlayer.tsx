import { useEffect, useRef } from "react";

interface VturbPlayerProps {
  videoId: string;
  className?: string;
}

const VturbPlayer = ({ videoId, className = "" }: VturbPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `<vturb-smartplayer id="${videoId}" autoplay="false" style="display: block; margin: 0 auto; width: 100%; max-width: 100%;"></vturb-smartplayer>`;
    }
  }, [videoId]);

  return <div ref={containerRef} className={className} />;
};

export default VturbPlayer;
