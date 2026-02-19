"use client";

import { useState } from "react";
import type { MealType } from "@/types/meal";
import type { PlannedMeal } from "@/types/plan";
import { cn } from "@/lib/utils";
import {
  Coffee,
  UtensilsCrossed,
  Moon,
  Cookie,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MEAL_TYPE_CONFIG: Record<
  MealType,
  { label: string; icon: typeof Coffee; color: string }
> = {
  breakfast: {
    label: "Breakfast",
    icon: Coffee,
    color: "text-amber-400",
  },
  lunch: {
    label: "Lunch",
    icon: UtensilsCrossed,
    color: "text-green-400",
  },
  dinner: {
    label: "Dinner",
    icon: Moon,
    color: "text-blue-400",
  },
  snack: {
    label: "Snack",
    icon: Cookie,
    color: "text-purple-400",
  },
};

interface MealSlotProps {
  meal: PlannedMeal | null;
  mealType: MealType;
}

export function MealSlot({ meal, mealType }: MealSlotProps) {
  const [expanded, setExpanded] = useState(false);
  const config = MEAL_TYPE_CONFIG[mealType];
  const Icon = config.icon;

  const totalCalories =
    meal?.entries.reduce((sum, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      return sum + entry.foodItem.nutrients.calories * multiplier;
    }, 0) ?? 0;

  const totalProtein =
    meal?.entries.reduce((sum, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      return sum + entry.foodItem.nutrients.protein * multiplier;
    }, 0) ?? 0;

  const totalCarbs =
    meal?.entries.reduce((sum, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      return sum + entry.foodItem.nutrients.carbohydrates * multiplier;
    }, 0) ?? 0;

  const totalFat =
    meal?.entries.reduce((sum, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      return sum + entry.foodItem.nutrients.fat * multiplier;
    }, 0) ?? 0;

  if (!meal || meal.entries.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-border/50 p-2 opacity-50">
        <Icon className={cn("h-4 w-4", config.color)} />
        <span className="text-xs text-muted-foreground">{config.label}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          No meal planned
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 bg-background/50">
      <button
        type="button"
        className="flex w-full items-center gap-2 p-2"
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={cn("h-4 w-4 shrink-0", config.color)} />
        <div className="flex flex-1 flex-col items-start text-left">
          <span className="text-xs font-medium">{config.label}</span>
          <span className="text-[10px] text-muted-foreground line-clamp-1">
            {meal.entries.map((e) => e.foodItem.name).join(", ")}
          </span>
        </div>
        <span className="text-xs font-semibold text-primary">
          {Math.round(totalCalories)} cal
        </span>
        {expanded ? (
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border/30 px-2 pb-2 pt-1">
          {meal.entries.map((entry) => {
            const multiplier = entry.quantity / entry.foodItem.servingSize;
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between py-1 text-[11px]"
              >
                <span className="text-muted-foreground">
                  {entry.foodItem.name}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(entry.foodItem.nutrients.calories * multiplier)}{" "}
                  cal
                </span>
              </div>
            );
          })}
          <div className="mt-1 flex gap-3 border-t border-border/20 pt-1 text-[10px] text-muted-foreground">
            <span>P: {Math.round(totalProtein)}g</span>
            <span>C: {Math.round(totalCarbs)}g</span>
            <span>F: {Math.round(totalFat)}g</span>
          </div>
        </div>
      )}
    </div>
  );
}
