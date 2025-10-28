import { useEffect, useState } from "react";

const GameLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds loading
    const interval = 50; // update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoaded(true), 300);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (isLoaded) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-background/90 backdrop-blur-md border-2 border-neon-pink/40 rounded-lg p-4 min-w-[200px] shadow-volumetric-pink">
        {/* Loading Text */}
        <div className="flex items-center gap-2 mb-2">
          <div className="text-neon-pink font-bold text-sm tracking-wider animate-pulse">
            LOADING
          </div>
          <div className="flex gap-1">
            <span className="text-neon-pink animate-pulse" style={{ animationDelay: "0ms" }}>.</span>
            <span className="text-neon-pink animate-pulse" style={{ animationDelay: "200ms" }}>.</span>
            <span className="text-neon-pink animate-pulse" style={{ animationDelay: "400ms" }}>.</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_currentColor]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="text-right text-xs text-muted-foreground mt-1 font-mono">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default GameLoader;
