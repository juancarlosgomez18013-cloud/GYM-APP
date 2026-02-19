"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export function MacroProgressBar({
  label,
  current,
  target,
  unit = "g",
  color,
}: MacroProgressBarProps) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {Math.round(current)}
          </span>
          {" / "}
          {target}
          {unit}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
