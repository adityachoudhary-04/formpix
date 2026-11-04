/**
 * Signature Processing Engine
 * 
 * Specialized image processing for exam signatures.
 * Handles background cleanup, enhancement, resizing, and compression.
 * All processing is client-side via Canvas API.
 */

import { type ProcessedImage } from './resizer';

export interface SignatureOptions {
  width: number;
  height: number;
  minSizeKB?: number;
  maxSizeKB?: number;
  format: 'image/jpeg' | 'image/png';
  cleanBackground: boolean;
  threshold: number; // 0-255, for background cleanup
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
}

/**
 * Load a File as an HTMLImageElement.
 * The object URL is revoked automatically after load.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load signature image.'));
    };
    img.src = url;
  });
}

/**
 * Encode a canvas to a Blob of the given format and quality.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Failed to encode signature as ${format}`));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Clean up the signature background by converting near-white pixels to pure white.
 * 
 * For each pixel, if ALL three RGB channel values are above the given threshold,
 * the pixel is set to pure white (255, 255, 255). This removes paper texture,
 * shadows, and other background noise while preserving the dark signature ink.
 * 
 * @param imageData - The ImageData to process (modified in place)
 * @param threshold - Brightness threshold (0-255). Pixels with all channels above this become white.
 *                    Typical values: 200-240. Higher = more aggressive cleanup.
 */
export function cleanSignatureBackground(
  imageData: ImageData,
  threshold: number
): ImageData {
  const data = imageData.data;
  const clampedThreshold = Math.max(0, Math.min(255, Math.round(threshold)));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // If all RGB channels are above the threshold, it's a "background" pixel
    if (r > clampedThreshold && g > clampedThreshold && b > clampedThreshold) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      // Alpha (data[i + 3]) is left unchanged
    }
  }

  return imageData;
}

/**
 * Enhance signature image data by applying brightness and contrast adjustments.
 * This helps make faint signatures more visible and dark signatures crisper.
 * 
 * @param imageData - The ImageData to process (modified in place)
 * @param brightness - Brightness adjustment (-100 to 100)
 * @param contrast - Contrast adjustment (-100 to 100)
 */
export function enhanceSignature(
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData {
  const data = imageData.data;

  // Normalize brightness to a -255..255 additive offset
  const brightnessOffset = (brightness / 100) * 255;

  // Compute contrast factor using the standard formula
  const contrastNorm = (contrast / 100) * 255;
  const contrastFactor = (259 * (contrastNorm + 255)) / (255 * (259 - contrastNorm));

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let value = data[i + c];
      // Apply contrast centered at 128
      value = contrastFactor * (value - 128) + 128;
      // Apply brightness
      value += brightnessOffset;
      // Clamp
      data[i + c] = Math.max(0, Math.min(255, Math.round(value)));
    }
  }

  return imageData;
}

/**
 * Process a signature image file.
 * 
 * Pipeline:
 * 1. Load image
 * 2. (Optional) Clean background — convert near-white pixels to pure white
 * 3. Apply brightness/contrast enhancements
 * 4. Resize to target dimensions
 * 5. (Optional) Compress to target file size range
 * 
 * @param file - Source signature image file
 * @param options - Processing configuration
 * @returns ProcessedImage with the final signature
 */
export async function processSignature(
  file: File,
  options: SignatureOptions
): Promise<ProcessedImage> {
  const {
    width: targetWidth,
    height: targetHeight,
    format,
    cleanBackground,
    threshold,
    brightness,
    contrast,
    minSizeKB,
    maxSizeKB,
  } = options;

  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error('Target dimensions must be positive.');
  }

  // Step 1: Load the source image
  const img = await loadImage(file);

  // Step 2: Draw original onto a working canvas
  const workingCanvas = document.createElement('canvas');
  workingCanvas.width = img.naturalWidth;
  workingCanvas.height = img.naturalHeight;
  const workingCtx = workingCanvas.getContext('2d')!;

  // Fill white background first (important for transparent PNGs)
  workingCtx.fillStyle = '#FFFFFF';
  workingCtx.fillRect(0, 0, workingCanvas.width, workingCanvas.height);
  workingCtx.drawImage(img, 0, 0);

  // Step 3: Get pixel data for manipulation
  let imageData = workingCtx.getImageData(0, 0, workingCanvas.width, workingCanvas.height);

  // Step 4: Clean background if requested
  if (cleanBackground) {
    imageData = cleanSignatureBackground(imageData, threshold);
  }

  // Step 5: Apply brightness/contrast enhancement
  if (brightness !== 0 || contrast !== 0) {
    imageData = enhanceSignature(imageData, brightness, contrast);
  }

  // Write processed pixel data back
  workingCtx.putImageData(imageData, 0, 0);

  // Step 6: Resize to target dimensions
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = targetWidth;
  outputCanvas.height = targetHeight;
  const outputCtx = outputCanvas.getContext('2d')!;

  // Fill white background
  outputCtx.fillStyle = '#FFFFFF';
  outputCtx.fillRect(0, 0, targetWidth, targetHeight);

  // Fit the signature maintaining aspect ratio
  const scale = Math.min(targetWidth / workingCanvas.width, targetHeight / workingCanvas.height);
  const scaledWidth = Math.round(workingCanvas.width * scale);
  const scaledHeight = Math.round(workingCanvas.height * scale);
  const offsetX = Math.round((targetWidth - scaledWidth) / 2);
  const offsetY = Math.round((targetHeight - scaledHeight) / 2);

  outputCtx.drawImage(workingCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

  // Step 7: Compress to target file size if specified
  if (maxSizeKB && maxSizeKB > 0) {
    return compressToSize(outputCanvas, format, minSizeKB ?? 0, maxSizeKB);
  }

  // No size constraints — encode at high quality
  const quality = format === 'image/jpeg' ? 0.92 : 1.0;
  const blob = await canvasToBlob(outputCanvas, format, quality);
  const dataUrl = outputCanvas.toDataURL(format, quality);

  return {
    blob,
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    fileSize: blob.size,
    format,
  };
}

/**
 * Compress a canvas output to fit within a file size range.
 * Uses binary search on JPEG quality. For PNG, attempts dimension scaling.
 */
async function compressToSize(
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png',
  minSizeBytes: number,
  maxSizeKB: number
): Promise<ProcessedImage> {
  const minBytes = minSizeBytes * 1024;
  const maxBytes = maxSizeKB * 1024;

  if (format === 'image/png') {
    // PNG doesn't support quality — just encode and check
    const blob = await canvasToBlob(canvas, 'image/png', 1.0);
    const dataUrl = canvas.toDataURL('image/png');
    return {
      blob,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      fileSize: blob.size,
      format: 'image/png',
    };
  }

  // Binary search on JPEG quality
  let low = 0.01;
  let high = 1.0;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.9;
  const maxIterations = 20;

  for (let i = 0; i < maxIterations; i++) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, format, quality);

    if (blob.size >= minBytes && blob.size <= maxBytes) {
      bestBlob = blob;
      bestQuality = quality;
      break;
    }

    if (blob.size > maxBytes) {
      high = quality;
    } else {
      low = quality;
    }

    // Track best result within range
    if (!bestBlob || (blob.size <= maxBytes && blob.size > bestBlob.size)) {
      bestBlob = blob;
      bestQuality = quality;
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, format, bestQuality);
  }

  const dataUrl = canvas.toDataURL(format, bestQuality);

  return {
    blob: bestBlob,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    fileSize: bestBlob.size,
    format,
  };
}
