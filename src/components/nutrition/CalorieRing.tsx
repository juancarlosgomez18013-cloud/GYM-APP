"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export function CalorieRing({ consumed, target }: CalorieRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const rawPercent = target > 0 ? consumed / target : 0;
  const clampedPercent = Math.min(rawPercent, 1.2); // Allow up to 120% visual
  const remaining = Math.max(target - consumed, 0);

  // Determine color based on percentage
  const getColor = (percent: number): string => {
    if (percent > 1) return "hsl(0, 75%, 55%)"; // Red: over 100%
    if (percent >= 0.8) return "hsl(45, 90%, 55%)"; // Yellow: 80-100%
    return "hsl(142, 70%, 45%)"; // Green: under 80%
  };

  const strokeColor = getColor(rawPercent);

  useEffect(() => {
    // Animate progress on mount
    const timeout = setTimeout(() => {
      setAnimatedProgress(clampedPercent);
    }, 100);
    return () => clearTimeout(timeout);
  }, [clampedPercent]);

  const dashOffset = circumference * (1 - animatedProgress);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">
          {remaining > 0 ? remaining.toLocaleString() : 0}
        </span>
        <span className="text-xs text-muted-foreground">remaining</span>
        <div className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {Math.round(consumed).toLocaleString()}
          </span>
          {" / "}
          {target.toLocaleString()} kcal
        </div>
      </div>

      {/* Accessibility */}
      <span className="sr-only">
        {Math.round(consumed)} of {target} calories consumed.{" "}
        {remaining} calories remaining.
      </span>
    </div>
  );
}
