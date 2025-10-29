import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useBackgroundMusic = (audioSrc: string, volume: number = 0.4) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Try to play automatically
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay blocked, waiting for user interaction");
        // Add one-time click listener to start audio
        const handleInteraction = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            setUserInteracted(true);
            document.removeEventListener("click", handleInteraction);
          } catch (err) {
            console.error("Failed to play audio:", err);
          }
        };
        document.addEventListener("click", handleInteraction);
      }
    };

    playAudio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc, volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  return { isPlaying, togglePlay };
};
