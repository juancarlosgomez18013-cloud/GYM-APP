"use client";

import type { MealEntry } from "@/types/meal";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MealCardProps {
  entry: MealEntry;
  onDelete: (id: string) => void;
}

export function MealCard({ entry, onDelete }: MealCardProps) {
  const multiplier = entry.quantity / entry.foodItem.servingSize;
  const calories = Math.round(entry.foodItem.nutrients.calories * multiplier);
  const protein = Math.round(entry.foodItem.nutrients.protein * multiplier);
  const carbs = Math.round(
    entry.foodItem.nutrients.carbohydrates * multiplier
  );
  const fat = Math.round(entry.foodItem.nutrients.fat * multiplier);

  return (
    <Card className="gap-0 py-3">
      <CardContent className="flex items-center gap-3 px-4 py-0">
        {/* Food info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-medium text-foreground">
              {entry.foodItem.name}
            </h4>
            {entry.foodItem.brand && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {entry.foodItem.brand}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {entry.quantity}
            {entry.foodItem.servingSizeUnit}
            {entry.foodItem.servingDescription
              ? ` (${entry.foodItem.servingDescription})`
              : ""}
          </p>

          {/* Mini macro bars */}
          <div className="mt-2 flex items-center gap-3 text-[11px]">
            <span className="font-semibold text-foreground">
              {calories} kcal
            </span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
              <span className="text-muted-foreground">P {protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
              <span className="text-muted-foreground">C {carbs}g</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#f43f5e]" />
              <span className="text-muted-foreground">F {fat}g</span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(entry.id)}
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${entry.foodItem.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
