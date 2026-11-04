"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, GraduationCap, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examPresets, examCategories, type ExamPreset } from "@/data/exam-presets";

export default function ExamsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered = useMemo(() => {
    return examPresets.filter((e) => {
      const matchSearch =
        search === "" ||
        e.examName.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "all" || e.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left border-b pb-6 border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Government Exam Directory</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Exam Photo & Signature Specifications Directory
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Browse verified and sample photo and signature dimension requirements for 40+ Indian competitive exams
          including UPSC, SSC, Banking, Railways, State PSCs, Police, and Entrance examinations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search exam (e.g. UPSC, SSC CGL, SBI PO, NEET)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <Button
            type="button"
            variant={selectedCat === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCat("all")}
            className="h-8 text-xs shrink-0"
          >
            All Categories
          </Button>
          {examCategories.map((c) => (
            <Button
              key={c.id}
              type="button"
              variant={selectedCat === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCat(c.id)}
              className="h-8 text-xs shrink-0"
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exam) => (
          <Card key={exam.examId} className="hover:border-primary/50 transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[11px] capitalize">
                  {exam.category.replace("-", " ")}
                </Badge>
                {exam.verified ? (
                  <Badge className="bg-emerald-600 text-[10px] h-5 gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] h-5 text-amber-600 border-amber-200">
                    Sample Data
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base line-clamp-1">{exam.examName}</CardTitle>
              <CardDescription className="text-xs">
                {exam.documents.map((d) => d.documentType).join(" • ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-1.5 text-xs border-t pt-3 border-border">
                {exam.documents.map((doc) => (
                  <div key={doc.documentType} className="flex justify-between text-muted-foreground">
                    <span className="capitalize font-medium text-foreground">{doc.documentType}:</span>
                    <span>
                      {doc.width}×{doc.height} {doc.unit} ({doc.minKB}-{doc.maxKB} KB)
                    </span>
                  </div>
                ))}
              </div>

              <Link href={`/exams/${exam.examId}`} className="block">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 group">
                  View Specifications & Resize
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground space-y-2">
            <p className="font-semibold">No examinations found matching your search.</p>
            <p className="text-xs">
              You can always use our custom Photo Resizer or Signature Resizer to enter any dimensions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

