"use client";

import React, { useState } from "react";
import { PenTool, CheckCircle2, Wand2, Sliders, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/uploader/image-upload";
import { ImageCropper } from "@/components/editor/image-cropper";
import { DimensionControls } from "@/components/editor/dimension-controls";
import { SizeControls } from "@/components/editor/size-controls";
import { ExamSelector } from "@/components/editor/exam-selector";
import { ProcessingResult } from "@/components/editor/processing-result";
import { useSignatureProcessor } from "@/hooks/useSignatureProcessor";

export default function SignatureResizerPage() {
  const sig = useSignatureProcessor();
  const [showCropper, setShowCropper] = useState(true);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <PenTool className="w-3.5 h-3.5" />
          <span>Signature Resizer & Enhancer</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Exam Signature Resizer & Background Cleaner
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Resize scanned signatures to exact pixel dimensions (e.g. 140×60 px) and file size requirements (10–20 KB).
          Automatically removes shadowy paper backgrounds and enhances black/blue ink strokes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signature Specifications</CardTitle>
              <CardDescription>Choose exam preset or enter manual requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Presets for Signature */}
              <ExamSelector
                selectedExamId={sig.selectedExamId}
                selectedDocType="signature"
                allowedDocTypes={["signature"]}
                onSelectExam={(exam, doc) => sig.applyExamPreset(exam, doc)}
              />

              {/* Dimensions */}
              <DimensionControls
                width={sig.width}
                height={sig.height}
                unit={sig.unit}
                dpi={sig.dpi}
                onWidthChange={sig.setWidth}
                onHeightChange={sig.setHeight}
                onUnitChange={sig.setUnit}
                onDpiChange={sig.setDpi}
              />

              {/* Size constraints */}
              <SizeControls
                minKB={sig.minKB}
                maxKB={sig.maxKB}
                format={sig.format}
                onMinKBChange={sig.setMinKB}
                onMaxKBChange={sig.setMaxKB}
                onFormatChange={(fmt) => sig.setFormat(fmt === "image/png" ? "image/png" : "image/jpeg")}
              />

              {/* Signature Cleanup Tools */}
              <div className="space-y-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-semibold">Clean White Background</Label>
                  </div>
                  <Switch
                    checked={sig.cleanBackground}
                    onCheckedChange={sig.setCleanBackground}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Converts grayish scanned paper noise into pure white while preserving your ink strokes.
                </p>

                {sig.cleanBackground && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Threshold Sensitivity</span>
                      <span className="font-mono">{sig.threshold}</span>
                    </div>
                    <Slider
                      min={100}
                      max={250}
                      step={1}
                      value={[sig.threshold]}
                      onValueChange={(val) => sig.setThreshold(val[0])}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>More ink kept</span>
                      <span>Whiter background</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stroke Contrast & Brightness */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-semibold">Stroke Enhancements</Label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Ink Contrast (Darker Strokes)</span>
                    <span className="font-mono">+{sig.contrast}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={60}
                    step={1}
                    value={[sig.contrast]}
                    onValueChange={(val) => sig.setContrast(val[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Brightness</span>
                    <span className="font-mono">{sig.brightness}</span>
                  </div>
                  <Slider
                    min={-40}
                    max={40}
                    step={1}
                    value={[sig.brightness]}
                    onValueChange={(val) => sig.setBrightness(val[0])}
                  />
                </div>
              </div>

              {/* Process Button */}
              <Button
                type="button"
                size="lg"
                disabled={!sig.selectedFile || sig.isProcessing}
                onClick={sig.processSignatureImage}
                className="w-full text-base font-semibold shadow-md"
              >
                {sig.isProcessing ? "Enhancing & Resizing..." : "Process Signature"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Upload, Crop & Result */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Upload Signature Image</CardTitle>
                  <CardDescription>Scanned image or smartphone photo of signature on white paper</CardDescription>
                </div>
                {sig.previewUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCropper(!showCropper)}
                    className="text-xs"
                  >
                    {showCropper ? "Hide Crop" : "Crop Signature"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={sig.handleImageSelect}
                onImageRemove={sig.handleImageRemove}
                selectedFile={sig.selectedFile}
                previewUrl={sig.previewUrl}
                label="Upload Scanned Signature"
                description="Upload photo or scan of your signature on clean white paper"
              />

              {sig.previewUrl && showCropper && (
                <div className="border border-border p-4 rounded-xl bg-card">
                  <ImageCropper
                    imageUrl={sig.previewUrl}
                    aspectRatio={sig.width && sig.height ? sig.width / sig.height : 140 / 60}
                    onCropChange={sig.setCropData}
                  />
                </div>
              )}

              <ProcessingResult
                originalFile={sig.selectedFile}
                originalDimensions={sig.originalDimensions}
                processedImage={sig.processedImage}
                isProcessing={sig.isProcessing}
                error={sig.error}
                minKB={sig.minKB}
                maxKB={sig.maxKB}
                onDownload={sig.downloadImage}
                onReset={sig.resetAll}
              />
            </CardContent>
          </Card>

          {/* Signature Rules Box */}
          <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" /> Government Exam Signature Rules
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Sign using a black or blue ballpoint pen on unruled (blank) white paper.</li>
              <li>Do NOT sign in capital block letters (e.g., &quot;RAHUL&quot; is rejected by SSC/UPSC).</li>
              <li>Crop tightly around the signature to remove blank paper margins.</li>
              <li>Ensure no shadows fall across the writing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
