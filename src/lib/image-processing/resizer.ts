/**
 * Image Resizing Engine
 * 
 * Core image resizing functionality using HTML5 Canvas API.
 * Supports crop, fit, and stretch modes with brightness/contrast adjustments.
 * All processing is done client-side.
 */

export interface ResizeOptions {
  width: number;
  height: number;
  unit: 'px' | 'cm' | 'mm';
  dpi: number;
  mode: 'crop' | 'fit' | 'stretch';
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0-1
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotation?: number; // degrees
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
}

export interface ProcessedImage {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  fileSize: number;
  format: string;
}

/**
 * Convert a measurement value from cm or mm to pixels at a given DPI.
 * If the unit is already 'px', the value is returned as-is.
 */
export function convertToPixels(value: number, unit: 'px' | 'cm' | 'mm', dpi: number): number {
  if (value <= 0) {
    throw new Error(`Value must be positive, got ${value}`);
  }
  if (dpi <= 0) {
    throw new Error(`DPI must be positive, got ${dpi}`);
  }

  switch (unit) {
    case 'px':
      return Math.round(value);
    case 'cm':
      // 1 inch = 2.54 cm
      return Math.round((value / 2.54) * dpi);
    case 'mm':
      // 1 inch = 25.4 mm
      return Math.round((value / 25.4) * dpi);
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}

/**
 * Load a File object as an HTMLImageElement.
 * Remember to revoke the object URL after use if you manage it externally.
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
      reject(new Error('Failed to load image. The file may be corrupted or in an unsupported format.'));
    };
    img.src = url;
  });
}

/**
 * Load an HTMLImageElement from a data URL string.
 */
function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from data URL.'));
    img.src = dataUrl;
  });
}

/**
 * Apply brightness and contrast adjustments to raw ImageData.
 * 
 * @param imageData - The ImageData to modify (modified in place and returned)
 * @param brightness - Brightness adjustment from -100 to 100 (0 = no change)
 * @param contrast - Contrast adjustment from -100 to 100 (0 = no change)
 */
export function applyBrightnessContrast(
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData {
  const data = imageData.data;

  // Normalize brightness to a -255..255 additive value
  const brightnessOffset = (brightness / 100) * 255;

  // Contrast factor: map -100..100 to a multiplier
  // Using the formula: factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  const contrastNorm = (contrast / 100) * 255;
  const contrastFactor = (259 * (contrastNorm + 255)) / (255 * (259 - contrastNorm));

  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast first, then brightness
    for (let c = 0; c < 3; c++) {
      let value = data[i + c];
      // Apply contrast (centered at 128)
      value = contrastFactor * (value - 128) + 128;
      // Apply brightness
      value += brightnessOffset;
      // Clamp to 0-255
      data[i + c] = Math.max(0, Math.min(255, Math.round(value)));
    }
    // Alpha channel (i+3) is left unchanged
  }

  return imageData;
}

/**
 * Rotate a canvas by the given degrees (0, 90, 180, 270 or arbitrary).
 * Returns a new canvas with the rotated image.
 */
export function rotateImage(
  sourceCanvas: HTMLCanvasElement,
  degrees: number
): HTMLCanvasElement {
  // Normalize degrees to 0-359
  const normalizedDegrees = ((degrees % 360) + 360) % 360;

  if (normalizedDegrees === 0) {
    // No rotation needed — return a copy
    const copy = document.createElement('canvas');
    copy.width = sourceCanvas.width;
    copy.height = sourceCanvas.height;
    const ctx = copy.getContext('2d')!;
    ctx.drawImage(sourceCanvas, 0, 0);
    return copy;
  }

  const radians = (normalizedDegrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  // Calculate new canvas dimensions to fit the rotated image
  const newWidth = Math.round(sourceCanvas.width * cos + sourceCanvas.height * sin);
  const newHeight = Math.round(sourceCanvas.width * sin + sourceCanvas.height * cos);

  const rotatedCanvas = document.createElement('canvas');
  rotatedCanvas.width = newWidth;
  rotatedCanvas.height = newHeight;
  const ctx = rotatedCanvas.getContext('2d')!;

  // Move to center, rotate, then draw centered
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);

  return rotatedCanvas;
}

/**
 * Crop a canvas to the specified region.
 * Returns a new canvas with only the cropped area.
 */
export function cropImage(
  sourceCanvas: HTMLCanvasElement,
  cropData: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement {
  // Clamp crop region to canvas boundaries
  const x = Math.max(0, Math.round(cropData.x));
  const y = Math.max(0, Math.round(cropData.y));
  const width = Math.min(Math.round(cropData.width), sourceCanvas.width - x);
  const height = Math.min(Math.round(cropData.height), sourceCanvas.height - y);

  if (width <= 0 || height <= 0) {
    throw new Error('Invalid crop dimensions: resulting area is empty.');
  }

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = width;
  croppedCanvas.height = height;
  const ctx = croppedCanvas.getContext('2d')!;

  ctx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);

  return croppedCanvas;
}

