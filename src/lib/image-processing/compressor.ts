/**
 * Image Compression Engine
 * 
 * Iterative quality optimization using binary search to achieve
 * a target file size range. All processing is client-side via Canvas API.
 */

export interface CompressionOptions {
  minSizeKB: number;
  maxSizeKB: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  targetWidth?: number;
  targetHeight?: number;
  maxIterations?: number;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  fileSize: number;
  quality: number;
  format: string;
  iterations: number;
  success: boolean;
  message: string;
}

const DEFAULT_MAX_ITERATIONS = 20;

/**
 * Load a File as an HTMLImageElement.
 * The object URL is revoked after load.
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
      reject(new Error('Failed to load image. The file may be corrupted or unsupported.'));
    };
    img.src = url;
  });
}

/**
 * Encode a canvas to a Blob with the given format and quality.
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
 * Draw the image onto a canvas, optionally resizing to target dimensions.
 * If no target dimensions are provided, the original size is used.
 */
function drawImageToCanvas(
  img: HTMLImageElement,
  targetWidth?: number,
  targetHeight?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = targetWidth ?? img.naturalWidth;
  const height = targetHeight ?? img.naturalHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d')!;

  // Fill white background (useful for PNG→JPEG conversion)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // If both target dimensions are given, fit the image maintaining aspect ratio
  if (targetWidth && targetHeight) {
    const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    const scaledWidth = Math.round(img.naturalWidth * scale);
    const scaledHeight = Math.round(img.naturalHeight * scale);
    const offsetX = Math.round((width - scaledWidth) / 2);
    const offsetY = Math.round((height - scaledHeight) / 2);
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }

  return canvas;
}

/**
 * Compress an image file to fit within a target file size range.
 * 
 * Uses binary search on the quality parameter (for JPEG/WebP) to find
 * the optimal quality that produces a file within [minSizeKB, maxSizeKB].
 * 
 * For PNG format (which doesn't support quality), the image is re-encoded 
 * as PNG. If the PNG is too large, the image dimensions are iteratively 
 * scaled down. If the PNG is too small, the result is returned with a note.
 * 
 * @param file - Source image file
 * @param options - Compression configuration
 * @returns CompressionResult with the compressed blob and metadata
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const {
    minSizeKB,
    maxSizeKB,
    format,
    targetWidth,
    targetHeight,
    maxIterations = DEFAULT_MAX_ITERATIONS,
  } = options;

  if (minSizeKB < 0 || maxSizeKB <= 0) {
    throw new Error('File size bounds must be positive.');
  }
  if (minSizeKB > maxSizeKB) {
    throw new Error('Minimum size must be less than or equal to maximum size.');
  }

  const minSizeBytes = minSizeKB * 1024;
  const maxSizeBytes = maxSizeKB * 1024;

  // Load the source image
  const img = await loadImage(file);

  // Draw to canvas (with optional resize)
  const canvas = drawImageToCanvas(img, targetWidth, targetHeight);
  const finalWidth = canvas.width;
  const finalHeight = canvas.height;

  // Handle PNG format separately — PNG doesn't have a quality parameter
  if (format === 'image/png') {
    return compressPng(canvas, finalWidth, finalHeight, minSizeBytes, maxSizeBytes, maxIterations);
  }

  // For JPEG and WebP, use binary search on quality
  return compressWithQuality(
    canvas,
    finalWidth,
    finalHeight,
    format,
    minSizeBytes,
    maxSizeBytes,
    maxIterations
  );
}

/**
 * Binary search on quality parameter to hit target file size range.
 */
async function compressWithQuality(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  format: 'image/jpeg' | 'image/webp',
  minSizeBytes: number,
  maxSizeBytes: number,
  maxIterations: number
): Promise<CompressionResult> {
  let low = 0.01;
  let high = 1.0;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.9;
  let iterations = 0;

  // First, check boundaries to see if the target is achievable
  const maxQualityBlob = await canvasToBlob(canvas, format, 1.0);
  const minQualityBlob = await canvasToBlob(canvas, format, 0.01);

  // If even maximum quality produces a file smaller than minSize
  if (maxQualityBlob.size < minSizeBytes) {
    const dataUrl = canvas.toDataURL(format, 1.0);
    return {
      blob: maxQualityBlob,
      dataUrl,
      width,
      height,
      fileSize: maxQualityBlob.size,
      quality: 1.0,
      format,
      iterations: 0,
      success: false,
      message: `Cannot reach minimum size of ${(minSizeBytes / 1024).toFixed(1)}KB. Maximum achievable size at quality=1.0 is ${(maxQualityBlob.size / 1024).toFixed(1)}KB. Try using a larger image or PNG format.`,
    };
  }

  // If even minimum quality produces a file larger than maxSize
  if (minQualityBlob.size > maxSizeBytes) {
    const dataUrl = canvas.toDataURL(format, 0.01);
    return {
      blob: minQualityBlob,
      dataUrl,
      width,
      height,
      fileSize: minQualityBlob.size,
      quality: 0.01,
      format,
      iterations: 0,
      success: false,
      message: `Cannot reduce below ${(minQualityBlob.size / 1024).toFixed(1)}KB even at minimum quality. Target maximum is ${(maxSizeBytes / 1024).toFixed(1)}KB. Try reducing image dimensions.`,
    };
  }

  // If max quality blob is already within range
  if (maxQualityBlob.size >= minSizeBytes && maxQualityBlob.size <= maxSizeBytes) {
    const dataUrl = canvas.toDataURL(format, 1.0);
    return {
      blob: maxQualityBlob,
      dataUrl,
      width,
      height,
      fileSize: maxQualityBlob.size,
      quality: 1.0,
      format,
      iterations: 0,
      success: true,
      message: 'Image is already within the target size range at maximum quality.',
    };
  }

  // Binary search
  let currentQuality = 0.9; // Start at 0.9

  while (iterations < maxIterations) {
    iterations++;

    const blob = await canvasToBlob(canvas, format, currentQuality);

    if (blob.size >= minSizeBytes && blob.size <= maxSizeBytes) {
      // Found a quality that works!
      bestBlob = blob;
      bestQuality = currentQuality;
      break;
    }

    if (blob.size > maxSizeBytes) {
      // File is too large, reduce quality
      high = currentQuality;
    } else {
      // File is too small, increase quality
      low = currentQuality;
    }

    // Track best result (closest to target range)
    if (
      bestBlob === null ||
      (blob.size <= maxSizeBytes && blob.size > (bestBlob.size <= maxSizeBytes ? bestBlob.size : 0))
    ) {
      bestBlob = blob;
      bestQuality = currentQuality;
    }

    currentQuality = (low + high) / 2;
  }

  // If we exhausted iterations without a perfect match, use best result
  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, format, bestQuality);
  }

  const success = bestBlob.size >= minSizeBytes && bestBlob.size <= maxSizeBytes;
  const dataUrl = canvas.toDataURL(format, bestQuality);

  return {
    blob: bestBlob,
    dataUrl,
    width,
    height,
    fileSize: bestBlob.size,
    quality: Math.round(bestQuality * 100) / 100,
    format,
    iterations,
    success,
    message: success
      ? `Compressed to ${(bestBlob.size / 1024).toFixed(1)}KB at quality ${Math.round(bestQuality * 100)}% in ${iterations} iterations.`
      : `Best achievable: ${(bestBlob.size / 1024).toFixed(1)}KB at quality ${Math.round(bestQuality * 100)}%. Target range: ${(minSizeBytes / 1024).toFixed(1)}KB - ${(maxSizeBytes / 1024).toFixed(1)}KB.`,
  };
}

