"use client";

import { useEffect, useState } from "react";
import { Refrigerator, Loader2, Sparkles } from "lucide-react";

export interface RecognizedItem {
  name: string;
  confidence: number;
  category: string;
  estimatedQuantity?: string;
}

interface FridgeAnalyzerProps {
  imageSrc: string;
  onComplete: (items: RecognizedItem[]) => void;
}

const MOCK_FRIDGE_ITEMS: RecognizedItem[] = [
  { name: "Milk", confidence: 0.93, category: "dairy", estimatedQuantity: "1 gallon" },
  { name: "Cheddar Cheese", confidence: 0.87, category: "dairy", estimatedQuantity: "8 oz" },
  { name: "Lettuce", confidence: 0.82, category: "vegetables", estimatedQuantity: "1 head" },
  { name: "Tomatoes", confidence: 0.79, category: "vegetables", estimatedQuantity: "4 ct" },
  { name: "Chicken Thighs", confidence: 0.85, category: "proteins", estimatedQuantity: "2 lb" },
  { name: "Orange Juice", confidence: 0.91, category: "beverages", estimatedQuantity: "64 oz" },
  { name: "Bell Peppers", confidence: 0.74, category: "vegetables", estimatedQuantity: "3 ct" },
  { name: "Butter", confidence: 0.88, category: "dairy", estimatedQuantity: "1 stick" },
  { name: "Carrots", confidence: 0.65, category: "vegetables", estimatedQuantity: "1 bag" },
  { name: "Ground Turkey", confidence: 0.48, category: "proteins", estimatedQuantity: "1 lb" },
  { name: "Blueberries", confidence: 0.76, category: "fruits", estimatedQuantity: "6 oz" },
];

export function FridgeAnalyzer({ imageSrc, onComplete }: FridgeAnalyzerProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"uploading" | "analyzing" | "complete">("uploading");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(25);
      setStatus("analyzing");
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(55);
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgress(85);
    }, 2200);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStatus("complete");
      onComplete(MOCK_FRIDGE_ITEMS);
    }, 3000);

    return () => {
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
            <Refrigerator className="h-8 w-8 text-primary" />
            <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-yellow-400" />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="font-medium text-foreground">
          {status === "uploading"
            ? "Preparing image..."
            : "Identifying foods with AI..."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {status === "uploading"
            ? "Optimizing image for analysis"
            : "AI is recognizing items in your fridge"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground/70">
        In production, this uses Claude AI vision for food recognition
      </p>
    </div>
  );
}
