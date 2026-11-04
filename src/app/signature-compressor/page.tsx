"use client";

import React, { useState } from "react";
import { FileSignature, CheckCircle2, AlertCircle, Download, RotateCcw, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/uploader/image-upload";
import { processSignature } from "@/lib/image-processing/signature-processor";
import { getImageDimensions } from "@/lib/validation/image-validator";
import { formatFileSize } from "@/lib/utils";
import { type ProcessedImage } from "@/lib/image-processing/resizer";

export default function SignatureCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Settings
  const [minKB, setMinKB] = useState<number>(10);
  const [maxKB, setMaxKB] = useState<number>(20);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [cleanBg, setCleanBg] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(210);
  const [contrast, setContrast] = useState<number>(20);

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const dims = await getImageDimensions(file);
      setOriginalDimensions(dims);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setOriginalDimensions(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      setError("Please select a signature image first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Use original dimensions if available, or standard 140x60
      const width = originalDimensions ? Math.min(originalDimensions.width, 300) : 140;
      const height = originalDimensions
        ? Math.round(width * (originalDimensions.height / originalDimensions.width))
        : 60;

      const processed = await processSignature(selectedFile, {
        width,
        height,
        minSizeKB: minKB > 0 ? minKB : undefined,
        maxSizeKB: maxKB > 0 ? maxKB : undefined,
        format,
        cleanBackground: cleanBg,
        threshold,
        brightness: 0,
        contrast,
      });

      setResult(processed);
    } catch (err: any) {
      setError(err?.message || "Failed to compress signature.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = format === "image/png" ? "png" : "jpg";
    const filename = `sarkari-signature-${Math.round(result.fileSize / 1024)}kb.${ext}`;

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <FileSignature className="w-3.5 h-3.5" />
          <span>Signature Compressor</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Exam Signature Compressor (Clean & Under 20 KB)
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Designed specifically to compress scanned signatures while ensuring handwriting stroke details remain sharp,
          dark, and legible on pure white background.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signature Compression Settings</CardTitle>
              <CardDescription>Configure file size limits and background cleanup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Presets */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Common Signature Size Targets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "10 KB – 20 KB (Standard)", min: 10, max: 20 },
                    { label: "5 KB – 10 KB (Strict)", min: 5, max: 10 },
                    { label: "20 KB – 50 KB (State PSC)", min: 20, max: 50 },
                    { label: "Under 10 KB", min: 0, max: 10 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setMinKB(preset.min);
                        setMaxKB(preset.max);
                      }}
                      className="text-xs border border-border/80 rounded-md py-2 px-2.5 hover:bg-muted text-left font-mono transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Min KB</Label>
                  <Input
                    type="number"
                    min={0}
                    value={minKB || ""}
                    onChange={(e) => setMinKB(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max KB</Label>
                  <Input
                    type="number"
                    min={1}
                    value={maxKB || ""}
                    onChange={(e) => setMaxKB(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>

              {/* Cleanup */}
              <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-semibold">Clean Scanned Background</Label>
                  </div>
                  <Switch checked={cleanBg} onCheckedChange={setCleanBg} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Eliminates gray paper shadows, creating an ultra-light clean document.
                </p>

                {cleanBg && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sensitivity</span>
                      <span className="font-mono">{threshold}</span>
                    </div>
                    <Slider
                      min={120}
                      max={250}
                      step={1}
                      value={[threshold]}
                      onValueChange={(val) => setThreshold(val[0])}
                    />
                  </div>
                )}
              </div>

              {/* Ink Darkening */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ink Darkening Contrast</span>
                  <span className="font-mono">+{contrast}%</span>
                </div>
                <Slider
                  min={0}
                  max={60}
                  step={1}
                  value={[contrast]}
                  onValueChange={(val) => setContrast(val[0])}
                />
              </div>

              {/* Format */}
              <div className="space-y-1.5">
                <Label className="text-xs">Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["image/jpeg", "image/png"] as const).map((fmt) => (
                    <Button
                      key={fmt}
                      type="button"
                      variant={format === fmt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormat(fmt)}
                      className="text-xs uppercase"
                    >
                      {fmt.replace("image/", "")}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={!selectedFile || isProcessing}
                onClick={handleCompress}
                className="w-full text-base font-semibold shadow-md"
              >
                {isProcessing ? "Cleaning & Compressing..." : "Compress Signature"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signature Upload & Result</CardTitle>
              <CardDescription>Upload photo of signature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={handleSelect}
                onImageRemove={handleRemove}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                label="Upload Signature"
                description="Upload smartphone photo or scan of signature on white paper"
              />

              {isProcessing && (
                <div className="p-8 text-center space-y-3 border rounded-xl bg-muted/20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="font-semibold text-sm">Processing & Compressing Handwriting...</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-sm">Signature Optimized</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                      <span className="text-muted-foreground font-semibold block">Original</span>
                      <p className="font-mono text-base font-bold text-foreground">
                        {selectedFile ? formatFileSize(selectedFile.size) : "N/A"}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-1">
                      <span className="text-primary font-semibold block">Compressed</span>
                      <p className="font-mono text-base font-bold text-primary">
                        {formatFileSize(result.fileSize)} ({Math.round(result.fileSize / 1024)} KB)
                      </p>
                    </div>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-border bg-white p-4 flex items-center justify-center max-h-[180px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.dataUrl}
                      alt="Compressed signature preview"
                      className="max-h-[140px] max-w-full object-contain"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleDownload}
                      className="flex-1 bg-primary text-primary-foreground font-semibold gap-2 shadow-md"
                    >
                      <Download className="w-5 h-5" /> Download ({Math.round(result.fileSize / 1024)} KB)
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={handleRemove}>
                      <RotateCcw className="w-4 h-4 mr-1" /> New
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
