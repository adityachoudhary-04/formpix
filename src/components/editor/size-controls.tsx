"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SizeControlsProps {
  minKB: number;
  maxKB: number;
  format: string;
  onMinKBChange: (val: number) => void;
  onMaxKBChange: (val: number) => void;
  onFormatChange: (format: string) => void;
  className?: string;
}

export function SizeControls({
  minKB,
  maxKB,
  format,
  onMinKBChange,
  onMaxKBChange,
  onFormatChange,
  className,
}: SizeControlsProps) {
  const sizePresets = [
    { label: "10 – 20 KB", min: 10, max: 20 },
    { label: "20 – 50 KB", min: 20, max: 50 },
    { label: "50 – 100 KB", min: 50, max: 100 },
    { label: "100 – 200 KB", min: 100, max: 200 },
  ];

  const hasWarning = minKB > 0 && maxKB > 0 && minKB > maxKB;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">File Size Target (KB)</Label>
        <span className="text-xs text-muted-foreground">Optional range</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Min Size (KB)</Label>
          <Input
            type="number"
            min={0}
            step={5}
            placeholder="e.g. 20"
            value={minKB || ""}
            onChange={(e) => onMinKBChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Max Size (KB)</Label>
          <Input
            type="number"
            min={0}
            step={5}
            placeholder="e.g. 50"
            value={maxKB || ""}
            onChange={(e) => onMaxKBChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </div>
      </div>

      {hasWarning && (
        <p className="text-xs text-destructive font-medium">
          Min KB cannot exceed Max KB.
        </p>
      )}

      {/* Quick Size Presets */}
      <div className="space-y-1.5 pt-1">
        <Label className="text-xs text-muted-foreground">Quick File Size Presets</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {sizePresets.map((sp) => (
            <button
              key={sp.label}
              type="button"
              onClick={() => {
                onMinKBChange(sp.min);
                onMaxKBChange(sp.max);
              }}
              className="text-xs border border-border/80 rounded-md py-1.5 px-2 hover:bg-muted text-left transition-colors font-mono"
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output Format Selector */}
      <div className="space-y-1.5 pt-1">
        <Label className="text-xs text-muted-foreground">Output Format</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "JPG / JPEG", value: "image/jpeg" },
            { label: "PNG", value: "image/png" },
            { label: "WEBP", value: "image/webp" },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFormatChange(f.value)}
              className={cn(
                "text-xs py-2 px-3 rounded-md border font-medium transition-colors text-center",
                format === f.value
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border hover:bg-muted text-muted-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
