import { useEffect, useRef } from "react";

interface MentoriaVideoProps {
  videoId: string;
  className?: string;
}

/**
 * VTurb smartplayer embed (custom element).
 * The VTurb script is loaded once per id and renders the player into the
 * <vturb-smartplayer> custom element.
 */
const MentoriaVideo = ({ videoId, className = "" }: MentoriaVideoProps) => {
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
      // TODO: substituir ACCOUNT_ID pelo seu ID de conta VTurb (mesmo da aba "Embed" do player).
      // Ex.: https://scripts.converteai.net/<ACCOUNT_ID>/players/<PLAYER_ID>/v4/player.js
      s.src = `https://scripts.converteai.net/ACCOUNT_ID/players/${videoId}/v4/player.js`;
      document.head.appendChild(s);
    }
  }, [videoId]);

  return <div ref={containerRef} className={className} />;
};

export default MentoriaVideo;