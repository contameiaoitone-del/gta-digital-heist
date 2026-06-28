import { useEffect, useState } from "react";
import logoImage from "@/assets/real-life-academy-logo.png";

const CACHE_KEY = "rla-logo-crop-v1";

function cropByBackground(img: HTMLImageElement, padding = 12, threshold = 28): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample background color from the four corners (10x10 each)
  const sampleSize = 10;
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  const samplePoints = [
    { sx: 0, sy: 0 },
    { sx: w - sampleSize, sy: 0 },
    { sx: 0, sy: h - sampleSize },
    { sx: w - sampleSize, sy: h - sampleSize },
  ];
  for (const { sx, sy } of samplePoints) {
    for (let y = sy; y < Math.min(sy + sampleSize, h); y++) {
      for (let x = sx; x < Math.min(sx + sampleSize, w); x++) {
        const idx = (y * w + x) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
  }
  const bgR = Math.round(rSum / Math.max(1, count));
  const bgG = Math.round(gSum / Math.max(1, count));
  const bgB = Math.round(bSum / Math.max(1, count));

  const dist = (r: number, g: number, b: number) => {
    const dr = r - bgR, dg = g - bgG, db = b - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = data[idx + 3];
      const d = dist(data[idx], data[idx + 1], data[idx + 2]);
      // Consider pixels that are either not transparent or different from background
      if (a > 10 && d > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If nothing detected, return original
  if (maxX <= minX || maxY <= minY) {
    return canvas.toDataURL("image/png");
  }

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(w - 1, maxX + padding);
  maxY = Math.min(h - 1, maxY + padding);

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;

  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const octx = out.getContext("2d");
  if (!octx) return canvas.toDataURL("image/png");
  octx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
  return out.toDataURL("image/png");
}

export const GTALogo = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setSrc(cached);
        return;
      }
    } catch {}

    const img = new Image();
    img.onload = () => {
      try {
        const dataUrl = cropByBackground(img);
        if (dataUrl) {
          setSrc(dataUrl);
          try { localStorage.setItem(CACHE_KEY, dataUrl); } catch {}
        } else {
          setSrc(logoImage);
        }
      } catch {
        setSrc(logoImage);
      }
    };
    img.onerror = () => setSrc(logoImage);
    img.src = logoImage;
  }, []);

  return (
    <img
      src={src ?? logoImage}
      alt="Real Life Academy Logo"
      className="w-full h-auto max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] mx-auto block relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      loading="eager"
      decoding="async"
    />
  );
};