/**
 * Image Validation Utilities
 * 
 * Validates image files before processing: checks file type, size,
 * dimensions, and processing parameters. Used as a guard before
 * any image processing operations.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
}

/** Maximum allowed file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Accepted image MIME types */
export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

/** Maximum allowed dimension in either direction (pixels) */
export const MAX_DIMENSION = 10000;

/** Minimum allowed dimension in either direction (pixels) */
const MIN_DIMENSION = 1;

/**
 * Validate an image file for type and size constraints.
 * Does NOT load the image — this is a quick synchronous check.
 * 
 * @param file - The File to validate
 * @returns ValidationResult indicating whether the file is acceptable
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if a file was actually provided
  if (!file) {
    return {
      valid: false,
      error: 'No file provided.',
      fileSize: 0,
    };
  }

  // Check file size
  if (file.size === 0) {
    return {
      valid: false,
      error: 'The file is empty (0 bytes).',
      fileSize: 0,
      mimeType: file.type,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  // Check MIME type
  const mimeType = file.type.toLowerCase();
  if (!mimeType) {
    // No MIME type — try to infer from extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
      heif: 'image/heif',
    };

    if (!extension || !extensionMap[extension]) {
      return {
        valid: false,
        error: 'Unable to determine file type. Please upload a JPEG, PNG, or WebP image.',
        fileSize: file.size,
      };
    }
    // Extension is valid even though MIME is missing
  } else if (!ACCEPTED_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType}. Please upload a JPEG, PNG, or WebP image.`,
      fileSize: file.size,
      mimeType,
    };
  }

  return {
    valid: true,
    fileSize: file.size,
    mimeType: mimeType || undefined,
  };
}

/**
 * Load an image file and retrieve its natural dimensions.
 * 
 * Creates a temporary object URL to load the image — the URL is
 * revoked automatically after dimensions are read.
 * 
 * @param file - The image file to measure
 * @returns Promise resolving to {width, height} in pixels
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (width === 0 || height === 0) {
        reject(new Error('Image has zero dimensions. The file may be corrupted.'));
        return;
      }

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        reject(
          new Error(
            `Image dimensions (${width}x${height}) exceed the maximum of ${MAX_DIMENSION}px. Please resize the image before uploading.`
          )
        );
        return;
      }

      resolve({ width, height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          'Failed to load image. The file may be corrupted or in an unsupported format.'
        )
      );
    };

    img.src = url;
  });
}

/**
 * Validate processing parameters for image resizing.
 * Ensures width, height, and DPI are within reasonable bounds.
 * 
 * @param width - Target width value
 * @param height - Target height value
 * @param unit - Unit of measurement ('px', 'cm', or 'mm')
 * @param dpi - Dots per inch for unit conversion
 * @returns ValidationResult
 */
export function validateProcessingParams(
  width: number,
  height: number,
  unit: string,
  dpi: number
): ValidationResult {
  // Validate width
  if (typeof width !== 'number' || isNaN(width) || width <= 0) {
    return { valid: false, error: 'Width must be a positive number.' };
  }

  // Validate height
  if (typeof height !== 'number' || isNaN(height) || height <= 0) {
    return { valid: false, error: 'Height must be a positive number.' };
  }

  // Validate unit
  const validUnits = ['px', 'cm', 'mm'];
  if (!validUnits.includes(unit)) {
    return { valid: false, error: `Invalid unit: ${unit}. Must be one of: ${validUnits.join(', ')}` };
  }

  // Validate DPI
  if (typeof dpi !== 'number' || isNaN(dpi) || dpi <= 0) {
    return { valid: false, error: 'DPI must be a positive number.' };
  }
  if (dpi > 1200) {
    return { valid: false, error: 'DPI exceeds the maximum of 1200.' };
  }

  // Convert to pixels and check dimension bounds
  let widthPx: number;
  let heightPx: number;

  switch (unit) {
    case 'px':
      widthPx = width;
      heightPx = height;
      break;
    case 'cm':
      widthPx = (width / 2.54) * dpi;
      heightPx = (height / 2.54) * dpi;
      break;
    case 'mm':
      widthPx = (width / 25.4) * dpi;
      heightPx = (height / 25.4) * dpi;
      break;
    default:
      widthPx = width;
      heightPx = height;
  }

  if (widthPx < MIN_DIMENSION || heightPx < MIN_DIMENSION) {
    return {
      valid: false,
      error: `Resulting dimensions (${Math.round(widthPx)}x${Math.round(heightPx)}px) are too small. Minimum is ${MIN_DIMENSION}px.`,
    };
  }

  if (widthPx > MAX_DIMENSION || heightPx > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Resulting dimensions (${Math.round(widthPx)}x${Math.round(heightPx)}px) exceed the maximum of ${MAX_DIMENSION}px.`,
    };
  }

  return {
    valid: true,
    width: Math.round(widthPx),
    height: Math.round(heightPx),
  };
}

/**
 * Check if a given image format string is supported for output.
 * 
 * @param format - The MIME type to check (e.g., 'image/jpeg')
 * @returns true if the format is supported for encoding
 */
export function isFormatSupported(format: string): boolean {
  const supportedOutputFormats = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  return supportedOutputFormats.includes(format.toLowerCase());
}
