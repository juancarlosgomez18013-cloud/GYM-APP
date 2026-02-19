"use client";

import { useEffect, useState } from "react";
import { useFastingStore } from "@/stores/fasting-store";
import { cn } from "@/lib/utils";

interface FastingTimerProps {
  size?: number;
  className?: string;
}

export function FastingTimer({ size = 200, className }: FastingTimerProps) {
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);
  const currentSession = useFastingStore((s) => s.currentSession);
  const [timeData, setTimeData] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  if (!currentSession || !timeData) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No active fast</p>
          <p className="text-sm text-muted-foreground/70">Start a fast to begin tracking</p>
        </div>
      </div>
    );
  }

  const { hours, minutes, seconds, phase, totalSeconds, totalPhaseDuration } =
    timeData;

  const elapsed = totalPhaseDuration - totalSeconds;
  const progress = totalPhaseDuration > 0 ? elapsed / totalPhaseDuration : 0;

  const center = size / 2;
  const strokeWidth = 8;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const isFasting = phase === "fasting";
  const ringColor = isFasting ? "stroke-amber-400" : "stroke-green-400";
  const textColor = isFasting ? "text-amber-400" : "text-green-400";

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(ringColor, "transition-all duration-1000 ease-linear")}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={cn("text-3xl font-bold tabular-nums", textColor)}>
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {isFasting ? "Fasting" : "Eating Window"}
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          {isFasting ? "until eating window" : "until next fast"}
        </p>
      </div>
    </div>
  );
}
