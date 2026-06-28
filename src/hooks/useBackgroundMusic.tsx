import { useEffect, useRef } from "react";

export const useBackgroundMusic = (audioSrc: string, volume: number = 0.4) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create and configure audio element
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = volume;
    audio.autoplay = true;
    audioRef.current = audio;

    // Force play immediately
    const playAudio = () => {
      audio.play().catch(() => {
        // Retry on any interaction
        const retry = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", retry);
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("keydown", retry);
        };
        document.addEventListener("click", retry, { once: true });
        document.addEventListener("touchstart", retry, { once: true });
        document.addEventListener("keydown", retry, { once: true });
      });
    };

    // Try multiple times to ensure playback
    playAudio();
    setTimeout(playAudio, 100);
    setTimeout(playAudio, 500);

    // Pause audio when page is hidden (user leaves site)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    };

    // Pause audio when page is closed/navigated away
    const handlePageHide = () => {
      audio.pause();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("blur", handlePageHide);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("blur", handlePageHide);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc, volume]);
};
