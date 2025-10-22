import { useState, useEffect } from "react";
import logoImage from "@/assets/real-life-academy-logo.png";
import { removeBackground } from "@/lib/removeBackground";

export const GTALogo = () => {
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogo = async () => {
      try {
        // Load the original image
        const response = await fetch(logoImage);
        const blob = await response.blob();
        
        // Create an image element
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        // Remove background
        const processedBlob = await removeBackground(img);
        const processedUrl = URL.createObjectURL(processedBlob);
        
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
      <div className="gta-logo-shape">
        <div className="logo-border-top"></div>
        <div className="logo-border-left"></div>
        <div className="logo-border-right"></div>
        
        {isProcessing ? (
          <div className="w-full h-auto max-w-[600px] mx-auto relative z-10 flex items-center justify-center py-20">
            <div className="animate-pulse text-primary text-xl font-bold">
              Processando logo...
            </div>
          </div>
        ) : (
          <img 
            src={processedLogo || logoImage} 
            alt="Real Life Academy" 
            className="w-full h-auto max-w-[600px] mx-auto relative z-10 drop-shadow-[0_0_40px_rgba(255,105,180,0.7)] drop-shadow-[0_0_80px_rgba(138,43,226,0.5)]"
          />
        )}
      </div>
    </div>
  );
};
