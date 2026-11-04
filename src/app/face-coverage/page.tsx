"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScanFace, CheckCircle2, AlertCircle, Info, Sliders, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/uploader/image-upload";
import { calculateFaceGuide, drawFaceGuide } from "@/lib/image-processing/face-coverage";

export default function FaceCoveragePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (showOverlay) {
        const overlay = calculateFaceGuide(canvas.width, canvas.height);
        drawFaceGuide(canvas, overlay);
      }
    };
    img.src = previewUrl;
  }, [previewUrl, showOverlay]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <ScanFace className="w-3.5 h-3.5" />
          <span>Composition & Alignment Guide</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Passport Photo 70%–80% Face Coverage Guide
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Visual alignment templates to verify that your face, eyes, crown, and chin align with official passport
          and exam portal requirements before you submit your application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checklist & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Visual Overlay Options</CardTitle>
              <CardDescription>Toggle and test photo alignment guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <Label className="text-xs font-semibold">Show Composition Overlay</Label>
                </div>
                <Switch checked={showOverlay} onCheckedChange={setShowOverlay} />
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-sm">Official Composition Rules:</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Oval Area:</strong> Face should occupy between 70% and 80% of the photograph height.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Top of Head:</strong> Leave roughly 10% to 15% headspace above the crown of the head.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Eye Level:</strong> Eyes should rest comfortably at roughly 45%–50% from the top margin.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <p>
                      <strong>Chin Line:</strong> The chin should touch or hover near the 70% reference line.
                    </p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Manual Verification Advisory</span>
                </div>
                <p>
                  This guide displays visual biometric alignment templates. Always inspect your photo manually to
                  ensure clear visibility of both ears, neutral facial expression, and proper lighting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Upload & Canvas Overlay */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Photo & View Guide</CardTitle>
              <CardDescription>Check your photo against passport biometric guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={handleSelect}
                onImageRemove={handleRemove}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                label="Upload Passport Photo"
                description="Upload photo to check composition against standard oval and guidelines"
              />

              {previewUrl && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Live Composition Analysis (with Overlay):
                  </span>
                  <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-black/40 flex items-center justify-center p-3">
                    <canvas
                      ref={canvasRef}
                      className="max-h-[380px] max-w-full object-contain rounded shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">
                    If your face doesn&apos;t fit the oval, open the{" "}
                    <a href="/photo-resizer" className="text-primary underline font-medium">
                      Photo Resizer
                    </a>{" "}
                    to zoom and reposition your photo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

