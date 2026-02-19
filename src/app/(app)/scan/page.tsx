"use client";

import { useState, useCallback } from "react";
import { Camera, Receipt, Refrigerator, UtensilsCrossed } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CameraCapture } from "@/components/scan/CameraCapture";
import { ReceiptScanner } from "@/components/scan/ReceiptScanner";
import { FridgeAnalyzer } from "@/components/scan/FridgeAnalyzer";
import {
  RecognitionResults,
  type RecognizedItem,
} from "@/components/scan/RecognitionResults";
import { PlateAnalyzer } from "@/components/scan/PlateAnalyzer";
import { PlateRecognitionResults } from "@/components/scan/PlateRecognitionResults";
import type { RecognizedPlateItem } from "@/types/recognition";

type ScanMode = "receipt" | "fridge" | "plate";
type ScanState = "capture" | "processing" | "results";

export default function ScanPage() {
  const [mode, setMode] = useState<ScanMode>("plate");
  const [scanState, setScanState] = useState<ScanState>("capture");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  const [plateItems, setPlateItems] = useState<RecognizedPlateItem[]>([]);

  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setScanState("processing");
  }, []);

  const handleScanComplete = useCallback((items: RecognizedItem[]) => {
    setRecognizedItems(items);
    setScanState("results");
  }, []);

  const handlePlateComplete = useCallback((items: RecognizedPlateItem[]) => {
    setPlateItems(items);
    setScanState("results");
  }, []);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setRecognizedItems([]);
    setPlateItems([]);
    setScanState("capture");
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      setMode(value as ScanMode);
      if (scanState !== "capture") {
        handleReset();
      }
    },
    [scanState, handleReset]
  );

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Smart Scan</h1>
          <p className="text-sm text-muted-foreground">
            Scan your plate, receipts, or fridge
          </p>
        </div>
      </div>

      {/* Mode tabs */}
      <Tabs value={mode} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="plate" className="flex-1 gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Plate
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex-1 gap-2">
            <Receipt className="h-4 w-4" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="fridge" className="flex-1 gap-2">
            <Refrigerator className="h-4 w-4" />
            Fridge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plate" className="mt-4">
          {scanState === "capture" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-3 text-center text-sm text-muted-foreground">
                  Take a photo of your plate and AI will estimate calories and
                  macros for each food item
                </p>
                <CameraCapture onCapture={handleCapture} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="receipt" className="mt-4">
          {scanState === "capture" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-3 text-center text-sm text-muted-foreground">
                  Take a photo of your grocery receipt to quickly add items to
                  your pantry
                </p>
                <CameraCapture onCapture={handleCapture} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fridge" className="mt-4">
          {scanState === "capture" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-3 text-center text-sm text-muted-foreground">
                  Take a photo of your fridge and AI will identify the foods
                  inside
                </p>
                <CameraCapture onCapture={handleCapture} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Processing state */}
      {scanState === "processing" && capturedImage && (
        <div className="mb-6">
          {mode === "plate" ? (
            <PlateAnalyzer
              imageSrc={capturedImage}
              onComplete={handlePlateComplete}
            />
          ) : mode === "receipt" ? (
            <ReceiptScanner
              imageSrc={capturedImage}
              onComplete={handleScanComplete}
            />
          ) : (
            <FridgeAnalyzer
              imageSrc={capturedImage}
              onComplete={handleScanComplete}
            />
          )}
        </div>
      )}

      {/* Results */}
      {scanState === "results" && mode === "plate" && plateItems.length > 0 && (
        <PlateRecognitionResults items={plateItems} onReset={handleReset} />
      )}

      {scanState === "results" &&
        mode !== "plate" &&
        recognizedItems.length > 0 && (
          <RecognitionResults items={recognizedItems} onReset={handleReset} />
        )}
    </PageContainer>
  );
}
