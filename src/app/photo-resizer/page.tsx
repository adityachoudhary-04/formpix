"use client";

import React, { useState } from "react";
import { Camera, Shield, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/uploader/image-upload";
import { ImageCropper } from "@/components/editor/image-cropper";
import { DimensionControls } from "@/components/editor/dimension-controls";
import { SizeControls } from "@/components/editor/size-controls";
import { ImageAdjustments } from "@/components/editor/image-adjustments";
import { ExamSelector } from "@/components/editor/exam-selector";
import { ProcessingResult } from "@/components/editor/processing-result";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function PhotoResizerPage() {
  const processor = useImageProcessor("photo");
  const [showCropper, setShowCropper] = useState(true);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center md:text-left border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>Exam Photo Resizer</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Passport Photo Resizer for Government Exams
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Resize, crop, and compress your passport photograph to the exact dimensions (pixels, centimeters, millimeters)
          and file size limits (KB) required by UPSC, SSC, Banking, Railway, and State PSC application portals.
        </p>
      </div>

      {/* Main 2-Column Processing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Settings & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configuration Settings</CardTitle>
              <CardDescription>Select an exam preset or configure manually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Presets */}
              <ExamSelector
                selectedExamId={processor.selectedExamId}
                selectedDocType={processor.selectedDocType}
                allowedDocTypes={["photo"]}
                onSelectExam={(exam, doc) => processor.applyExamPreset(exam, doc)}
              />

              {/* Dimensions */}
              <DimensionControls
                width={processor.width}
                height={processor.height}
                unit={processor.unit}
                dpi={processor.dpi}
                lockAspectRatio={processor.lockAspectRatio}
                onWidthChange={processor.setWidth}
                onHeightChange={processor.setHeight}
                onUnitChange={processor.setUnit}
                onDpiChange={processor.setDpi}
                onLockAspectRatioChange={processor.setLockAspectRatio}
              />

              {/* Size Constraints */}
              <SizeControls
                minKB={processor.minKB}
                maxKB={processor.maxKB}
                format={processor.format}
                onMinKBChange={processor.setMinKB}
                onMaxKBChange={processor.setMaxKB}
                onFormatChange={processor.setFormat}
              />

              {/* Image Adjustments */}
              <ImageAdjustments
                brightness={processor.brightness}
                contrast={processor.contrast}
                quality={processor.quality}
                onBrightnessChange={processor.setBrightness}
                onContrastChange={processor.setContrast}
                onQualityChange={processor.setQuality}
                onReset={processor.resetAdjustments}
              />

              {/* Resize Mode */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-muted-foreground font-medium">Resize Fitting Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={processor.mode === "crop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => processor.setMode("crop")}
                    className="text-xs"
                  >
                    Crop to Fill
                  </Button>
                  <Button
                    type="button"
                    variant={processor.mode === "fit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => processor.setMode("fit")}
                    className="text-xs"
                  >
                    Fit with White Margins
                  </Button>
                </div>
              </div>

              {/* Process Button */}
              <Button
                type="button"
                size="lg"
                disabled={!processor.selectedFile || processor.isProcessing}
                onClick={processor.processImage}
                className="w-full text-base font-semibold shadow-md"
              >
                {processor.isProcessing ? "Processing..." : "Resize & Optimize Photo"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Upload, Cropper & Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Upload Photo & Review</CardTitle>
                  <CardDescription>Support for JPG, JPEG, PNG, WEBP files up to 10 MB</CardDescription>
                </div>
                {processor.previewUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCropper(!showCropper)}
                    className="text-xs"
                  >
                    {showCropper ? "Hide Cropper" : "Show Cropper"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={processor.handleImageSelect}
                onImageRemove={processor.handleImageRemove}
                selectedFile={processor.selectedFile}
                previewUrl={processor.previewUrl}
                label="Upload Passport Photo"
                description="Upload clear passport photo with light/white background"
              />

              {processor.previewUrl && showCropper && (
                <div className="border border-border p-4 rounded-xl bg-card">
                  <ImageCropper
                    imageUrl={processor.previewUrl}
                    aspectRatio={processor.width && processor.height ? processor.width / processor.height : 3.5 / 4.5}
                    onCropChange={processor.setCropData}
                  />
                </div>
              )}

              <ProcessingResult
                originalFile={processor.selectedFile}
                originalDimensions={processor.originalDimensions}
                processedImage={processor.processedImage}
                isProcessing={processor.isProcessing}
                error={processor.error}
                minKB={processor.minKB}
                maxKB={processor.maxKB}
                onDownload={processor.downloadImage}
                onReset={processor.resetAll}
              />
            </CardContent>
          </Card>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard Passport Photo Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Photo must be recent (taken within the last 3 to 6 months).</li>
              <li>Plain light or white background without shadows or patterns.</li>
              <li>Face should occupy roughly 70% to 80% of the photograph area.</li>
              <li>Both ears and eyes must be clearly visible. Avoid glare or tinted glasses.</li>
              <li>Caps, hats, and dark sunglasses are strictly prohibited by all exam authorities.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

