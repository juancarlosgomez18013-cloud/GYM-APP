"use client";

import { cn } from "@/lib/utils";

interface FastingTimelineProps {
  fastingHours: number;
  eatingHours: number;
  elapsedHours: number;
  phase: "fasting" | "eating" | "idle";
  className?: string;
}

export function FastingTimeline({
  fastingHours,
  eatingHours,
  elapsedHours,
  phase,
  className,
}: FastingTimelineProps) {
  const totalHours = fastingHours + eatingHours;
  const fastingPercent = (fastingHours / totalHours) * 100;
  const currentPercent = Math.min((elapsedHours / totalHours) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {/* Labels */}
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>Start</span>
        <span>{fastingHours}h fasting</span>
        <span>{eatingHours}h eating</span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted/30">
        {/* Fasting segment */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-amber-400/30"
          style={{ width: `${fastingPercent}%` }}
        />

        {/* Eating segment */}
        <div
          className="absolute inset-y-0 rounded-r-full bg-green-400/30"
          style={{
            left: `${fastingPercent}%`,
            width: `${100 - fastingPercent}%`,
          }}
        />

        {/* Progress fill */}
        {phase !== "idle" && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-1000",
              currentPercent <= fastingPercent
                ? "bg-amber-400/60"
                : "bg-gradient-to-r from-amber-400/60 to-green-400/60"
            )}
            style={{ width: `${currentPercent}%` }}
          />
        )}

        {/* Current position indicator */}
        {phase !== "idle" && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-5 w-1.5 rounded-full bg-foreground shadow-sm transition-all duration-1000"
            style={{ left: `calc(${currentPercent}% - 3px)` }}
          />
        )}

        {/* Divider between fasting and eating */}
        <div
          className="absolute inset-y-0 w-0.5 bg-border"
          style={{ left: `${fastingPercent}%` }}
        />
      </div>

      {/* Time labels */}
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/70">
        <span>0h</span>
        <span>{fastingHours}h</span>
        <span>{totalHours}h</span>
      </div>
    </div>
  );
}
