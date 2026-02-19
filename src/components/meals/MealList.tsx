"use client";

import type { MealEntry, MealType } from "@/types/meal";
import { MealCard } from "./MealCard";
import { Coffee, Sun, Sunset, Cookie, UtensilsCrossed } from "lucide-react";

interface MealListProps {
  meals: MealEntry[];
  onDeleteMeal: (id: string) => void;
}

interface MealGroup {
  type: MealType;
  label: string;
  icon: React.ReactNode;
  entries: MealEntry[];
}

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const MEAL_META: Record<
  MealType,
  { label: string; icon: React.ReactNode }
> = {
  breakfast: { label: "Breakfast", icon: <Coffee className="size-4" /> },
  lunch: { label: "Lunch", icon: <Sun className="size-4" /> },
  dinner: { label: "Dinner", icon: <Sunset className="size-4" /> },
  snack: { label: "Snack", icon: <Cookie className="size-4" /> },
};

export function MealList({ meals, onDeleteMeal }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <UtensilsCrossed className="mb-3 size-10 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">
          No meals logged yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Tap the + button to add your first meal
        </p>
      </div>
    );
  }

  // Group meals by type
  const grouped: MealGroup[] = MEAL_ORDER.map((type) => ({
    type,
    label: MEAL_META[type].label,
    icon: MEAL_META[type].icon,
    entries: meals.filter((m) => m.mealType === type),
  })).filter((group) => group.entries.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => (
        <div key={group.type}>
          {/* Section header */}
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            {group.icon}
            <h3 className="text-sm font-semibold">{group.label}</h3>
            <span className="text-xs">
              ({group.entries.length}{" "}
              {group.entries.length === 1 ? "item" : "items"})
            </span>
          </div>

          {/* Meal cards */}
          <div className="space-y-2">
            {group.entries.map((entry) => (
              <MealCard
                key={entry.id}
                entry={entry}
                onDelete={onDeleteMeal}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
