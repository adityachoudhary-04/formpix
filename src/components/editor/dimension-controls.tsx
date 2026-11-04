"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DimensionControlsProps {
  width: number;
  height: number;
  unit: "px" | "cm" | "mm";
  dpi: number;
  lockAspectRatio?: boolean;
  onWidthChange: (val: number) => void;
  onHeightChange: (val: number) => void;
  onUnitChange: (unit: "px" | "cm" | "mm") => void;
  onDpiChange: (dpi: number) => void;
  onLockAspectRatioChange?: (lock: boolean) => void;
  className?: string;
}

export function DimensionControls({
  width,
  height,
  unit,
  dpi,
  lockAspectRatio = false,
  onWidthChange,
  onHeightChange,
  onUnitChange,
  onDpiChange,
  onLockAspectRatioChange,
  className,
}: DimensionControlsProps) {
  const presets = [
    { label: "140 × 60 px", w: 140, h: 60, u: "px" as const },
    { label: "200 × 230 px", w: 200, h: 230, u: "px" as const },
    { label: "350 × 450 px", w: 350, h: 450, u: "px" as const },
    { label: "3.5 × 4.5 cm", w: 3.5, h: 4.5, u: "cm" as const },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Dimensions</Label>
        {onLockAspectRatioChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onLockAspectRatioChange(!lockAspectRatio)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
          >
            {lockAspectRatio ? (
              <span className="flex items-center gap-1 text-primary">
                <Lock className="w-3.5 h-3.5" /> Ratio Locked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> Ratio Free
              </span>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Width</Label>
          <Input
            type="number"
            step={unit === "px" ? 1 : 0.1}
            min={1}
            value={width || ""}
            onChange={(e) => onWidthChange(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Height</Label>
          <Input
            type="number"
            step={unit === "px" ? 1 : 0.1}
            min={1}
            value={height || ""}
            onChange={(e) => onHeightChange(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Unit</Label>
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value as "px" | "cm" | "mm")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="px">Pixels (px)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="mm">Millimeters (mm)</option>
          </select>
        </div>
      </div>

      {unit !== "px" && (
        <div className="space-y-1 bg-muted/40 p-3 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">DPI (Resolution)</Label>
            <span className="text-xs text-muted-foreground">{dpi} DPI</span>
          </div>
          <div className="flex gap-2">
            {[150, 200, 300].map((d) => (
              <Button
                key={d}
                type="button"
                variant={dpi === d ? "default" : "outline"}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => onDpiChange(d)}
              >
                {d} DPI
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Dimension Quick Presets */}
      <div className="space-y-1.5 pt-1">
        <Label className="text-xs text-muted-foreground">Quick Dimension Presets</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                onUnitChange(p.u);
                onWidthChange(p.w);
                onHeightChange(p.h);
              }}
              className="text-xs border border-border/80 rounded-md py-1.5 px-2 hover:bg-muted text-left transition-colors font-mono"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
