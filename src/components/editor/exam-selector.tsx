"use client";

import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  examPresets,
  examCategories,
  type ExamPreset,
  type ExamDocument,
  type DocumentType,
} from "@/data/exam-presets";
import { cn } from "@/lib/utils";

export interface ExamSelectorProps {
  selectedExamId: string | null;
  selectedDocType: DocumentType;
  onSelectExam: (exam: ExamPreset | null, doc: ExamDocument | null) => void;
  className?: string;
  allowedDocTypes?: DocumentType[];
}

export function ExamSelector({
  selectedExamId,
  selectedDocType,
  onSelectExam,
  className,
  allowedDocTypes,
}: ExamSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredExams = useMemo(() => {
    return examPresets.filter((exam) => {
      const matchesSearch =
        search.trim() === "" ||
        exam.examName.toLowerCase().includes(search.toLowerCase()) ||
        exam.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || exam.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  const currentExam = useMemo(() => {
    return examPresets.find((e) => e.examId === selectedExamId) || null;
  }, [selectedExamId]);

  const availableDocs = useMemo(() => {
    if (!currentExam) return [];
    if (!allowedDocTypes) return currentExam.documents;
    return currentExam.documents.filter((d) => allowedDocTypes.includes(d.documentType));
  }, [currentExam, allowedDocTypes]);

  const handleExamClick = (exam: ExamPreset) => {
    const defaultDoc =
      exam.documents.find((d) =>
        allowedDocTypes ? allowedDocTypes.includes(d.documentType) : d.documentType === selectedDocType
      ) || exam.documents[0];
    onSelectExam(exam, defaultDoc || null);
  };

  const handleDocTypeChange = (doc: ExamDocument) => {
    if (currentExam) {
      onSelectExam(currentExam, doc);
    }
  };

  const handleCustomMode = () => {
    onSelectExam(null, null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Select Exam Preset</Label>
        {selectedExamId ? (
          <button
            type="button"
            onClick={handleCustomMode}
            className="text-xs text-primary hover:underline font-medium"
          >
            Switch to Custom
          </button>
        ) : (
          <Badge variant="outline" className="text-xs font-normal">
            Custom Mode
          </Badge>
        )}
      </div>

      {/* Selected Exam Display */}
      {currentExam && (
        <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-foreground">{currentExam.examName}</p>
              <p className="text-xs text-muted-foreground capitalize">Category: {currentExam.category}</p>
            </div>
            {currentExam.verified ? (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-[10px] h-5 gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] h-5 gap-1 shrink-0 text-amber-600 border-amber-200">
                <AlertTriangle className="w-3 h-3" /> Sample Preset
              </Badge>
            )}
          </div>

          {/* Document Type Selector within the exam */}
          {availableDocs.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground block mb-1.5 font-medium">Document Type:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableDocs.map((doc) => {
                  const isSelected = doc.documentType === selectedDocType;
                  return (
                    <button
                      key={doc.documentType}
                      type="button"
                      onClick={() => handleDocTypeChange(doc)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-md border transition-colors capitalize",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-background border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {doc.documentType} ({doc.width}×{doc.height} {doc.unit}, {doc.minKB}-{doc.maxKB} KB)
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground italic pt-1">
            * Please verify current dimensions and size requirements with the latest official exam notification.
          </p>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search exam (e.g. UPSC, SSC CGL, IBPS, NEET)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-2.5 py-1 rounded-full shrink-0 border transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-background border-border hover:bg-muted text-muted-foreground"
            )}
          >
            All
          </button>
          {examCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-2.5 py-1 rounded-full shrink-0 border transition-colors",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-background border-border hover:bg-muted text-muted-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exam List Dropdown/Scroll Area */}
      <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border/60 bg-background text-sm">
        <button
          type="button"
          onClick={handleCustomMode}
          className={cn(
            "w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center justify-between",
            !selectedExamId && "bg-primary/5 font-semibold text-primary"
          )}
        >
          <span>Custom Settings (Manual input)</span>
          {!selectedExamId && <Check className="w-4 h-4 text-primary" />}
        </button>

        {filteredExams.map((exam) => {
          const isSelected = exam.examId === selectedExamId;
          return (
            <button
              key={exam.examId}
              type="button"
              onClick={() => handleExamClick(exam)}
              className={cn(
                "w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center justify-between text-xs",
                isSelected && "bg-primary/5 font-medium text-primary"
              )}
            >
              <div className="truncate pr-2">
                <span className="font-medium text-foreground block truncate">{exam.examName}</span>
                <span className="text-[11px] text-muted-foreground capitalize">{exam.category}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          );
        })}

        {filteredExams.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No exam presets found matching &quot;{search}&quot;. You can use Custom Mode to set any dimensions.
          </div>
        )}
      </div>
    </div>
  );
}
