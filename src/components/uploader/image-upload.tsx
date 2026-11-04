"use client";

import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, X, AlertCircle, FileCheck } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { validateImageFile } from "@/lib/validation/image-validator";
import { Button } from "@/components/ui/button";

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  selectedFile: File | null;
  previewUrl: string | null;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
  showDetails?: boolean;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedFile,
  previewUrl,
  accept = "image/jpeg,image/png,image/webp,image/jpg",
  maxSizeMB = 10,
  label = "Upload Image",
  description = "Drag & drop JPG, PNG, or WEBP (Max 10 MB)",
  className,
  showDetails = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file format or size.");
      return;
    }
    onImageSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        id="image-file-input"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            "flex flex-col items-center justify-center min-h-[220px] group",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <p className="font-semibold text-foreground text-base mb-1">{label}</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">{description}</p>
          <Button type="button" variant="outline" size="sm" className="pointer-events-none">
            Browse File
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4 bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="font-medium text-sm truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || "image"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {previewUrl && (
            <div className="relative rounded-lg overflow-hidden border border-border/60 bg-muted/30 flex items-center justify-center max-h-72 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-64 object-contain rounded"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
