"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  UtensilsCrossed,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDailyLogStore } from "@/stores/daily-log-store";
import type { RecognizedPlateItem } from "@/types/recognition";
import type { FoodItem } from "@/types/food";
import type { MealType } from "@/types/meal";

interface PlateRecognitionResultsProps {
  items: RecognizedPlateItem[];
  onReset: () => void;
}

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  if (confidence >= 0.8) {
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />;
  }
  if (confidence >= 0.5) {
    return <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />;
  }
  return <XCircle className="h-4 w-4 shrink-0 text-red-500" />;
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.5) return "Medium";
  return "Low";
}

function confidenceBadgeVariant(
  confidence: number
): "default" | "secondary" | "destructive" {
  if (confidence >= 0.8) return "default";
  if (confidence >= 0.5) return "secondary";
  return "destructive";
}

function plateItemToFoodItem(item: RecognizedPlateItem): FoodItem {
  return {
    id: nanoid(),
    name: item.name,
    source: "ai_recognized",
    nutrients: {
      calories: item.nutrients.calories,
      protein: item.nutrients.protein,
      carbohydrates: item.nutrients.carbohydrates,
      fat: item.nutrients.fat,
    },
    servingSize: item.estimatedServingSizeG,
    servingSizeUnit: "g",
    servingDescription: item.estimatedQuantity,
    foodCategory: item.category,
  };
}

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

function getDefaultMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export function PlateRecognitionResults({
  items,
  onReset,
}: PlateRecognitionResultsProps) {
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [mealType, setMealType] = useState<MealType>(getDefaultMealType());
  const [servingSizes, setServingSizes] = useState<Record<number, number>>(
    () => {
      const initial: Record<number, number> = {};
      items.forEach((item, i) => {
        initial[i] = item.estimatedServingSizeG;
      });
      return initial;
    }
  );

  const today = new Date().toISOString().split("T")[0];

  const getScaledNutrients = (index: number) => {
    const item = items[index];
    const originalG = item.estimatedServingSizeG;
    const currentG = servingSizes[index] ?? originalG;
    const ratio = currentG / originalG;
    return {
      calories: Math.round(item.nutrients.calories * ratio),
      protein: Math.round(item.nutrients.protein * ratio * 10) / 10,
      carbohydrates:
        Math.round(item.nutrients.carbohydrates * ratio * 10) / 10,
      fat: Math.round(item.nutrients.fat * ratio * 10) / 10,
    };
  };

  const handleAddItem = (index: number) => {
    const item = items[index];
    const foodItem = plateItemToFoodItem(item);
    const currentServingG = servingSizes[index] ?? item.estimatedServingSizeG;

    addMealEntry(today, {
      id: nanoid(),
      foodItem,
      quantity: currentServingG,
      mealType,
      timestamp: new Date().toISOString(),
    });

    setAddedItems((prev) => new Set(prev).add(index));
  };

  const handleAddAll = () => {
    items.forEach((_, index) => {
      if (!addedItems.has(index)) {
        handleAddItem(index);
      }
    });
  };

  const handleServingSizeChange = (index: number, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setServingSizes((prev) => ({ ...prev, [index]: num }));
    }
  };

  const allAdded = items.every((_, i) => addedItems.has(i));

  const totalNutrients = items.reduce(
    (acc, _, i) => {
      const scaled = getScaledNutrients(i);
      return {
        calories: acc.calories + scaled.calories,
        protein: acc.protein + scaled.protein,
        carbohydrates: acc.carbohydrates + scaled.carbohydrates,
        fat: acc.fat + scaled.fat,
      };
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Plate Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""} identified
          </p>
        </div>
        <Select
          value={mealType}
          onValueChange={(v) => setMealType(v as MealType)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEAL_TYPES.map((mt) => (
              <SelectItem key={mt.value} value={mt.value}>
                {mt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Total summary */}
      <Card className="bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {Math.round(totalNutrients.calories)}
            </span>
            <span className="text-sm text-muted-foreground">kcal total</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-blue-400">
              <Beef className="h-3 w-3" />
              {Math.round(totalNutrients.protein)}g
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Wheat className="h-3 w-3" />
              {Math.round(totalNutrients.carbohydrates)}g
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <Droplets className="h-3 w-3" />
              {Math.round(totalNutrients.fat)}g
            </span>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Nutrition estimates from AI vision are approximate. For precise
          tracking, verify with food labels or the food database.
        </p>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const isAdded = addedItems.has(index);
          const scaled = getScaledNutrients(index);

          return (
            <Card key={`${item.name}-${index}`} className="p-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex flex-col items-center gap-1">
                  <ConfidenceIndicator confidence={item.confidence} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-sm text-foreground">
                      {item.name}
                    </p>
                    <Badge
                      variant={confidenceBadgeVariant(item.nutritionConfidence)}
                      className="shrink-0 text-[10px] px-1.5 py-0"
                    >
                      {confidenceLabel(item.nutritionConfidence)} est.
                    </Badge>
                  </div>

                  {/* Macros row */}
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    <span className="font-semibold text-primary">
                      {scaled.calories} kcal
                    </span>
                    <span className="text-blue-400">P: {scaled.protein}g</span>
                    <span className="text-amber-400">
                      C: {scaled.carbohydrates}g
                    </span>
                    <span className="text-red-400">F: {scaled.fat}g</span>
                  </div>

                  {/* Serving size editor */}
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      step="10"
                      className="h-7 w-20 text-xs"
                      value={servingSizes[index] ?? item.estimatedServingSizeG}
                      onChange={(e) =>
                        handleServingSizeChange(index, e.target.value)
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      g ({item.estimatedQuantity})
                    </span>
                  </div>
                </div>

                <Button
                  variant={isAdded ? "secondary" : "outline"}
                  size="sm"
                  className="shrink-0 mt-1"
                  disabled={isAdded}
                  onClick={() => handleAddItem(index)}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1 h-3 w-3" />
                      Log
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleAddAll}
          disabled={allAdded}
        >
          {allAdded ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              All Items Logged
            </>
          ) : (
            <>
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Log All to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </>
          )}
        </Button>
        <Button variant="outline" className="w-full" onClick={onReset}>
          Scan Another Plate
        </Button>
      </div>
    </div>
  );
}
