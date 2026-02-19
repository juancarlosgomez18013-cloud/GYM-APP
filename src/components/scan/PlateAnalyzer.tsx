"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Loader2, Sparkles } from "lucide-react";
import { recognizePlateFromImage } from "@/lib/api/claude";
import type { RecognizedPlateItem } from "@/types/recognition";

interface PlateAnalyzerProps {
  imageSrc: string;
  onComplete: (items: RecognizedPlateItem[]) => void;
}

export function PlateAnalyzer({ imageSrc, onComplete }: PlateAnalyzerProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"uploading" | "analyzing" | "complete">(
    "uploading"
  );

  useEffect(() => {
    let cancelled = false;

    setProgress(15);

    const timer1 = setTimeout(() => {
      if (!cancelled) {
        setProgress(30);
        setStatus("analyzing");
      }
    }, 800);

    recognizePlateFromImage(imageSrc)
      .then((items) => {
        if (!cancelled) {
          setProgress(100);
          setStatus("complete");
          onComplete(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProgress(100);
          setStatus("complete");
          onComplete([]);
        }
      });

    // Fake intermediate progress updates
    const timer2 = setTimeout(() => {
      if (!cancelled) setProgress(50);
    }, 2000);
    const timer3 = setTimeout(() => {
      if (!cancelled) setProgress(70);
    }, 4000);
    const timer4 = setTimeout(() => {
      if (!cancelled) setProgress(85);
    }, 6000);

    return () => {
      cancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [imageSrc, onComplete]);

  if (status === "complete") {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {status === "uploading" ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <div className="relative">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-yellow-400" />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="font-medium text-foreground">
          {status === "uploading"
            ? "Preparing image..."
            : "Analyzing your plate with AI..."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {status === "uploading"
            ? "Optimizing image for analysis"
            : "Identifying foods and estimating nutrition"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
