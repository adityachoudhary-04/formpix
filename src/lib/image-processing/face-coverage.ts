/**
 * Face Coverage Guide Utilities
 * 
 * Provides face positioning guidelines for passport/exam photos.
 * Calculates oval and guideline overlays based on standard passport
 * photo composition rules. All rendering uses Canvas 2D API.
 */

export interface FaceGuideOverlay {
  ovalX: number;
  ovalY: number;
  ovalWidth: number;
  ovalHeight: number;
  guidelines: { x1: number; y1: number; x2: number; y2: number; label: string }[];
}

/**
 * Calculate face guide overlay positions based on image dimensions.
 * 
 * Standard passport photo composition:
 * - Face should be centered horizontally
 * - Face occupies roughly 70-80% of the image width
 * - Head top should be at about 10% from the top
 * - Chin should be at about 70% from the top
 * - Eyes should be at about 45-50% from the top
 * - The oval is positioned in the upper portion of the image
 * 
 * @param imageWidth - Width of the image in pixels
 * @param imageHeight - Height of the image in pixels
 * @returns FaceGuideOverlay with oval and guideline positions
 */
export function calculateFaceGuide(
  imageWidth: number,
  imageHeight: number
): FaceGuideOverlay {
  if (imageWidth <= 0 || imageHeight <= 0) {
    throw new Error('Image dimensions must be positive.');
  }

  // Oval center — horizontally centered, positioned in upper portion
  const ovalX = imageWidth / 2;
  const ovalY = imageHeight * 0.40; // Center of face at 40% from top

  // Oval dimensions — approximately 70-80% of image width
  const ovalWidth = imageWidth * 0.38; // Radius (so ~76% of width as diameter)
  const ovalHeight = imageHeight * 0.35; // Taller than wide for face shape

  // Guidelines — horizontal lines for composition reference
  const guidelines: FaceGuideOverlay['guidelines'] = [
    {
      // Top of head line (~8% from top)
      x1: imageWidth * 0.15,
      y1: imageHeight * 0.08,
      x2: imageWidth * 0.85,
      y2: imageHeight * 0.08,
      label: 'Top of Head',
    },
    {
      // Eye level line (~40% from top)
      x1: imageWidth * 0.15,
      y1: imageHeight * 0.40,
      x2: imageWidth * 0.85,
      y2: imageHeight * 0.40,
      label: 'Eye Level',
    },
    {
      // Chin line (~70% from top)
      x1: imageWidth * 0.15,
      y1: imageHeight * 0.70,
      x2: imageWidth * 0.85,
      y2: imageHeight * 0.70,
      label: 'Chin',
    },
  ];

  return {
    ovalX,
    ovalY,
    ovalWidth,
    ovalHeight,
    guidelines,
  };
}

/**
 * Draw the face guide overlay on a canvas.
 * 
 * Renders:
 * - A semi-transparent oval outline showing ideal face placement
 * - Horizontal dashed guidelines for head top, eye level, and chin
 * - Labels for each guideline
 * 
 * @param canvas - The canvas element to draw on (should already have the image)
 * @param overlay - The FaceGuideOverlay from calculateFaceGuide()
 */
export function drawFaceGuide(
  canvas: HTMLCanvasElement,
  overlay: FaceGuideOverlay
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get 2D context from canvas.');
  }

  const { ovalX, ovalY, ovalWidth, ovalHeight, guidelines } = overlay;

  // Draw semi-transparent darkened region outside the oval
  // This helps the user see where the face should be placed
  ctx.save();

  // Draw the oval outline
  ctx.beginPath();
  ctx.ellipse(ovalX, ovalY, ovalWidth, ovalHeight, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 180, 255, 0.7)';
  ctx.lineWidth = Math.max(2, Math.round(canvas.width / 200));
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.closePath();

  // Draw a subtle fill inside the oval for visibility
  ctx.beginPath();
  ctx.ellipse(ovalX, ovalY, ovalWidth, ovalHeight, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 180, 255, 0.05)';
  ctx.fill();
  ctx.closePath();

  // Draw guidelines
  const lineWidth = Math.max(1, Math.round(canvas.width / 400));
  const fontSize = Math.max(10, Math.round(canvas.width / 40));

  guidelines.forEach((line) => {
    // Draw dashed line
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([
      Math.max(4, Math.round(canvas.width / 80)),
      Math.max(4, Math.round(canvas.width / 80)),
    ]);
    ctx.stroke();
    ctx.closePath();

    // Draw label
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';

    // Position label slightly above the line, at the right end
    const labelX = line.x2 + Math.round(canvas.width * 0.01);
    const labelY = line.y1 - Math.round(fontSize * 0.2);
    ctx.fillText(line.label, labelX > canvas.width * 0.8 ? line.x1 : labelX, labelY);
  });

  // Draw center crosshair at the oval center
  const crossSize = Math.max(6, Math.round(canvas.width / 60));
  ctx.beginPath();
  ctx.moveTo(ovalX - crossSize, ovalY);
  ctx.lineTo(ovalX + crossSize, ovalY);
  ctx.moveTo(ovalX, ovalY - crossSize);
  ctx.lineTo(ovalX, ovalY + crossSize);
  ctx.strokeStyle = 'rgba(0, 180, 255, 0.5)';
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}
