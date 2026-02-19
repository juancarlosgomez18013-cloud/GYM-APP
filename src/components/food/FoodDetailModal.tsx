"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Plus,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { usePantryStore } from "@/stores/pantry-store";
import type { FoodItem } from "@/types/food";
import type { MealType } from "@/types/meal";

interface FoodDetailModalProps {
  food: FoodItem | null;
  open: boolean;
  onClose: () => void;
}

const MEAL_TYPES: { value: MealType; label: string; icon: React.ReactNode }[] = [
  { value: "breakfast", label: "Breakfast", icon: <span>🌅</span> },
  { value: "lunch", label: "Lunch", icon: <span>☀️</span> },
  { value: "dinner", label: "Dinner", icon: <span>🌙</span> },
  { value: "snack", label: "Snack", icon: <span>🍎</span> },
];

function NutrientRow({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">
        {Math.round(value * 10) / 10}
        {unit}
      </span>
    </div>
  );
}

export function FoodDetailModal({ food, open, onClose }: FoodDetailModalProps) {
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);
  const addPantryItem = usePantryStore((s) => s.addItem);

  const [servings, setServings] = useState("1");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [addedToMeal, setAddedToMeal] = useState(false);
  const [addedToPantry, setAddedToPantry] = useState(false);

  if (!food) return null;

  const servingCount = parseFloat(servings) || 1;
  const multiplier = servingCount;

  const scaledNutrients = {
    calories: food.nutrients.calories * multiplier,
    protein: food.nutrients.protein * multiplier,
    carbohydrates: food.nutrients.carbohydrates * multiplier,
    fat: food.nutrients.fat * multiplier,
    fiber: (food.nutrients.fiber ?? 0) * multiplier,
    sugar: (food.nutrients.sugar ?? 0) * multiplier,
  };

  const handleAddToMeal = () => {
    const today = new Date().toISOString().split("T")[0];
    addMealEntry(today, {
      id: nanoid(),
      foodItem: food,
      quantity: food.servingSize * servingCount,
      mealType,
      timestamp: new Date().toISOString(),
    });
    setAddedToMeal(true);
    setTimeout(() => setAddedToMeal(false), 2000);
  };

  const handleAddToPantry = () => {
    addPantryItem({
      id: nanoid(),
      name: food.name,
      category: "other",
      quantity: servingCount,
      unit: food.servingSizeUnit,
      nutrients: food.nutrients,
      addedAt: new Date().toISOString(),
    });
    setAddedToPantry(true);
    setTimeout(() => setAddedToPantry(false), 2000);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      // Reset state after close animation
      setTimeout(() => {
        setServings("1");
        setAddedToMeal(false);
        setAddedToPantry(false);
      }, 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-left">{food.name}</SheetTitle>
          <SheetDescription className="text-left">
            {food.brand && <span>{food.brand} &middot; </span>}
            {food.servingDescription ||
              `${food.servingSize} ${food.servingSizeUnit}`}{" "}
            per serving
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          {/* Calorie highlight */}
          <div className="flex items-center justify-center rounded-xl bg-primary/10 py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {Math.round(scaledNutrients.calories)}
              </p>
              <p className="text-xs text-muted-foreground">
                calories {servingCount !== 1 ? `(${servingCount} servings)` : "per serving"}
              </p>
            </div>
          </div>

          {/* Nutrient breakdown */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Nutrition Facts
            </h4>
            <div className="divide-y divide-border">
              <NutrientRow
                label="Protein"
                value={scaledNutrients.protein}
                unit="g"
                icon={<Beef className="h-4 w-4" />}
                color="text-blue-400"
              />
              <NutrientRow
                label="Carbohydrates"
                value={scaledNutrients.carbohydrates}
                unit="g"
                icon={<Wheat className="h-4 w-4" />}
                color="text-amber-400"
              />
              <NutrientRow
                label="Fat"
                value={scaledNutrients.fat}
                unit="g"
                icon={<Droplets className="h-4 w-4" />}
                color="text-red-400"
              />
              {food.nutrients.fiber !== undefined && (
                <NutrientRow
                  label="Fiber"
                  value={scaledNutrients.fiber}
                  unit="g"
                  icon={<Wheat className="h-4 w-4" />}
                  color="text-green-400"
                />
              )}
              {food.nutrients.sugar !== undefined && (
                <NutrientRow
                  label="Sugar"
                  value={scaledNutrients.sugar}
                  unit="g"
                  icon={<Flame className="h-4 w-4" />}
                  color="text-pink-400"
                />
              )}
            </div>
          </div>

          {/* Serving size controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="servings">Number of servings</Label>
              <Input
                id="servings"
                type="number"
                min="0.25"
                step="0.25"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="meal-type">Meal type</Label>
              <Select
                value={mealType}
                onValueChange={(v) => setMealType(v as MealType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((mt) => (
                    <SelectItem key={mt.value} value={mt.value}>
                      <span className="flex items-center gap-2">
                        {mt.icon}
                        {mt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleAddToMeal}
              disabled={addedToMeal}
            >
              {addedToMeal ? (
                "Added to Today's Meals!"
              ) : (
                <>
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  Add to Today&apos;s Meals
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddToPantry}
              disabled={addedToPantry}
            >
              {addedToPantry ? (
                "Added to Pantry!"
              ) : (
                <>
                  <ShoppingBasket className="mr-2 h-4 w-4" />
                  Add to Pantry
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