/**
 * Handle PNG compression by iteratively scaling down the image dimensions.
 * PNG doesn't support a quality parameter, so we reduce resolution instead.
 */
async function compressPng(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  minSizeBytes: number,
  maxSizeBytes: number,
  maxIterations: number
): Promise<CompressionResult> {
  let currentCanvas = canvas;
  let currentWidth = width;
  let currentHeight = height;
  let iterations = 0;

  // Check initial size
  let blob = await canvasToBlob(currentCanvas, 'image/png', 1.0);

  // Already within range
  if (blob.size >= minSizeBytes && blob.size <= maxSizeBytes) {
    const dataUrl = currentCanvas.toDataURL('image/png');
    return {
      blob,
      dataUrl,
      width: currentWidth,
      height: currentHeight,
      fileSize: blob.size,
      quality: 1.0,
      format: 'image/png',
      iterations: 0,
      success: true,
      message: 'PNG is already within the target size range.',
    };
  }

  // If PNG is too small at full resolution, we can't make it larger
  if (blob.size < minSizeBytes) {
    const dataUrl = currentCanvas.toDataURL('image/png');
    return {
      blob,
      dataUrl,
      width: currentWidth,
      height: currentHeight,
      fileSize: blob.size,
      quality: 1.0,
      format: 'image/png',
      iterations: 0,
      success: false,
      message: `PNG file is ${(blob.size / 1024).toFixed(1)}KB, below the minimum of ${(minSizeBytes / 1024).toFixed(1)}KB. PNG format doesn't support quality reduction. Try using a larger source image.`,
    };
  }

  // PNG is too large — iteratively scale down
  let scaleLow = 0.1;
  let scaleHigh = 1.0;
  let bestBlob = blob;
  let bestWidth = currentWidth;
  let bestHeight = currentHeight;

  while (iterations < maxIterations && blob.size > maxSizeBytes) {
    iterations++;

    const scale = (scaleLow + scaleHigh) / 2;
    currentWidth = Math.max(1, Math.round(width * scale));
    currentHeight = Math.max(1, Math.round(height * scale));

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = currentWidth;
    scaledCanvas.height = currentHeight;
    const ctx = scaledCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0, currentWidth, currentHeight);

    blob = await canvasToBlob(scaledCanvas, 'image/png', 1.0);
    currentCanvas = scaledCanvas;

    if (blob.size >= minSizeBytes && blob.size <= maxSizeBytes) {
      bestBlob = blob;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break;
    }

    if (blob.size > maxSizeBytes) {
      scaleHigh = scale;
    } else {
      scaleLow = scale;
    }

    // Track best fit
    if (blob.size <= maxSizeBytes && blob.size >= minSizeBytes) {
      bestBlob = blob;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
    } else if (blob.size <= maxSizeBytes) {
      bestBlob = blob;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
    }
  }

  const success = bestBlob.size >= minSizeBytes && bestBlob.size <= maxSizeBytes;
  const dataUrl = currentCanvas.toDataURL('image/png');

  return {
    blob: bestBlob,
    dataUrl,
    width: bestWidth,
    height: bestHeight,
    fileSize: bestBlob.size,
    quality: 1.0,
    format: 'image/png',
    iterations,
    success,
    message: success
      ? `PNG compressed to ${(bestBlob.size / 1024).toFixed(1)}KB by scaling to ${bestWidth}x${bestHeight} in ${iterations} iterations.`
      : `Best achievable PNG size: ${(bestBlob.size / 1024).toFixed(1)}KB at ${bestWidth}x${bestHeight}. Target: ${(minSizeBytes / 1024).toFixed(1)}KB - ${(maxSizeBytes / 1024).toFixed(1)}KB.`,
  };
}
