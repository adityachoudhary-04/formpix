"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Camera,
  PenTool,
  Minimize2,
  FileSignature,
  CalendarPlus,
  ScanFace,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ImageUpload } from "@/components/uploader/image-upload";
import { ImageCropper } from "@/components/editor/image-cropper";
import { DimensionControls } from "@/components/editor/dimension-controls";
import { SizeControls } from "@/components/editor/size-controls";
import { ImageAdjustments } from "@/components/editor/image-adjustments";
import { ExamSelector } from "@/components/editor/exam-selector";
import { ProcessingResult } from "@/components/editor/processing-result";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { examCategories, examPresets } from "@/data/exam-presets";

export default function HomePage() {
  const processor = useImageProcessor("photo");
  const [showCropper, setShowCropper] = useState(false);

  const tools = [
    {
      title: "Photo Resizer",
      description: "Resize and crop passport photos to exact dimensions (px, cm, mm) and file size requirements.",
      icon: Camera,
      href: "/photo-resizer",
      badge: "Popular",
    },
    {
      title: "Signature Resizer",
      description: "Clean signature background, enhance ink strokes, and resize to required KB limits.",
      icon: PenTool,
      href: "/signature-resizer",
      badge: "Specialized",
    },
    {
      title: "Image Compressor",
      description: "Compress photos to exact KB limits (e.g., 20KB-50KB) with iterative binary quality search.",
      icon: Minimize2,
      href: "/image-compressor",
      badge: "Smart",
    },
    {
      title: "Signature Compressor",
      description: "Preserve handwriting line clarity while dramatically reducing file size below 20KB.",
      icon: FileSignature,
      href: "/signature-compressor",
      badge: "Optimized",
    },
    {
      title: "Add Name & Date",
      description: "Add an official white name & date strip to passport photos as required by UPSC, SSC & state exams.",
      icon: CalendarPlus,
      href: "/add-name-date",
      badge: "Mandatory for SSC/UPSC",
    },
    {
      title: "Face Coverage Guide",
      description: "Visual passport-photo composition guides to ensure proper 70-80% face coverage & eye level.",
      icon: ScanFace,
      href: "/face-coverage",
      badge: "Guidance",
    },
  ];

  const faqs = [
    {
      q: "Are my photos or signatures uploaded to any server?",
      a: "No! All image processing, cropping, resizing, and compression happen 100% locally in your web browser using HTML5 Canvas and Web APIs. Your personal images never leave your computer or phone.",
    },
    {
      q: "Why do government exam portals reject uploaded photos?",
      a: "Most exam portals (like SSC, UPSC, IBPS, NTA) enforce strict limits on exact pixel dimensions (e.g. 350x450 px), file size ranges (e.g. 20 KB to 50 KB), format (JPG/JPEG), and background color. If any of these differ even slightly, the upload is automatically rejected. Our tool guarantees compliance with both dimensions and size constraints.",
    },
    {
      q: "How does the file size compression work without losing quality?",
      a: "Our smart compression engine uses a binary search algorithm to test multiple compression quality steps in milliseconds. It discovers the highest possible visual clarity that still stays inside your target KB range.",
    },
    {
      q: "How do I add Name and Date of Photo (DOP) on my photo?",
      a: "Use our 'Add Name & Date' tool! Upload your photo, enter your name and the date when the photo was taken, and our tool renders a crisp, proportional white strip at the bottom of the photo as required by exam notifications.",
    },
    {
      q: "Can I use this tool on my mobile phone?",
      a: "Yes! SarkariPhoto is fully responsive and works smoothly on Android, iPhone, tablets, and desktop computers without installing any app.",
    },
    {
      q: "Is SarkariPhoto completely free?",
      a: "Yes, it is 100% free with no registration, no watermarks, no ads blocking your work, and no daily limits.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container max-w-6xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Fast, 100% Client-Side Exam Document Preparation</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Resize Photos & Signatures for <span className="text-primary">Government Exams</span> — Instantly & Free
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Perfect dimensions, exact KB size limits, and instant background cleanup for UPSC, SSC, Banking, Railway,
            and State exams. All processed securely inside your browser.
          </p>

          {/* Privacy & Free Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              100% Private — Zero Server Uploads
            </span>
            <span className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-full shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Browser Processing
            </span>
            <span className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-full shadow-sm">
              <Lock className="w-4 h-4 text-blue-500" />
              Free Forever — No Sign-Up
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/photo-resizer">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 gap-2">
                <Camera className="w-5 h-5" /> Resize Photo Now
              </Button>
            </Link>
            <Link href="/signature-resizer">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                <PenTool className="w-5 h-5" /> Resize Signature
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio Section */}
      <section className="py-12 bg-background border-b border-border" id="quick-resizer">
        <div className="container max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quick Exam Photo & Signature Studio</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Select an exam preset or enter custom dimensions. Upload your image, adjust crop, and download immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Configuration Controls */}
            <div className="lg:col-span-5 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">1. Configure Requirements</CardTitle>
                  <CardDescription>Select an exam or set custom width, height & KB</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Exam Preset Selector */}
                  <ExamSelector
                    selectedExamId={processor.selectedExamId}
                    selectedDocType={processor.selectedDocType}
                    onSelectExam={(exam, doc) => processor.applyExamPreset(exam, doc)}
                  />

                  {/* Dimension Controls */}
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

                  {/* File Size Controls */}
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
                    <span className="text-xs text-muted-foreground font-medium">Fit Mode</span>
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
                        Fit (Letterbox)
                      </Button>
                    </div>
                  </div>

                  {/* Primary Trigger Button */}
                  <Button
                    type="button"
                    size="lg"
                    disabled={!processor.selectedFile || processor.isProcessing}
                    onClick={processor.processImage}
                    className="w-full text-base font-semibold shadow-md"
                  >
                    {processor.isProcessing ? "Processing..." : "Process & Optimize Image"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Upload & Live Result */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">2. Upload & Preview</CardTitle>
                      <CardDescription>Drag and drop or select your photo</CardDescription>
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
                  />

                  {/* Optional Interactive Cropper */}
                  {processor.previewUrl && showCropper && (
                    <div className="border border-border p-4 rounded-xl bg-card">
                      <ImageCropper
                        imageUrl={processor.previewUrl}
                        aspectRatio={processor.width && processor.height ? processor.width / processor.height : undefined}
                        onCropChange={processor.setCropData}
                      />
                    </div>
                  )}

                  {/* Processing Result Component */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Tools Showcase Grid */}
      <section className="py-16 bg-muted/30 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dedicated Tools for Every Exam Requirement</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Choose the specific tool tailored to your exact document type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.title} className="group hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {t.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link
                      href={t.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      Open Tool <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Exams Directory Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Supported Exam Presets</h2>
              <p className="text-sm text-muted-foreground">
                One-click presets with predefined dimensions and size limits for India&apos;s biggest competitive exams.
              </p>
            </div>
            <Link href="/exams">
              <Button variant="outline" className="gap-2">
                Browse All 40+ Exams <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {examCategories.map((cat) => {
              const count = examPresets.filter((e) => e.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/exams?category=${cat.id}`}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/40 transition-all text-center space-y-1 block group"
                >
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{count} Exams Available</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works in 3 Simple Steps</h2>
            <p className="text-sm text-muted-foreground">No complicated software or Photoshop skills required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-bold text-base">Select Exam or Size</h3>
              <p className="text-xs text-muted-foreground">
                Choose your target exam from our presets or specify custom dimensions (px/cm/mm) and KB limits.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-bold text-base">Upload & Adjust</h3>
              <p className="text-xs text-muted-foreground">
                Drag and drop your photo or signature. Crop to face, adjust brightness, or clean ink backgrounds.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-bold text-base">Instant Download</h3>
              <p className="text-xs text-muted-foreground">
                Verify the exact byte size and dimensions, then download your ready-to-upload file with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Everything You Need to Know</h2>
          </div>

          <Accordion type="single" className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-sm font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SEO & Educational Content */}
      <section className="py-14 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 prose dark:prose-invert text-xs md:text-sm text-muted-foreground space-y-4">
          <h3 className="text-base md:text-lg font-bold text-foreground">
            Complete Online Photo & Signature Resizer for Indian Government Exams
          </h3>
          <p>
            Applying for government jobs in India (Sarkari Naukri) through recruitment commissions such as UPSC (Union
            Public Service Commission), SSC (Staff Selection Commission), IBPS, SBI, Railway Recruitment Boards (RRB),
            State Public Service Commissions (UPPSC, BPSC, MPPSC, RPSC, etc.), and National Testing Agency (NTA for JEE
            and NEET) requires strict adherence to prescribed photograph and signature formats.
          </p>
          <p>
            Standard digital camera or smartphone photos often exceed 3MB to 8MB in file size with dimensions exceeding
            3000 pixels. Submitting non-compliant documents causes immediate application rejection during online form
            submission. <strong>SarkariPhoto</strong> provides an all-in-one, privacy-focused utility to crop, resize,
            clean, and compress exam photos and signatures to the exact width, height, and kilobyte specifications
            without ever uploading your sensitive files to a remote server.
          </p>
        </div>
      </section>
    </div>
  );
}
