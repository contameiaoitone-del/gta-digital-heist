import { useState, useEffect } from "react";
import logoImage from "@/assets/real-life-academy-logo.png";
import { removeBackground } from "@/lib/removeBackground";
const CACHE_KEY = 'rla-logo-v4';

// Função para cortar espaços em branco ao redor da imagem
const cropImageToContent = (blob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Desenha a imagem em um canvas temporário
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      // Encontra os limites do conteúdo visível
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 10) { // Considera pixels com alpha > 10 como visíveis
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Adiciona um pequeno padding
      const padding = 20;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      const croppedWidth = maxX - minX;
      const croppedHeight = maxY - minY;

      // Cria um novo canvas com o tamanho cortado
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext('2d');
      
      if (!croppedCtx) {
        reject(new Error('Could not get cropped canvas context'));
        return;
      }

      croppedCtx.drawImage(
        canvas,
        minX, minY, croppedWidth, croppedHeight,
        0, 0, croppedWidth, croppedHeight
      );

      croppedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create cropped blob'));
          }
        },
        'image/png',
        1.0
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
};
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
        
        // Crop to content
        const croppedBlob = await cropImageToContent(processedBlob);
        const processedUrl = URL.createObjectURL(croppedBlob);

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
          className="w-full h-auto max-w-[700px] mx-auto block relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      )}
    </div>
  );
};