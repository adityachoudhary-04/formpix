"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { resizeImage, type ResizeOptions, type ProcessedImage } from "@/lib/image-processing/resizer";
import { compressImage } from "@/lib/image-processing/compressor";
import { getImageDimensions } from "@/lib/validation/image-validator";
import { type ExamPreset, type ExamDocument, type DocumentType } from "@/data/exam-presets";
import { type CropData } from "@/components/editor/image-cropper";

export function useImageProcessor(initialDocType: DocumentType = "photo") {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(450);
  const [unit, setUnit] = useState<"px" | "cm" | "mm">("px");
  const [dpi, setDpi] = useState<number>(300);
  const [minKB, setMinKB] = useState<number>(20);
  const [maxKB, setMaxKB] = useState<number>(50);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(90);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [mode, setMode] = useState<"crop" | "fit" | "stretch">("crop");
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);
  const [cropData, setCropData] = useState<CropData | undefined>(undefined);
  const [rotation, setRotation] = useState<number>(0);

  // Exam preset tracking
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(initialDocType);

  // Original image info
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Reference for object URLs to revoke
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

  // Handle image selection
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

  // Apply exam preset
  const applyExamPreset = useCallback(
    (exam: ExamPreset | null, doc: ExamDocument | null) => {
      if (!exam || !doc) {
        setSelectedExamId(null);
        return;
      }

      setSelectedExamId(exam.examId);
      setSelectedDocType(doc.documentType);
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

  // Process the image
  const processImage = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const resizeOpts: ResizeOptions = {
        width,
        height,
        unit,
        dpi,
        mode,
        format: format as "image/jpeg" | "image/png" | "image/webp",
        quality: quality / 100,
        cropData,
        rotation,
        brightness,
        contrast,
      };

      // 1. Initial resize and visual adjustments
      let result = await resizeImage(selectedFile, resizeOpts);

      // 2. Target file size optimization if minKB or maxKB are specified
      if (maxKB > 0 || minKB > 0) {
        try {
          // Convert resized blob into a File to feed into compressor
          const resizedFile = new File([result.blob], selectedFile.name, {
            type: result.format,
          });

          const compResult = await compressImage(resizedFile, {
            minSizeKB: minKB,
            maxSizeKB: maxKB > 0 ? maxKB : 500,
            format: format as "image/jpeg" | "image/png" | "image/webp",
            targetWidth: result.width,
            targetHeight: result.height,
          });

          if (compResult.success) {
            result = {
              blob: compResult.blob,
              dataUrl: compResult.dataUrl,
              width: compResult.width,
              height: compResult.height,
              fileSize: compResult.fileSize,
              format: compResult.format,
            };
          }
        } catch (compressionErr) {
          console.warn("Target size optimization warning:", compressionErr);
          // Keep the initial resized result if compression search failed
        }
      }

      setProcessedImage(result);
    } catch (err: any) {
      console.error("Processing failed:", err);
      setError(err?.message || "Failed to process image. Please check settings and try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedFile,
    width,
    height,
    unit,
    dpi,
    mode,
    format,
    quality,
    cropData,
    rotation,
    brightness,
    contrast,
    minKB,
    maxKB,
  ]);

  // Download the processed image
  const downloadImage = useCallback(() => {
    if (!processedImage) return;

    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const filename = `sarkari-photo-${selectedDocType}-${width}x${height}.${ext}`;

    const url = URL.createObjectURL(processedImage.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processedImage, format, selectedDocType, width, height]);

  // Reset adjustments
  const resetAdjustments = useCallback(() => {
    setBrightness(0);
    setContrast(0);
    setQuality(90);
    setRotation(0);
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    handleImageRemove();
    resetAdjustments();
    setError(null);
  }, [handleImageRemove, resetAdjustments]);

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
    quality,
    brightness,
    contrast,
    mode,
    lockAspectRatio,
    cropData,
    rotation,
    selectedExamId,
    selectedDocType,
    // Setters
    setWidth,
    setHeight,
    setUnit,
    setDpi,
    setMinKB,
    setMaxKB,
    setFormat,
    setQuality,
    setBrightness,
    setContrast,
    setMode,
    setLockAspectRatio,
    setCropData,
    setRotation,
    // Actions
    handleImageSelect,
    handleImageRemove,
    applyExamPreset,
    processImage,
    downloadImage,
    resetAdjustments,
    resetAll,
  };
}
