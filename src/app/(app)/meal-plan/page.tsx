"use client";

import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  RefreshCw,
  Globe,
  Utensils,
  Loader2,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WeeklyPlanGrid } from "@/components/plan/WeeklyPlanGrid";
import { useMealPlanStore } from "@/stores/meal-plan-store";
import { useUserStore } from "@/stores/user-store";
import type { MealPlan, MealPlanDay, PlannedMeal } from "@/types/plan";
import type { MealType, MealEntry } from "@/types/meal";
import type { FoodItem, MacroNutrients } from "@/types/food";

// ─── Sample recipe data for plan generation ───────────────────
const SAMPLE_FOODS: Record<MealType, FoodItem[]> = {
  breakfast: [
    {
      id: "bf-1",
      name: "Oatmeal with Berries",
      source: "manual",
      nutrients: { calories: 350, protein: 12, carbohydrates: 55, fat: 8 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "breakfast",
    },
    {
      id: "bf-2",
      name: "Greek Yogurt Parfait",
      source: "manual",
      nutrients: { calories: 280, protein: 20, carbohydrates: 35, fat: 7 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "breakfast",
    },
    {
      id: "bf-3",
      name: "Scrambled Eggs with Toast",
      source: "manual",
      nutrients: { calories: 400, protein: 25, carbohydrates: 30, fat: 20 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "breakfast",
    },
    {
      id: "bf-4",
      name: "Protein Smoothie Bowl",
      source: "manual",
      nutrients: { calories: 320, protein: 28, carbohydrates: 40, fat: 6 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "breakfast",
    },
    {
      id: "bf-5",
      name: "Avocado Toast with Egg",
      source: "manual",
      nutrients: { calories: 380, protein: 18, carbohydrates: 28, fat: 22 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "breakfast",
    },
    {
      id: "bf-6",
      name: "Banana Pancakes",
      source: "manual",
      nutrients: { calories: 340, protein: 14, carbohydrates: 48, fat: 10 },
      servingSize: 1,
      servingSizeUnit: "stack",
      foodCategory: "breakfast",
    },
  ],
  lunch: [
    {
      id: "ln-1",
      name: "Grilled Chicken Salad",
      source: "manual",
      nutrients: { calories: 450, protein: 40, carbohydrates: 20, fat: 22 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "lunch",
    },
    {
      id: "ln-2",
      name: "Quinoa Buddha Bowl",
      source: "manual",
      nutrients: { calories: 480, protein: 22, carbohydrates: 60, fat: 16 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "lunch",
    },
    {
      id: "ln-3",
      name: "Turkey Wrap with Veggies",
      source: "manual",
      nutrients: { calories: 420, protein: 32, carbohydrates: 38, fat: 14 },
      servingSize: 1,
      servingSizeUnit: "wrap",
      foodCategory: "lunch",
    },
    {
      id: "ln-4",
      name: "Salmon Poke Bowl",
      source: "manual",
      nutrients: { calories: 520, protein: 35, carbohydrates: 50, fat: 18 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "lunch",
    },
    {
      id: "ln-5",
      name: "Lentil Soup with Bread",
      source: "manual",
      nutrients: { calories: 380, protein: 20, carbohydrates: 52, fat: 8 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "lunch",
    },
    {
      id: "ln-6",
      name: "Chicken Burrito Bowl",
      source: "manual",
      nutrients: { calories: 550, protein: 38, carbohydrates: 55, fat: 18 },
      servingSize: 1,
      servingSizeUnit: "bowl",
      foodCategory: "lunch",
    },
  ],
  dinner: [
    {
      id: "dn-1",
      name: "Grilled Salmon with Veggies",
      source: "manual",
      nutrients: { calories: 520, protein: 42, carbohydrates: 18, fat: 28 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
    {
      id: "dn-2",
      name: "Chicken Stir-Fry with Rice",
      source: "manual",
      nutrients: { calories: 480, protein: 35, carbohydrates: 50, fat: 14 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
    {
      id: "dn-3",
      name: "Lean Beef Tacos",
      source: "manual",
      nutrients: { calories: 500, protein: 38, carbohydrates: 35, fat: 22 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
    {
      id: "dn-4",
      name: "Baked Cod with Potatoes",
      source: "manual",
      nutrients: { calories: 420, protein: 36, carbohydrates: 40, fat: 10 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
    {
      id: "dn-5",
      name: "Turkey Meatballs with Pasta",
      source: "manual",
      nutrients: { calories: 540, protein: 34, carbohydrates: 58, fat: 16 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
    {
      id: "dn-6",
      name: "Shrimp and Vegetable Curry",
      source: "manual",
      nutrients: { calories: 460, protein: 30, carbohydrates: 42, fat: 18 },
      servingSize: 1,
      servingSizeUnit: "plate",
      foodCategory: "dinner",
    },
  ],
  snack: [
    {
      id: "sn-1",
      name: "Protein Bar",
      source: "manual",
      nutrients: { calories: 200, protein: 20, carbohydrates: 22, fat: 7 },
      servingSize: 1,
      servingSizeUnit: "bar",
      foodCategory: "snack",
    },
    {
      id: "sn-2",
      name: "Mixed Nuts & Dried Fruit",
      source: "manual",
      nutrients: { calories: 180, protein: 6, carbohydrates: 16, fat: 12 },
      servingSize: 1,
      servingSizeUnit: "handful",
      foodCategory: "snack",
    },
    {
      id: "sn-3",
      name: "Apple with Peanut Butter",
      source: "manual",
      nutrients: { calories: 250, protein: 8, carbohydrates: 30, fat: 14 },
      servingSize: 1,
      servingSizeUnit: "serving",
      foodCategory: "snack",
    },
    {
      id: "sn-4",
      name: "Cottage Cheese with Fruit",
      source: "manual",
      nutrients: { calories: 160, protein: 18, carbohydrates: 12, fat: 4 },
      servingSize: 1,
      servingSizeUnit: "cup",
      foodCategory: "snack",
    },
    {
      id: "sn-5",
      name: "Rice Cakes with Hummus",
      source: "manual",
      nutrients: { calories: 150, protein: 5, carbohydrates: 22, fat: 5 },
      servingSize: 1,
      servingSizeUnit: "serving",
      foodCategory: "snack",
    },
    {
      id: "sn-6",
      name: "Greek Yogurt with Honey",
      source: "manual",
      nutrients: { calories: 170, protein: 15, carbohydrates: 20, fat: 4 },
      servingSize: 1,
      servingSizeUnit: "cup",
      foodCategory: "snack",
    },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDayPlan(dayOfWeek: number): MealPlanDay {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const meals: PlannedMeal[] = mealTypes.map((mealType) => {
    const food = pickRandom(SAMPLE_FOODS[mealType]);
    const entry: MealEntry = {
      id: nanoid(),
      foodItem: food,
      quantity: food.servingSize,
      mealType,
      timestamp: new Date().toISOString(),
    };
    return {
      mealType,
      entries: [entry],
    };
  });

  const totalMacros: MacroNutrients = meals.reduce(
    (acc, meal) => {
      meal.entries.forEach((entry) => {
        const mult = entry.quantity / entry.foodItem.servingSize;
        acc.calories += entry.foodItem.nutrients.calories * mult;
        acc.protein += entry.foodItem.nutrients.protein * mult;
        acc.carbohydrates += entry.foodItem.nutrients.carbohydrates * mult;
        acc.fat += entry.foodItem.nutrients.fat * mult;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );

  return { dayOfWeek, meals, totalMacros };
}

function generateWeekPlan(): MealPlan {
  const days: MealPlanDay[] = Array.from({ length: 7 }).map((_, i) => {
    // Monday=1 through Sunday=0
    const dayOfWeek = i === 6 ? 0 : i + 1;
    return generateDayPlan(dayOfWeek);
  });

  return {
    id: nanoid(),
    name: "Weekly Meal Plan",
    description: "Auto-generated weekly meal plan",
    days,
    targetDailyMacros: {
      calories: 2000,
      protein: 150,
      carbohydrates: 200,
      fat: 70,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

type ViewMode = "my-cuisine" | "explore";

export default function MealPlanPage() {
  const { currentPlan, setPlan } = useMealPlanStore();
  const profile = useUserStore((s) => s.profile);
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("my-cuisine");
  const [isGenerating, setIsGenerating] = useState(false);

  const now = new Date();
  const currentWeekStart = startOfWeek(addWeeks(now, weekOffset), {
    weekStartsOn: 1,
  });
  const weekLabel = `${format(currentWeekStart, "MMM d")} - ${format(
    addDays(currentWeekStart, 6),
    "MMM d, yyyy"
  )}`;

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Simulate async generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const plan = generateWeekPlan();
    if (profile) {
      const { calculateMacroTargets } = await import("@/lib/nutrition");
      const targets = calculateMacroTargets(profile);
      plan.targetDailyMacros = {
        calories: targets.calories,
        protein: targets.protein,
        carbohydrates: targets.carbohydrates,
        fat: targets.fat,
      };
    }
    setPlan(plan);
    setIsGenerating(false);
  }, [setPlan, profile]);

  const handleRegenerateDay = useCallback(
    (dateStr: string) => {
      if (!currentPlan) return;
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      const newDay = generateDayPlan(dayOfWeek);
      const updatedDays = currentPlan.days.map((d) =>
        d.dayOfWeek === dayOfWeek ? newDay : d
      );
      setPlan({
        ...currentPlan,
        days: updatedDays,
        updatedAt: new Date().toISOString(),
      });
    },
    [currentPlan, setPlan]
  );

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Meal Plan</h1>
          <p className="text-xs text-muted-foreground">
            Your weekly nutrition schedule
          </p>
        </div>
        <CalendarDays className="h-6 w-6 text-primary" />
      </div>

      {/* Week Navigation */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-card/80 border border-border/50 px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWeekOffset((o) => o - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-medium">{weekLabel}</p>
          {weekOffset === 0 && (
            <p className="text-[10px] text-primary">Current Week</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWeekOffset((o) => o + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={viewMode === "my-cuisine" ? "default" : "outline"}
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => setViewMode("my-cuisine")}
        >
          <Utensils className="h-3.5 w-3.5" />
          My Cuisine
        </Button>
        <Button
          variant={viewMode === "explore" ? "default" : "outline"}
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => setViewMode("explore")}
        >
          <Globe className="h-3.5 w-3.5" />
          Explore Cuisines
        </Button>
      </div>

      {/* Generating Animation */}
      {isGenerating && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Generating your meal plan...
              </p>
              <p className="text-xs text-muted-foreground">
                Creating balanced meals for your goals
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!currentPlan && !isGenerating && (
        <Card className="border-dashed border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">No Meal Plan Yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate a personalized weekly meal plan based on your
                nutrition goals and dietary preferences.
              </p>
            </div>
            <Button
              size="lg"
              className="mt-2 gap-2"
              onClick={handleGenerate}
            >
              <Sparkles className="h-4 w-4" />
              Generate Plan
            </Button>
            {profile && (
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {profile.goal.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {profile.dietType.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {profile.activityLevel.replace("_", " ")}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan Grid */}
      {currentPlan && !isGenerating && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {currentPlan.name}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                Updated{" "}
                {format(new Date(currentPlan.updatedAt), "MMM d, h:mm a")}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleGenerate}
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </Button>
          </div>

          {/* Daily Target Summary */}
          <Card className="mb-4 border-border/50 bg-card/80">
            <CardContent className="flex items-center justify-around py-3">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">
                  {Math.round(currentPlan.targetDailyMacros.calories)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Target Cal
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {Math.round(currentPlan.targetDailyMacros.protein)}g
                </p>
                <p className="text-[10px] text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {Math.round(currentPlan.targetDailyMacros.carbohydrates)}g
                </p>
                <p className="text-[10px] text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {Math.round(currentPlan.targetDailyMacros.fat)}g
                </p>
                <p className="text-[10px] text-muted-foreground">Fat</p>
              </div>
            </CardContent>
          </Card>

          <WeeklyPlanGrid
            plan={currentPlan}
            weekStartDate={currentWeekStart}
            onRegenerateDay={handleRegenerateDay}
          />
        </>
      )}
    </PageContainer>
  );
}
