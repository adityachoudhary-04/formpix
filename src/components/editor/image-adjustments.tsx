"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageAdjustmentsProps {
  brightness: number;
  contrast: number;
  quality: number;
  onBrightnessChange: (v: number) => void;
  onContrastChange: (v: number) => void;
  onQualityChange: (v: number) => void;
  onReset: () => void;
  className?: string;
  hideQuality?: boolean;
}

export function ImageAdjustments({
  brightness,
  contrast,
  quality,
  onBrightnessChange,
  onContrastChange,
  onQualityChange,
  onReset,
  className,
  hideQuality = false,
}: ImageAdjustmentsProps) {
  const hasChanges = brightness !== 0 || contrast !== 0 || quality !== 90;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-semibold">Image Adjustments</Label>
        </div>
        {hasChanges && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        )}
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Brightness</span>
          <span className="font-mono">{brightness > 0 ? `+${brightness}` : brightness}</span>
        </div>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[brightness]}
          onValueChange={(val) => onBrightnessChange(val[0])}
        />
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Contrast</span>
          <span className="font-mono">{contrast > 0 ? `+${contrast}` : contrast}</span>
        </div>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[contrast]}
          onValueChange={(val) => onContrastChange(val[0])}
        />
      </div>

      {/* Quality */}
      {!hideQuality && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Output Quality</span>
            <span className="font-mono">{quality}%</span>
          </div>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(val) => onQualityChange(val[0])}
          />
        </div>
      )}
    </div>
  );
}

