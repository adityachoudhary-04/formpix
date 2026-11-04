"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { processSignature, type SignatureOptions } from "@/lib/image-processing/signature-processor";
import { type ProcessedImage } from "@/lib/image-processing/resizer";
import { getImageDimensions } from "@/lib/validation/image-validator";
import { type ExamPreset, type ExamDocument } from "@/data/exam-presets";
import { type CropData } from "@/components/editor/image-cropper";

export function useSignatureProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [width, setWidth] = useState<number>(140);
  const [height, setHeight] = useState<number>(60);
  const [unit, setUnit] = useState<"px" | "cm" | "mm">("px");
  const [dpi, setDpi] = useState<number>(200);
  const [minKB, setMinKB] = useState<number>(10);
  const [maxKB, setMaxKB] = useState<number>(20);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [cleanBackground, setCleanBackground] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(200);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(15);
  const [cropData, setCropData] = useState<CropData | undefined>(undefined);

  // Preset tracking
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const currentPreviewUrlRef = useRef<string | null>(null);

  const cleanupPreviewUrl = useCallback(() => {
    if (currentPreviewUrlRef.current) {
      URL.revokeObjectURL(currentPreviewUrlRef.current);
      currentPreviewUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [cleanupPreviewUrl]);

  const handleImageSelect = useCallback(
    async (file: File) => {
      cleanupPreviewUrl();
      setError(null);
      setProcessedImage(null);
      setSelectedFile(file);

      const objectUrl = URL.createObjectURL(file);
      currentPreviewUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);

      try {
        const dims = await getImageDimensions(file);
        setOriginalDimensions(dims);
      } catch (err) {
        console.error("Failed to read image dimensions:", err);
      }
    },
    [cleanupPreviewUrl]
  );

  const handleImageRemove = useCallback(() => {
    cleanupPreviewUrl();
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setOriginalDimensions(null);
    setError(null);
    setCropData(undefined);
  }, [cleanupPreviewUrl]);

  const applyExamPreset = useCallback(
    (exam: ExamPreset | null, doc: ExamDocument | null) => {
      if (!exam || !doc) {
        setSelectedExamId(null);
        return;
      }

      setSelectedExamId(exam.examId);
      setWidth(doc.width);
      setHeight(doc.height);
      setUnit(doc.unit);
      if (doc.dpi) setDpi(doc.dpi);
      setMinKB(doc.minKB);
      setMaxKB(doc.maxKB);
      setFormat(doc.format === "png" ? "image/png" : "image/jpeg");
    },
    []
  );

  const processSignatureImage = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a signature image first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const opts: SignatureOptions = {
        width,
        height,
        minSizeKB: minKB > 0 ? minKB : undefined,
        maxSizeKB: maxKB > 0 ? maxKB : undefined,
        format,
        cleanBackground,
        threshold,
        brightness,
        contrast,
      };

      const result = await processSignature(selectedFile, opts);
      setProcessedImage(result);
    } catch (err: any) {
      console.error("Signature processing error:", err);
      setError(err?.message || "Failed to process signature. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedFile,
    width,
    height,
    minKB,
    maxKB,
    format,
    cleanBackground,
    threshold,
    brightness,
    contrast,
  ]);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;

    const ext = format === "image/png" ? "png" : "jpg";
    const filename = `formpix-signature-${width}x${height}.${ext}`;

    const url = URL.createObjectURL(processedImage.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processedImage, format, width, height]);

  const resetAll = useCallback(() => {
    handleImageRemove();
    setBrightness(0);
    setContrast(15);
    setCleanBackground(true);
    setThreshold(200);
    setError(null);
  }, [handleImageRemove]);

  return {
    selectedFile,
    previewUrl,
    processedImage,
    isProcessing,
    error,
    originalDimensions,
    // Settings
    width,
    height,
    unit,
    dpi,
    minKB,
    maxKB,
    format,
    cleanBackground,
    threshold,
    brightness,
    contrast,
    cropData,
    selectedExamId,
    // Setters
    setWidth,
    setHeight,
    setUnit,
    setDpi,
    setMinKB,
    setMaxKB,
    setFormat,
    setCleanBackground,
    setThreshold,
    setBrightness,
    setContrast,
    setCropData,
    // Actions
    handleImageSelect,
    handleImageRemove,
    applyExamPreset,
    processSignatureImage,
    downloadImage,
    resetAll,
  };
}

