"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

function getStreakTier(streak: number) {
  if (streak >= 30) return { color: "text-amber-400", bg: "bg-amber-400/10", label: "gold", glow: true };
  if (streak >= 7) return { color: "text-orange-400", bg: "bg-orange-400/10", label: "orange", glow: false };
  if (streak >= 1) return { color: "text-red-400", bg: "bg-red-400/10", label: "small", glow: false };
  return { color: "text-muted-foreground", bg: "bg-muted/30", label: "none", glow: false };
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  const tier = getStreakTier(streak);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        tier.bg,
        tier.glow && "shadow-[0_0_12px_rgba(251,191,36,0.3)]",
        className
      )}
    >
      <Flame
        className={cn(
          "h-4 w-4",
          tier.color,
          streak > 0 && "animate-pulse"
        )}
      />
      <span className={cn("text-sm font-semibold", tier.color)}>
        {streak}
      </span>
      <span className="text-xs text-muted-foreground">
        {streak === 1 ? "day" : "days"}
      </span>
    </div>
  );
}
