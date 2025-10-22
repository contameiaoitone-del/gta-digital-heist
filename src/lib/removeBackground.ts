import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function drawToCanvas(img: HTMLImageElement): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  
  return { canvas, ctx };
}

function getBackgroundColor(data: Uint8ClampedArray, width: number, height: number): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0;
  
  // Sample corners
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1]
  ];
  
  for (const [x, y] of corners) {
    const idx = (y * width + x) * 4;
    r += data[idx];
    g += data[idx + 1];
    b += data[idx + 2];
    count++;
  }
  
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

function chromaKeyRemoval(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  options: { threshold?: number; feather?: number } = {}
): HTMLCanvasElement {
  const threshold = options.threshold ?? 60;
  const feather = options.feather ?? 20;
  
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const [bgR, bgG, bgB] = getBackgroundColor(data, width, height);
  
  // Remove background based on color similarity
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bgR;
    const dg = data[i + 1] - bgG;
    const db = data[i + 2] - bgB;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    
    if (distance <= threshold) {
      data[i + 3] = 0;
    } else if (distance <= threshold + feather) {
      const t = (distance - threshold) / feather;
      data[i + 3] = Math.round(data[i + 3] * t);
    }
  }
  
  // Apply simple alpha feathering (box blur)
  const alphaChannel = new Uint8ClampedArray(width * height);
  for (let p = 0, idx = 0; p < data.length; p += 4, idx++) {
    alphaChannel[idx] = data[p + 3];
  }
  
  const blurredAlpha = new Uint8ClampedArray(alphaChannel.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, cnt = 0;
      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          const nx = x + xx, ny = y + yy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += alphaChannel[ny * width + nx];
            cnt++;
          }
        }
      }
      blurredAlpha[y * width + x] = Math.round(sum / cnt);
    }
  }
  
  for (let p = 0, idx = 0; p < data.length; p += 4, idx++) {
    data[p + 3] = blurredAlpha[idx];
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function aiSegmentation(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const device = (typeof navigator !== 'undefined' && 'gpu' in navigator) ? 'webgpu' : 'wasm';
  
  let segmenter: any;
  try {
    console.log(`Attempting to load segmentation model with device: ${device}`);
    segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', { device });
  } catch (error) {
    console.warn('Failed to load with preferred device, falling back to wasm:', error);
    segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', { device: 'wasm' });
  }
  
  const imageData = canvas.toDataURL('image/jpeg', 0.9);
  const result = await segmenter(imageData);
  
  if (!Array.isArray(result) || result.length === 0 || !result[0]?.mask) {
    throw new Error('Invalid segmentation result');
  }
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const outputCtx = outputCanvas.getContext('2d');
  
  if (!outputCtx) throw new Error('Could not get output canvas context');
  
  outputCtx.drawImage(canvas, 0, 0);
  
  const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const data = outputImageData.data;
  
  // Find the largest mask
  let largestMaskIndex = 0;
  let largestMaskSize = 0;
  
  for (let i = 0; i < result.length; i++) {
    let size = 0;
    for (let j = 0; j < result[i].mask.data.length; j++) {
      size += result[i].mask.data[j];
    }
    if (size > largestMaskSize) {
      largestMaskSize = size;
      largestMaskIndex = i;
    }
  }
  
  const mask = result[largestMaskIndex].mask;
  
  for (let i = 0; i < mask.data.length; i++) {
    const maskValue = mask.data[i];
    const alpha = Math.round((1 - maskValue) * 255);
    data[i * 4 + 3] = alpha;
  }
  
  outputCtx.putImageData(outputImageData, 0, 0);
  return outputCanvas;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting hybrid background removal process...');
    
    // Draw image to canvas
    const { canvas, ctx } = drawToCanvas(imageElement);
    console.log(`Image prepared: ${canvas.width}x${canvas.height}`);
    
    // Try chroma key removal first (fast)
    const chromaCanvas = chromaKeyRemoval(canvas, ctx, { threshold: 60, feather: 20 });
    
    // Check if chroma key was effective
    const testData = ctx.getImageData(0, 0, chromaCanvas.width, chromaCanvas.height).data;
    let transparentCount = 0;
    for (let i = 3; i < testData.length; i += 4) {
      if (testData[i] < 10) transparentCount++;
    }
    const transparentRatio = transparentCount / (chromaCanvas.width * chromaCanvas.height);
    
    console.log(`Chroma key transparency ratio: ${(transparentRatio * 100).toFixed(2)}%`);
    
    let finalCanvas = chromaCanvas;
    
    // If chroma key didn't work well, try AI segmentation
    if (transparentRatio < 0.05) {
      console.log('Chroma key insufficient, trying AI segmentation...');
      try {
        finalCanvas = await aiSegmentation(canvas);
        console.log('AI segmentation completed successfully');
      } catch (error) {
        console.warn('AI segmentation failed, keeping chroma key result:', error);
        finalCanvas = chromaCanvas;
      }
    } else {
      console.log('Chroma key successful');
    }
    
    // Convert to blob
    return new Promise((resolve, reject) => {
      finalCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
