"use client";

import React, { useState } from "react";
import { Minimize2, CheckCircle2, AlertCircle, ArrowRight, Download, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/uploader/image-upload";
import { compressImage, type CompressionResult } from "@/lib/image-processing/compressor";
import { getImageDimensions } from "@/lib/validation/image-validator";
import { formatFileSize } from "@/lib/utils";

export default function ImageCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Settings
  const [minKB, setMinKB] = useState<number>(20);
  const [maxKB, setMaxKB] = useState<number>(50);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
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
      setError("Please upload an image first.");
      return;
    }

    if (minKB > 0 && maxKB > 0 && minKB > maxKB) {
      setError("Minimum file size cannot be greater than Maximum file size.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const compResult = await compressImage(selectedFile, {
        minSizeKB: minKB,
        maxSizeKB: maxKB,
        format,
        targetWidth: targetWidth ? parseInt(targetWidth, 10) : undefined,
        targetHeight: targetHeight ? parseInt(targetHeight, 10) : undefined,
      });

      setResult(compResult);
    } catch (err: any) {
      setError(err?.message || "Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const filename = `formpix-compressed-${Math.round(result.fileSize / 1024)}kb.${ext}`;

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
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Iterative Image Compressor</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Exam Image Compressor (Exact KB Target)
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Compress photos to fit strictly within government exam portal limits (e.g., 20 KB to 50 KB or 50 KB to 100 KB).
          Uses binary search quality optimization to ensure maximum visual fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Target File Size & Options</CardTitle>
              <CardDescription>Specify your desired KB limits and format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Presets */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Standard Exam Size Targets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "10 KB – 20 KB (Signatures)", min: 10, max: 20 },
                    { label: "20 KB – 50 KB (SSC / UPSC)", min: 20, max: 50 },
                    { label: "50 KB – 100 KB (Bank / RRB)", min: 50, max: 100 },
                    { label: "100 KB – 200 KB (Documents)", min: 100, max: 200 },
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

              {/* Exact Min and Max Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Minimum Size (KB)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={minKB || ""}
                    onChange={(e) => setMinKB(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Maximum Size (KB)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={maxKB || ""}
                    onChange={(e) => setMaxKB(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-1.5">
                <Label className="text-xs">Output Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["image/jpeg", "image/png", "image/webp"] as const).map((fmt) => (
                    <Button
                      key={fmt}
                      type="button"
                      variant={format === fmt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormat(fmt)}
                      className="text-xs capitalize"
                    >
                      {fmt.replace("image/", "")}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Optional Dimensions */}
              <div className="space-y-2 pt-2 border-t border-border">
                <Label className="text-xs text-muted-foreground">Optional Target Dimensions (px)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Width (optional)"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(e.target.value)}
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Height (optional)"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={!selectedFile || isProcessing}
                onClick={handleCompress}
                className="w-full text-base font-semibold shadow-md"
              >
                {isProcessing ? "Optimizing Size..." : "Compress to Target KB"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Image</CardTitle>
              <CardDescription>Select high-resolution or heavy image to compress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={handleSelect}
                onImageRemove={handleRemove}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
              />

              {isProcessing && (
                <div className="p-8 text-center space-y-3 border rounded-xl bg-muted/20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="font-semibold text-sm">Running Iterative Compression Algorithm...</p>
                  <p className="text-xs text-muted-foreground">
                    Calculating optimal quality ratio across multiple passes to guarantee target KB range.
                  </p>
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
                      <span className="font-semibold text-sm">Compression Complete</span>
                    </div>
                    <Badge
                      variant={result.success ? "default" : "secondary"}
                      className={result.success ? "bg-emerald-600 text-xs" : "text-amber-600 text-xs"}
                    >
                      {result.success ? "Within Exact Range" : "Approximate Result"}
                    </Badge>
                  </div>

                  {result.message && (
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg border">
                      {result.message}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                      <span className="text-muted-foreground font-semibold block">Before Compression</span>
                      <p className="font-mono text-base font-bold text-foreground">
                        {selectedFile ? formatFileSize(selectedFile.size) : "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height} px` : ""}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 space-y-1">
                      <span className="text-primary font-semibold block">After Compression</span>
                      <p className="font-mono text-base font-bold text-primary">
                        {formatFileSize(result.fileSize)} ({Math.round(result.fileSize / 1024)} KB)
                      </p>
                      <p className="text-muted-foreground">
                        {result.width} × {result.height} px • Quality: {Math.round(result.quality * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30 p-2 flex items-center justify-center max-h-[260px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.dataUrl}
                      alt="Compressed preview"
                      className="max-h-[240px] max-w-full object-contain rounded"
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

