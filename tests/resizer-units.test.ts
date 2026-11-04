import { describe, it, expect } from "vitest";
import { convertToPixels, applyBrightnessContrast } from "@/lib/image-processing/resizer";
import { calculateFaceGuide } from "@/lib/image-processing/face-coverage";
import { cleanSignatureBackground } from "@/lib/image-processing/signature-processor";
import { formatFileSize, formatDimensions, generateSlug } from "@/lib/utils";

describe("Resizer Unit Conversion", () => {
  it("should return identical values for pixels", () => {
    expect(convertToPixels(350, "px", 300)).toBe(350);
    expect(convertToPixels(140, "px", 200)).toBe(140);
  });

  it("should convert centimeters to pixels at 300 DPI", () => {
    // 1 inch = 2.54 cm -> (3.5 / 2.54) * 300 = 413.38 ~ 413 px
    const px = convertToPixels(3.5, "cm", 300);
    expect(px).toBe(413);

    // 4.5 cm at 300 DPI -> (4.5 / 2.54) * 300 = 531.49 ~ 531 px
    const pxH = convertToPixels(4.5, "cm", 300);
    expect(pxH).toBe(531);
  });

  it("should convert millimeters to pixels at 200 DPI", () => {
    // 35 mm = 3.5 cm -> (35 / 25.4) * 200 = 275.59 ~ 276 px
    const px = convertToPixels(35, "mm", 200);
    expect(px).toBe(276);
  });

  it("should throw error for non-positive values", () => {
    expect(() => convertToPixels(-5, "cm", 300)).toThrow();
    expect(() => convertToPixels(10, "cm", 0)).toThrow();
  });
});

describe("Face Coverage Guide Calculation", () => {
  it("should calculate correct proportions for passport photo", () => {
    const guide = calculateFaceGuide(350, 450);
    expect(guide.ovalX).toBe(175); // Centered horizontally
    expect(guide.ovalWidth).toBeCloseTo(350 * 0.38, 1);
    expect(guide.guidelines.length).toBe(3); // Crown, Eye, Chin
  });
});

describe("Signature Background Cleaner Algorithm", () => {
  it("should turn near-white background pixels into pure white", () => {
    // Mock ImageData: 1 pixel of light gray (220, 220, 220, 255) and 1 dark ink pixel (30, 30, 30, 255)
    const data = new Uint8ClampedArray([
      220, 220, 220, 255, // paper background
      30, 30, 30, 255,    // ink stroke
    ]);
    const mockImageData = {
      data,
      width: 2,
      height: 1,
      colorSpace: "srgb" as const,
    } as ImageData;

    cleanSignatureBackground(mockImageData, 200);

    // Light gray pixel should now be pure white (255, 255, 255)
    expect(data[0]).toBe(255);
    expect(data[1]).toBe(255);
    expect(data[2]).toBe(255);

    // Ink stroke should remain untouched
    expect(data[4]).toBe(30);
    expect(data[5]).toBe(30);
    expect(data[6]).toBe(30);
  });
});

describe("Utility Formatting Functions", () => {
  it("should format file sizes accurately", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(51200)).toBe("50 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
  });

  it("should format dimensions string", () => {
    expect(formatDimensions(350, 450, "px")).toBe("350 × 450 px");
    expect(formatDimensions(3.5, 4.5, "cm")).toBe("3.5 × 4.5 cm");
  });

  it("should generate URL slugs cleanly", () => {
    expect(generateSlug("SSC CGL Examination 2026")).toBe("ssc-cgl-examination-2026");
    expect(generateSlug("UPSC Civil Services (IAS)")).toBe("upsc-civil-services-ias");
  });
});
