import { useEffect, useRef } from "react";

interface MentoriaVideoProps {
  videoId: string;
  accountId?: string;
  className?: string;
}

/**
 * VTurb smartplayer embed (custom element).
 * The VTurb script is loaded once per id and renders the player into the
 * <vturb-smartplayer> custom element.
 */
const DEFAULT_ACCOUNT_ID = "574be7f8-d9bf-450a-9bfb-e024758a6c13";

const MentoriaVideo = ({ videoId, accountId = DEFAULT_ACCOUNT_ID, className = "" }: MentoriaVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = `<vturb-smartplayer id="vid-${videoId}" style="display:block;margin:0 auto;width:100%;"></vturb-smartplayer>`;
    const scriptId = `vturb-script-${videoId}`;
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.type = "text/javascript";
      s.src = `https://scripts.converteai.net/${accountId}/players/${videoId}/v4/player.js`;
      document.head.appendChild(s);
    }
  }, [videoId, accountId]);

  return <div ref={containerRef} className={className} />;
};

export default MentoriaVideo;