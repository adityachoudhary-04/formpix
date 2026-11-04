"use client";

import React, { useState, useEffect } from "react";
import { CalendarPlus, CheckCircle2, Download, RotateCcw, AlertCircle, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/uploader/image-upload";
import { addNameDate, type NameDateOptions } from "@/lib/image-processing/name-date-processor";
import { type ProcessedImage } from "@/lib/image-processing/resizer";
import { formatFileSize } from "@/lib/utils";

export default function AddNameDatePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form options
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [showName, setShowName] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [stripHeight, setStripHeight] = useState<number>(12); // % of height
  const [fontSize, setFontSize] = useState<number>(18);

  // Processed state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<ProcessedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProcessedResult(null);
    setError(null);
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Please select a photograph first.");
      return;
    }
    if (!showName && !showDate) {
      setError("Please enable at least Name or Date to add to the photo.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Format date nicely (e.g. DD-MM-YYYY)
      let formattedDate = date;
      if (date && date.includes("-")) {
        const parts = date.split("-");
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }

      const opts: NameDateOptions = {
        name: name.trim().toUpperCase(),
        date: formattedDate ? `DOP: ${formattedDate}` : "",
        showName,
        showDate,
        stripHeight,
        fontSize,
        fontFamily: "Arial, sans-serif",
        textColor: "#000000",
        backgroundColor: "#FFFFFF",
      };

      const res = await addNameDate(selectedFile, opts);
      setProcessedResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate photo with name & date.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedResult) return;
    const filename = `sarkari-photo-name-date.jpg`;
    const url = URL.createObjectURL(processedResult.blob);
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
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Name & Date of Photo (DOP)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Add Name & Date of Photo (DOP) on Passport Photo
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Instantly add a professional white info strip containing the candidate&apos;s name and Date of Photograph (DOP)
          as mandated by SSC CGL, CHSL, MTS, GD Constable, and various state public service commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input options */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Candidate Information</CardTitle>
              <CardDescription>Enter details to display on the photo strip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name Toggle & Input */}
              <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Candidate Name</Label>
                  <Switch checked={showName} onCheckedChange={setShowName} />
                </div>
                {showName && (
                  <Input
                    placeholder="Enter Candidate Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm uppercase"
                  />
                )}
              </div>

              {/* Date Toggle & Input */}
              <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Date of Photo (DOP)</Label>
                  <Switch checked={showDate} onCheckedChange={setShowDate} />
                </div>
                {showDate && (
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>

              {/* Strip Customization */}
              <div className="space-y-4 pt-2">
                <Label className="text-xs font-semibold text-muted-foreground">Strip Dimensions & Text Size</Label>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Strip Height</span>
                    <span className="font-mono">{stripHeight}%</span>
                  </div>
                  <Slider
                    min={8}
                    max={20}
                    step={1}
                    value={[stripHeight]}
                    onValueChange={(val) => setStripHeight(val[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Font Size Scale</span>
                    <span className="font-mono">{fontSize}px</span>
                  </div>
                  <Slider
                    min={12}
                    max={28}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(val) => setFontSize(val[0])}
                  />
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={!selectedFile || isProcessing}
                onClick={handleProcess}
                className="w-full text-base font-semibold shadow-md"
              >
                {isProcessing ? "Adding Name & Date..." : "Generate Photo with Name & Date"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Upload & Result */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Photo & Final Preview</CardTitle>
              <CardDescription>Select passport photograph to add bottom info bar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ImageUpload
                onImageSelect={handleSelect}
                onImageRemove={handleRemove}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                label="Upload Passport Photo"
                description="Upload clean photograph without existing text"
              />

              {isProcessing && (
                <div className="p-8 text-center space-y-3 border rounded-xl bg-muted/20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="font-semibold text-sm">Rendering White Strip & Candidate Text...</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {processedResult && (
                <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-sm">Ready to Download</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {processedResult.width} × {processedResult.height} px • {formatFileSize(processedResult.fileSize)}
                    </span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30 p-2 flex items-center justify-center max-h-[320px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={processedResult.dataUrl}
                      alt="Photo with Name and Date"
                      className="max-h-[300px] max-w-full object-contain rounded shadow-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleDownload}
                      className="flex-1 bg-primary text-primary-foreground font-semibold gap-2 shadow-md"
                    >
                      <Download className="w-5 h-5" /> Download Final Photo
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={handleRemove}>
                      <RotateCcw className="w-4 h-4 mr-1" /> New
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines */}
          <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> SSC & Govt DOP Requirements
            </h4>
            <p>
              According to Staff Selection Commission (SSC) guidelines, photographs must clearly mention the date on which
              the photograph was taken (DOP) printed at the bottom of the photograph. Applications with photos without date
              or with dates older than 3 months are liable to be rejected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
