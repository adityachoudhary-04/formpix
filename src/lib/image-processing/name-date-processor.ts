/**
 * Name & Date Processor
 * 
 * Adds a white strip at the bottom of a photo with the candidate's
 * name and date text. Commonly required for government exam photos.
 * All processing is client-side via Canvas API.
 */

import { type ProcessedImage } from './resizer';

export interface NameDateOptions {
  name: string;
  date: string;
  showName: boolean;
  showDate: boolean;
  stripHeight: number; // percentage of image height for the white strip (e.g., 10 = 10%)
  fontSize: number; // in pixels (base font size, will be auto-scaled)
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
}

/**
 * Load a File as an HTMLImageElement.
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
      reject(new Error('Failed to load image for name/date processing.'));
    };
    img.src = url;
  });
}

/**
 * Encode a canvas to a Blob.
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
          reject(new Error('Failed to encode image with name/date strip.'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Calculate the optimal font size based on image dimensions and strip height.
 * The font should be large enough to be readable but fit within the strip.
 * 
 * @param baseFontSize - The user-specified base font size
 * @param imageWidth - Width of the image in pixels
 * @param stripHeight - Height of the strip in pixels
 * @returns The auto-scaled font size in pixels
 */
function calculateFontSize(
  baseFontSize: number,
  imageWidth: number,
  stripHeight: number
): number {
  // Scale font relative to image width (target: readable at ~600px wide)
  const widthScale = imageWidth / 600;

  // Ensure font fits within the strip (leave 30% padding above and below)
  const maxFontForStrip = stripHeight * 0.6;

  // Start with base font size scaled to image width
  const scaledFontSize = baseFontSize * widthScale;

  // Clamp to strip height and reasonable bounds
  return Math.max(8, Math.min(scaledFontSize, maxFontForStrip, 120));
}

/**
 * Add a name and/or date strip to the bottom of a photo.
 * 
 * Creates a new image that is taller than the original, with a colored strip
 * at the bottom containing:
 * - Name text on the left side
 * - Date text on the right side
 * 
 * The strip height is calculated as a percentage of the original image height.
 * Font size is auto-scaled based on image dimensions.
 * 
 * @param file - Source image file
 * @param options - Name/date configuration
 * @returns ProcessedImage with the name/date strip added
 */
export async function addNameDate(
  file: File,
  options: NameDateOptions
): Promise<ProcessedImage> {
  const {
    name,
    date,
    showName,
    showDate,
    stripHeight: stripHeightPercent,
    fontSize: baseFontSize,
    fontFamily,
    textColor,
    backgroundColor,
  } = options;

  // Nothing to add
  if (!showName && !showDate) {
    throw new Error('At least one of name or date must be enabled.');
  }

  // Load the source image
  const img = await loadImage(file);
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  // Calculate strip height in pixels
  const clampedPercent = Math.max(3, Math.min(30, stripHeightPercent));
  const stripHeightPx = Math.round((imgHeight * clampedPercent) / 100);

  // Total canvas height = image + strip
  const totalHeight = imgHeight + stripHeightPx;

  // Create output canvas
  const canvas = document.createElement('canvas');
  canvas.width = imgWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d')!;

  // Step 1: Draw the original image at the top
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

  // Step 2: Draw the strip background
  ctx.fillStyle = backgroundColor || '#FFFFFF';
  ctx.fillRect(0, imgHeight, imgWidth, stripHeightPx);

  // Draw a subtle top border for the strip
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, imgHeight);
  ctx.lineTo(imgWidth, imgHeight);
  ctx.stroke();

  // Step 3: Calculate font size and set text properties
  const finalFontSize = calculateFontSize(baseFontSize, imgWidth, stripHeightPx);
  ctx.font = `${Math.round(finalFontSize)}px ${fontFamily || 'Arial, sans-serif'}`;
  ctx.fillStyle = textColor || '#000000';
  ctx.textBaseline = 'middle';

  // Horizontal padding (3% of image width)
  const padding = Math.round(imgWidth * 0.03);

  // Vertical center of the strip
  const textY = imgHeight + stripHeightPx / 2;

  // Step 4: Render text
  if (showName && showDate) {
    // Name on the left, date on the right
    ctx.textAlign = 'left';
    ctx.fillText(name || '', padding, textY);

    ctx.textAlign = 'right';
    ctx.fillText(date || '', imgWidth - padding, textY);
  } else if (showName) {
    // Name centered
    ctx.textAlign = 'center';
    ctx.fillText(name || '', imgWidth / 2, textY);
  } else if (showDate) {
    // Date centered
    ctx.textAlign = 'center';
    ctx.fillText(date || '', imgWidth / 2, textY);
  }

  // Step 5: Encode output
  const format = 'image/jpeg';
  const quality = 0.92;
  const blob = await canvasToBlob(canvas, format, quality);
  const dataUrl = canvas.toDataURL(format, quality);

  return {
    blob,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    fileSize: blob.size,
    format,
  };
}
