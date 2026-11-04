import { describe, it, expect } from "vitest";
import {
  examPresets,
  examCategories,
  getExamsByCategory,
  getExamBySlug,
  searchExams,
} from "@/data/exam-presets";

describe("Exam Presets Data & Functions", () => {
  it("should have at least 40 comprehensive exam presets", () => {
    expect(examPresets.length).toBeGreaterThanOrEqual(40);
  });

  it("should cover all primary exam categories", () => {
    const categoriesInPresets = new Set(examPresets.map((e) => e.category));
    expect(categoriesInPresets.has("upsc")).toBe(true);
    expect(categoriesInPresets.has("ssc")).toBe(true);
    expect(categoriesInPresets.has("banking")).toBe(true);
    expect(categoriesInPresets.has("railway")).toBe(true);
  });

  it("every preset should have valid document requirements", () => {
    examPresets.forEach((exam) => {
      expect(exam.examId).toBeTruthy();
      expect(exam.examName).toBeTruthy();
      expect(exam.documents.length).toBeGreaterThan(0);

      exam.documents.forEach((doc) => {
        expect(["photo", "signature", "thumb"]).toContain(doc.documentType);
        expect(doc.width).toBeGreaterThan(0);
        expect(doc.height).toBeGreaterThan(0);
        expect(["px", "cm", "mm"]).toContain(doc.unit);
        expect(doc.minKB).toBeGreaterThanOrEqual(0);
        expect(doc.maxKB).toBeGreaterThan(doc.minKB);
        expect(["jpg", "jpeg", "png"]).toContain(doc.format);
      });
    });
  });

  it("should filter exams by category correctly", () => {
    const upscExams = getExamsByCategory("upsc");
    expect(upscExams.length).toBeGreaterThan(0);
    upscExams.forEach((e) => expect(e.category).toBe("upsc"));
  });

  it("should find an exam by slug", () => {
    const ssc = getExamBySlug("ssc-cgl");
    expect(ssc).toBeDefined();
    expect(ssc?.examName).toContain("SSC CGL");
  });

  it("should search exams by query string", () => {
    const results = searchExams("civil services");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].examName.toLowerCase()).toContain("civil services");
  });
});

