"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue" | "type"> {
  min?: number
  max?: number
  step?: number
  value?: number | number[]
  defaultValue?: number | number[]
  onChange?: (value: number) => void
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const rawVal = Array.isArray(value) ? value[0] : value
    const rawDefault = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue

    const currentVal = rawVal !== undefined ? rawVal : (rawDefault !== undefined ? rawDefault : min)
    const percentage = ((currentVal - min) / (max - min || 1)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value)
      onChange?.(num)
      onValueChange?.([num])
    }

    return (
      <div className="relative flex items-center w-full touch-none select-none">
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={currentVal}
          onChange={handleChange}
          className={cn(
            "w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors",
            "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-sm",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%, hsl(var(--secondary)) 100%)`,
          }}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
