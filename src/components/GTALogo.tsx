import { useState, useEffect } from "react";
import logoImage from "@/assets/real-life-academy-logo.png";
import { removeBackground } from "@/lib/removeBackground";
const CACHE_KEY = 'rla-logo-v3';
export const GTALogo = () => {
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  useEffect(() => {
    const processLogo = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          console.log('Using cached logo');
          setProcessedLogo(cached);
          setIsProcessing(false);
          return;
        }

        // Load the original image
        const response = await fetch(logoImage);
        const blob = await response.blob();

        // Create an image element
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        await new Promise(resolve => {
          img.onload = resolve;
        });

        // Remove background
        const processedBlob = await removeBackground(img);
        const processedUrl = URL.createObjectURL(processedBlob);

        // Cache the result
        try {
          localStorage.setItem(CACHE_KEY, processedUrl);
        } catch (e) {
          console.warn('Failed to cache logo:', e);
        }
        setProcessedLogo(processedUrl);
        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to process logo:', error);
        // Fallback to original image
        setProcessedLogo(logoImage);
        setIsProcessing(false);
      }
    };
    processLogo();
  }, []);
  return (
    <div className="gta-logo-wrapper inline-block animate-slide-up">
      {isProcessing ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando logo...</p>
        </div>
      ) : (
        <img
          src={processedLogo || logoImage}
          alt="Real Life Academy"
          className="w-full h-auto max-w-[600px] mx-auto relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      )}
    </div>
  );
};