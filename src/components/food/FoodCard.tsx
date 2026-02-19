"use client";

import { Card } from "@/components/ui/card";
import type { FoodItem } from "@/types/food";

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
}

export function FoodCard({ food, onSelect }: FoodCardProps) {
  return (
    <Card
      className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-accent/50 active:bg-accent"
      onClick={() => onSelect(food)}
    >
      {/* Calorie circle */}
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-primary/10">
        <span className="text-sm font-bold text-primary">
          {Math.round(food.nutrients.calories)}
        </span>
        <span className="text-[8px] text-primary/70">kcal</span>
      </div>

      {/* Food info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{food.name}</p>
        {food.brand && (
          <p className="truncate text-xs text-muted-foreground">{food.brand}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {food.servingDescription || `${food.servingSize} ${food.servingSizeUnit}`}
        </p>
      </div>

      {/* Macro indicators */}
      <div className="flex shrink-0 gap-2">
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-blue-400">
            {Math.round(food.nutrients.protein)}g
          </span>
          <span className="text-[9px] text-muted-foreground">P</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-amber-400">
            {Math.round(food.nutrients.carbohydrates)}g
          </span>
          <span className="text-[9px] text-muted-foreground">C</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-red-400">
            {Math.round(food.nutrients.fat)}g
          </span>
          <span className="text-[9px] text-muted-foreground">F</span>
        </div>
      </div>
    </Card>
  );
}
