"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePantryStore } from "@/stores/pantry-store";
import type { PantryCategory } from "@/types/pantry";

export interface RecognizedItem {
  name: string;
  confidence: number;
  category: string;
  estimatedQuantity?: string;
}

interface RecognitionResultsProps {
  items: RecognizedItem[];
  onReset: () => void;
}

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  if (confidence >= 0.8) {
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />;
  }
  if (confidence >= 0.5) {
    return <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />;
  }
  return <XCircle className="h-5 w-5 shrink-0 text-red-500" />;
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.5) return "Medium";
  return "Low";
}

function confidenceBadgeVariant(
  confidence: number
): "default" | "secondary" | "destructive" | "outline" {
  if (confidence >= 0.8) return "default";
  if (confidence >= 0.5) return "secondary";
  return "destructive";
}

function mapCategory(category: string): PantryCategory {
  const mapping: Record<string, PantryCategory> = {
    proteins: "proteins",
    dairy: "dairy",
    grains: "grains",
    fruits: "fruits",
    vegetables: "vegetables",
    snacks: "snacks",
    beverages: "beverages",
    condiments: "condiments",
    frozen: "frozen",
    supplements: "supplements",
  };
  return mapping[category.toLowerCase()] ?? "other";
}

function parseQuantity(estimatedQuantity?: string): { quantity: number; unit: string } {
  if (!estimatedQuantity) return { quantity: 1, unit: "unit" };

  const match = estimatedQuantity.match(/^([\d.]+)\s*(.+)$/);
  if (match) {
    return { quantity: parseFloat(match[1]), unit: match[2].trim() };
  }
  return { quantity: 1, unit: estimatedQuantity };
}

export function RecognitionResults({ items, onReset }: RecognitionResultsProps) {
  const addItem = usePantryStore((s) => s.addItem);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddItem = (item: RecognizedItem) => {
    const { quantity, unit } = parseQuantity(item.estimatedQuantity);

    addItem({
      id: nanoid(),
      name: item.name,
      category: mapCategory(item.category),
      quantity,
      unit,
      addedAt: new Date().toISOString(),
    });

    setAddedItems((prev) => new Set(prev).add(item.name));
  };

  const handleAddAll = () => {
    items.forEach((item) => {
      if (!addedItems.has(item.name)) {
        handleAddItem(item);
      }
    });
  };

  const allAdded = items.every((item) => addedItems.has(item.name));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recognized Items
          </h3>
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleAddAll}
          disabled={allAdded}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          {allAdded ? "All Added" : "Add All"}
        </Button>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isAdded = addedItems.has(item.name);

          return (
            <Card
              key={item.name}
              className="flex items-center gap-3 p-3"
            >
              <ConfidenceIndicator confidence={item.confidence} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-sm text-foreground">
                    {item.name}
                  </p>
                  <Badge
                    variant={confidenceBadgeVariant(item.confidence)}
                    className="shrink-0 text-[10px] px-1.5 py-0"
                  >
                    {confidenceLabel(item.confidence)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground capitalize">
                    {item.category}
                  </span>
                  {item.estimatedQuantity && (
                    <>
                      <span className="text-xs text-muted-foreground/50">
                        &middot;
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.estimatedQuantity}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Button
                variant={isAdded ? "secondary" : "outline"}
                size="sm"
                className="shrink-0"
                disabled={isAdded}
                onClick={() => handleAddItem(item)}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <Button variant="outline" className="w-full" onClick={onReset}>
        Scan Another
      </Button>
    </div>
  );
}
