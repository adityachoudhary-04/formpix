import { describe, it, expect } from "vitest";
import {
  validateImageFile,
  validateProcessingParams,
  isFormatSupported,
} from "@/lib/validation/image-validator";

describe("Image Validator", () => {
  it("should accept valid JPEG file under 10MB", () => {
    const file = new File([new Uint8Array(5000)], "passport.jpg", {
      type: "image/jpeg",
    });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should accept valid PNG and WEBP files", () => {
    const png = new File([new Uint8Array(10000)], "signature.png", {
      type: "image/png",
    });
    expect(validateImageFile(png).valid).toBe(true);

    const webp = new File([new Uint8Array(10000)], "photo.webp", {
      type: "image/webp",
    });
    expect(validateImageFile(webp).valid).toBe(true);
  });

  it("should reject files exceeding 10MB", () => {
    // 11MB file
    const largeFile = new File([new Uint8Array(11 * 1024 * 1024)], "heavy.jpg", {
      type: "image/jpeg",
    });
    const result = validateImageFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10MB");
  });

  it("should reject non-image file formats", () => {
    const pdf = new File([new Uint8Array(100)], "doc.pdf", {
      type: "application/pdf",
    });
    const result = validateImageFile(pdf);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unsupported file type");
  });

  it("should validate processing parameters properly", () => {
    expect(validateProcessingParams(350, 450, "px", 300).valid).toBe(true);
    expect(validateProcessingParams(0, 450, "px", 300).valid).toBe(false);
    expect(validateProcessingParams(350, -10, "px", 300).valid).toBe(false);
    expect(validateProcessingParams(3.5, 4.5, "cm", 0).valid).toBe(false);
  });

  it("should recognize supported formats", () => {
    expect(isFormatSupported("image/jpeg")).toBe(true);
    expect(isFormatSupported("image/png")).toBe(true);
    expect(isFormatSupported("image/webp")).toBe(true);
    expect(isFormatSupported("image/gif")).toBe(false);
  });
});
