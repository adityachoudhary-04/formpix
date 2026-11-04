"use client";

import React from "react";
import { Download, RotateCcw, CheckCircle2, AlertCircle, FileImage, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, cn } from "@/lib/utils";
import { type ProcessedImage } from "@/lib/image-processing/resizer";

export interface ProcessingResultProps {
  originalFile: File | null;
  originalDimensions?: { width: number; height: number } | null;
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  error: string | null;
  minKB?: number;
  maxKB?: number;
  onDownload: () => void;
  onReset: () => void;
  className?: string;
}

export function ProcessingResult({
  originalFile,
  originalDimensions,
  processedImage,
  isProcessing,
  error,
  minKB = 0,
  maxKB = 0,
  onDownload,
  onReset,
  className,
}: ProcessingResultProps) {
  if (isProcessing) {
    return (
      <div className={cn("p-8 rounded-xl border border-border bg-card text-center space-y-4", className)}>
        <div className="flex justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <p className="font-semibold text-base">Processing Image...</p>
        <p className="text-xs text-muted-foreground">
          Resizing, applying adjustments, and optimizing file size locally in your browser.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 rounded-xl border border-destructive/30 bg-destructive/5 space-y-4", className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-destructive">Processing Error</h4>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  if (!processedImage) {
    return null;
  }

  const processedSizeKB = Math.round(processedImage.fileSize / 1024);
  const isWithinMinKB = minKB <= 0 || processedSizeKB >= minKB;
  const isWithinMaxKB = maxKB <= 0 || processedSizeKB <= maxKB;
  const sizeTargetMet = isWithinMinKB && isWithinMaxKB;

  return (
    <div className={cn("p-5 rounded-xl border border-border bg-card shadow-sm space-y-5", className)}>
      <div className="flex items-center justify-between border-b pb-3 border-border">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h4 className="font-semibold text-sm">Image Processed Successfully!</h4>
        </div>
        {maxKB > 0 && (
          <Badge
            variant={sizeTargetMet ? "default" : "secondary"}
            className={sizeTargetMet ? "bg-emerald-600 hover:bg-emerald-700 text-xs" : "text-amber-600 text-xs"}
          >
            {sizeTargetMet ? "Target Size Met" : "Target Size Advisory"}
          </Badge>
        )}
      </div>

      {/* Comparison Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Processed Result View */}
        <div className="space-y-2 text-center order-1 sm:order-2">
          <span className="text-xs font-semibold text-primary block">Optimized Result</span>
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/40 bg-muted/30 p-2 flex items-center justify-center min-h-[180px] max-h-[260px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={processedImage.dataUrl}
              alt="Processed output"
              className="max-h-[240px] max-w-full object-contain rounded shadow-sm"
            />
          </div>
          <div className="text-xs space-y-0.5 text-muted-foreground">
            <p className="font-semibold text-foreground">
              {processedImage.width} × {processedImage.height} px
            </p>
            <p className="font-mono text-primary font-medium">
              {formatFileSize(processedImage.fileSize)} ({processedSizeKB} KB)
            </p>
            <p className="text-[11px] uppercase tracking-wider">{processedImage.format.replace("image/", "")}</p>
          </div>
        </div>

        {/* Original Summary */}
        <div className="space-y-2 text-center order-2 sm:order-1 border-t sm:border-t-0 sm:border-r sm:pr-4 border-border pt-4 sm:pt-0">
          <span className="text-xs font-semibold text-muted-foreground block">Original Image</span>
          <div className="text-xs space-y-1.5 p-3 rounded-lg bg-muted/40 text-left">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Original Dimensions:</span>
              <span className="font-mono font-medium">
                {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height} px` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Original File Size:</span>
              <span className="font-mono font-medium">
                {originalFile ? formatFileSize(originalFile.size) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Original Format:</span>
              <span className="font-mono uppercase font-medium">
                {originalFile?.type?.replace("image/", "") || "N/A"}
              </span>
            </div>
          </div>

          {/* Size Range Target Check */}
          {(minKB > 0 || maxKB > 0) && (
            <div className="text-[11px] p-2 rounded bg-muted/30 border border-border/50 text-left">
              <span className="font-semibold block text-foreground mb-1">Target Constraints:</span>
              <p className="text-muted-foreground">
                Required: {minKB > 0 ? `${minKB} KB` : "0 KB"} – {maxKB > 0 ? `${maxKB} KB` : "Any"}
              </p>
              <p className={sizeTargetMet ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                Actual: {processedSizeKB} KB {sizeTargetMet ? "✓ Within Range" : "⚠ See Quality"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
        <Button
          type="button"
          size="lg"
          onClick={onDownload}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md gap-2"
        >
          <Download className="w-5 h-5" /> Download Processed Image
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" /> Reset & Start New
        </Button>
      </div>
    </div>
  );
}

