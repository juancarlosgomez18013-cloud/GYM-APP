"use client";

import { useEffect, useState } from "react";
import { Receipt, Loader2 } from "lucide-react";

export interface RecognizedItem {
  name: string;
  confidence: number;
  category: string;
  estimatedQuantity?: string;
}

interface ReceiptScannerProps {
  imageSrc: string;
  onComplete: (items: RecognizedItem[]) => void;
}

const MOCK_RECEIPT_ITEMS: RecognizedItem[] = [
  { name: "Chicken Breast", confidence: 0.95, category: "proteins", estimatedQuantity: "1 lb" },
  { name: "Brown Rice", confidence: 0.92, category: "grains", estimatedQuantity: "2 lb" },
  { name: "Broccoli", confidence: 0.88, category: "vegetables", estimatedQuantity: "1 bunch" },
  { name: "Greek Yogurt", confidence: 0.91, category: "dairy", estimatedQuantity: "32 oz" },
  { name: "Eggs", confidence: 0.97, category: "proteins", estimatedQuantity: "12 ct" },
  { name: "Sweet Potatoes", confidence: 0.72, category: "vegetables", estimatedQuantity: "3 lb" },
  { name: "Olive Oil", confidence: 0.85, category: "condiments", estimatedQuantity: "16 oz" },
  { name: "Bananas", confidence: 0.68, category: "fruits", estimatedQuantity: "1 bunch" },
  { name: "Almonds", confidence: 0.55, category: "snacks", estimatedQuantity: "8 oz" },
  { name: "Salmon Fillet", confidence: 0.78, category: "proteins", estimatedQuantity: "1 lb" },
];

export function ReceiptScanner({ imageSrc, onComplete }: ReceiptScannerProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"scanning" | "processing" | "complete">("scanning");

  useEffect(() => {
    // Simulate OCR scanning process
    const timer1 = setTimeout(() => {
      setProgress(30);
      setStatus("processing");
    }, 800);

    const timer2 = setTimeout(() => {
      setProgress(65);
    }, 1600);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatus("complete");
      onComplete(MOCK_RECEIPT_ITEMS);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [imageSrc, onComplete]);

  if (status === "complete") {
    return null; // Results are handled by RecognitionResults
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {status === "scanning" ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Receipt className="h-8 w-8 text-primary" />
        )}
      </div>

      <div className="text-center">
        <p className="font-medium text-foreground">
          {status === "scanning" ? "Scanning receipt..." : "Processing text..."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {status === "scanning"
            ? "Using OCR to extract text from your receipt"
            : "Matching items to our food database"}
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
        In production, this uses Tesseract.js for on-device OCR processing
      </p>
    </div>
  );
}
