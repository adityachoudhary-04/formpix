"use client";

import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, RefreshCw, Crop } from "lucide-react";

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCropperProps {
  imageUrl: string;
  aspectRatio?: number;
  onCropChange?: (data: CropData) => void;
  className?: string;
}

export function ImageCropper({
  imageUrl,
  aspectRatio,
  onCropChange,
  className,
}: ImageCropperProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && onCropChange) {
      const data = cropper.getData(true); // rounded integer data
      onCropChange({
        x: Math.max(0, data.x),
        y: Math.max(0, data.y),
        width: Math.max(1, data.width),
        height: Math.max(1, data.height),
      });
    }
  };

  const rotate = (degree: number) => {
    cropperRef.current?.cropper.rotate(degree);
    handleCrop();
  };

  const zoom = (ratio: number) => {
    cropperRef.current?.cropper.zoom(ratio);
    handleCrop();
  };

  const reset = () => {
    cropperRef.current?.cropper.reset();
    handleCrop();
  };

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
          <Crop className="w-3.5 h-3.5 text-primary" /> Crop & Adjust View
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => rotate(-90)}
            title="Rotate Left 90°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => rotate(90)}
            title="Rotate Right 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => zoom(0.1)}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => zoom(-0.1)}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={reset}
            title="Reset Crop"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border bg-black/5 dark:bg-black/20 max-h-[380px] flex items-center justify-center">
        <Cropper
          src={imageUrl}
          style={{ height: 350, width: "100%" }}
          initialAspectRatio={aspectRatio}
          aspectRatio={aspectRatio}
          guides={true}
          ref={cropperRef}
          viewMode={1}
          autoCropArea={0.9}
          background={false}
          responsive={true}
          checkOrientation={false}
          crop={handleCrop}
        />
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        Drag edges to crop. Use toolbar above to zoom and rotate.
      </p>
    </div>
  );
}