/**
 * Fit mode: Scale the image to fit within targetWidth x targetHeight
 * while maintaining aspect ratio. Remaining space is filled with white (letterbox).
 */
export function fitImageToCanvas(
  img: HTMLImageElement | HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): void {
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  // Fill background with white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

  // Calculate scale to fit within target dimensions
  const scale = Math.min(targetWidth / imgWidth, targetHeight / imgHeight);
  const scaledWidth = Math.round(imgWidth * scale);
  const scaledHeight = Math.round(imgHeight * scale);

  // Center the scaled image
  const offsetX = Math.round((targetWidth - scaledWidth) / 2);
  const offsetY = Math.round((targetHeight - scaledHeight) / 2);

  ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, scaledWidth, scaledHeight);
}

/**
 * Crop mode: Scale the image to fill targetWidth x targetHeight completely,
 * cropping the excess. The image is centered so cropping is symmetrical.
 */
export function cropImageToCanvas(
  img: HTMLImageElement | HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): void {
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

  // Calculate scale to fill the entire target area (cover)
  const scale = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
  const scaledWidth = Math.round(imgWidth * scale);
  const scaledHeight = Math.round(imgHeight * scale);

  // Center and crop
  const offsetX = Math.round((targetWidth - scaledWidth) / 2);
  const offsetY = Math.round((targetHeight - scaledHeight) / 2);

  ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, scaledWidth, scaledHeight);
}

/**
 * Convert a canvas to a Blob of the specified format and quality.
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
          reject(new Error(`Failed to encode image as ${format}`));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Main resize function.
 * 
 * Loads the image, applies optional crop/rotation/brightness/contrast,
 * resizes to target dimensions using the specified mode, and encodes
 * to the desired output format.
 * 
 * @param file - The source image file
 * @param options - Resize configuration
 * @returns ProcessedImage with blob, dataUrl, dimensions, and file size
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ProcessedImage> {
  // Calculate target dimensions in pixels
  const targetWidth = convertToPixels(options.width, options.unit, options.dpi);
  const targetHeight = convertToPixels(options.height, options.unit, options.dpi);

  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error('Target dimensions must be positive.');
  }
  if (targetWidth > 10000 || targetHeight > 10000) {
    throw new Error('Target dimensions exceed maximum of 10000px.');
  }

  // Load the source image
  const img = await loadImage(file);

  // Step 1: Draw original image onto a working canvas
  let workingCanvas = document.createElement('canvas');
  workingCanvas.width = img.naturalWidth;
  workingCanvas.height = img.naturalHeight;
  const workingCtx = workingCanvas.getContext('2d')!;
  workingCtx.drawImage(img, 0, 0);

  // Step 2: Apply manual crop if provided
  if (options.cropData) {
    workingCanvas = cropImage(workingCanvas, options.cropData);
  }

  // Step 3: Apply rotation if provided
  if (options.rotation && options.rotation !== 0) {
    workingCanvas = rotateImage(workingCanvas, options.rotation);
  }

  // Step 4: Apply brightness/contrast if provided
  const brightness = options.brightness ?? 0;
  const contrast = options.contrast ?? 0;
  if (brightness !== 0 || contrast !== 0) {
    const ctx = workingCanvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, workingCanvas.width, workingCanvas.height);
    applyBrightnessContrast(imageData, brightness, contrast);
    ctx.putImageData(imageData, 0, 0);
  }

  // Step 5: Resize to target dimensions using the selected mode
  const outputCanvas = document.createElement('canvas');

  switch (options.mode) {
    case 'fit':
      fitImageToCanvas(workingCanvas, outputCanvas, targetWidth, targetHeight);
      break;
    case 'crop':
      cropImageToCanvas(workingCanvas, outputCanvas, targetWidth, targetHeight);
      break;
    case 'stretch':
      outputCanvas.width = targetWidth;
      outputCanvas.height = targetHeight;
      const stretchCtx = outputCanvas.getContext('2d')!;
      stretchCtx.drawImage(workingCanvas, 0, 0, targetWidth, targetHeight);
      break;
    default:
      throw new Error(`Unsupported resize mode: ${options.mode}`);
  }

  // Step 6: Encode to the target format
  const blob = await canvasToBlob(outputCanvas, options.format, options.quality);
  const dataUrl = outputCanvas.toDataURL(options.format, options.quality);

  return {
    blob,
    dataUrl,
    width: outputCanvas.width,
    height: outputCanvas.height,
    fileSize: blob.size,
    format: options.format,
  };
}
