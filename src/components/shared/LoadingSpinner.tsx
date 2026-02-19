"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = 24,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-2", className)}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <Loader2 className="animate-spin text-primary" size={size} />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
