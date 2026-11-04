import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Camera,
  PenTool,
  Fingerprint,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examPresets, getExamBySlug } from "@/data/exam-presets";

interface ExamPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return examPresets.map((exam) => ({
    slug: exam.examId,
  }));
}

export default async function SingleExamPage({ params }: ExamPageProps) {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Breadcrumb & Badges */}
      <div className="space-y-4 border-b pb-6 border-border">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/exams" className="hover:text-primary">
            Exams Directory
          </Link>
          <span>/</span>
          <span className="capitalize">{exam.category.replace("-", " ")}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{exam.examName}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{exam.examName}</h1>
              {exam.verified ? (
                <Badge className="bg-emerald-600 text-xs gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs text-amber-600 border-amber-200">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Sample Data
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize">Category: {exam.category.replace("-", " ")}</p>
          </div>

          {exam.sourceURL && (
            <a
              href={exam.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
            >
              Official Exam Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div className="space-y-1">
          <p className="font-semibold">Notice regarding examination specifications:</p>
          <p>
            Exam guidelines (such as dimensions, file size limits, or Date of Photo requirements) can change between
            recruitment cycles. Always double-check with the latest official notification before submitting your
            application.
          </p>
        </div>
      </div>

      {/* Document Requirements Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Prescribed Document Requirements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exam.documents.map((doc) => {
            const isPhoto = doc.documentType === "photo";
            const isSig = doc.documentType === "signature";
            const Icon = isPhoto ? Camera : isSig ? PenTool : Fingerprint;
            const targetUrl = isPhoto
              ? `/photo-resizer`
              : isSig
              ? `/signature-resizer`
              : `/photo-resizer`;

            return (
              <Card key={doc.documentType} className="border-border">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base capitalize">{doc.documentType} Specifications</CardTitle>
                  <CardDescription className="text-xs">Required upload parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs space-y-2 border-t pt-3 border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-mono font-medium">
                        {doc.width} × {doc.height} {doc.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-mono font-medium">
                        {doc.minKB} KB – {doc.maxKB} KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-mono font-medium uppercase">{doc.format}</span>
                    </div>
                    {doc.dpi && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolution:</span>
                        <span className="font-mono font-medium">{doc.dpi} DPI</span>
                      </div>
                    )}
                  </div>

                  <Link href={targetUrl} className="block">
                    <Button className="w-full text-xs font-semibold gap-1.5 shadow-sm">
                      Resize {doc.documentType} Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
