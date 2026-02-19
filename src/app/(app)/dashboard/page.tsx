"use client";

import { useMemo } from "react";
import { useUserStore } from "@/stores/user-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalorieRing } from "@/components/nutrition/CalorieRing";
import { MacroProgressBar } from "@/components/nutrition/MacroProgressBar";
import { MacroDonutChart } from "@/components/nutrition/MacroDonutChart";
import { MealList } from "@/components/meals/MealList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Droplets,
  Minus,
  CalendarDays,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import type { ActivityLevel, FitnessGoal } from "@/types/user";

// ---------- Helpers ----------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function calculateTargets(profile: UserProfile) {
  const bmr =
    profile.sex === "male"
      ? 10 * profile.weightKg +
        6.25 * profile.heightCm -
        5 * profile.age +
        5
      : 10 * profile.weightKg +
        6.25 * profile.heightCm -
        5 * profile.age -
        161;

  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * (multipliers[profile.activityLevel] ?? 1.55);

  const goalAdjustments: Record<FitnessGoal, number> = {
    weight_loss: -400,
    muscle_gain: 400,
    recomposition: -250,
    maintenance: 0,
  };

  const targetCalories = Math.round(
    tdee + (goalAdjustments[profile.goal] ?? 0)
  );

  const splits: Record<FitnessGoal, { p: number; c: number; f: number }> = {
    weight_loss: { p: 0.4, c: 0.3, f: 0.3 },
    muscle_gain: { p: 0.3, c: 0.45, f: 0.25 },
    recomposition: { p: 0.35, c: 0.35, f: 0.3 },
    maintenance: { p: 0.3, c: 0.4, f: 0.3 },
  };

  const split = splits[profile.goal] ?? splits.maintenance;

  return {
    calories: targetCalories,
    protein: Math.round((targetCalories * split.p) / 4),
    carbs: Math.round((targetCalories * split.c) / 4),
    fat: Math.round((targetCalories * split.f) / 9),
  };
}

// ---------- Water goal (ml) ----------
const WATER_GOAL_ML = 2500;
const WATER_STEP_ML = 250;

// ---------- Component ----------

export default function DashboardPage() {
  const profile = useUserStore((s) => s.profile);
  const todayLog = useDailyLogStore((s) => s.getTodayLog());
  const removeMealEntry = useDailyLogStore((s) => s.removeMealEntry);
  const updateWaterIntake = useDailyLogStore((s) => s.updateWaterIntake);

  const targets = useMemo(() => {
    if (!profile) return null;
    return calculateTargets(profile);
  }, [profile]);

  if (!profile || !targets) {
    return (
      <PageContainer>
        <LoadingSpinner className="mt-32" label="Loading your profile..." />
      </PageContainer>
    );
  }

  const today = getTodayDateString();
  const meals = todayLog?.meals ?? [];
  const totals = todayLog?.totals ?? {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  };
  const waterMl = todayLog?.waterIntakeMl ?? 0;
  const waterGlasses = Math.floor(waterMl / WATER_STEP_ML);
  const waterPercent = Math.min((waterMl / WATER_GOAL_ML) * 100, 100);

  const handleDeleteMeal = (entryId: string) => {
    removeMealEntry(today, entryId);
  };

  const handleAddWater = () => {
    updateWaterIntake(today, waterMl + WATER_STEP_ML);
  };

  const handleRemoveWater = () => {
    if (waterMl >= WATER_STEP_ML) {
      updateWaterIntake(today, waterMl - WATER_STEP_ML);
    }
  };

  return (
    <PageContainer>
      {/* ========== Greeting Header ========== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {profile.name.split(" ")[0]}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>{formatDate()}</span>
        </div>
        <Badge variant="secondary" className="mt-2 capitalize">
          {profile.goal.replace("_", " ")}
        </Badge>
      </div>

      {/* ========== Calorie Ring + Donut Row ========== */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Daily Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <CalorieRing
              consumed={Math.round(totals.calories)}
              target={targets.calories}
            />
            <MacroDonutChart
              protein={Math.round(totals.protein)}
              carbs={Math.round(totals.carbohydrates)}
              fat={Math.round(totals.fat)}
              calories={Math.round(totals.calories)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========== Macro Progress Bars ========== */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Macronutrients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MacroProgressBar
            label="Protein"
            current={totals.protein}
            target={targets.protein}
            color="hsl(220, 80%, 60%)"
          />
          <MacroProgressBar
            label="Carbs"
            current={totals.carbohydrates}
            target={targets.carbs}
            color="hsl(45, 90%, 55%)"
          />
          <MacroProgressBar
            label="Fat"
            current={totals.fat}
            target={targets.fat}
            color="hsl(350, 80%, 60%)"
          />
        </CardContent>
      </Card>

      {/* ========== Water Intake ========== */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Droplets className="size-5 text-blue-400" />
            Water Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {(waterMl / 1000).toFixed(1)}L
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {(WATER_GOAL_ML / 1000).toFixed(1)}L
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {waterGlasses} {waterGlasses === 1 ? "glass" : "glasses"} (
                {WATER_STEP_ML}ml each)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleRemoveWater}
                disabled={waterMl < WATER_STEP_ML}
                aria-label="Remove a glass of water"
              >
                <Minus className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleAddWater}
                aria-label="Add a glass of water"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* Water progress bar */}
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-500 ease-out"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========== Today's Meals ========== */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Today&apos;s Meals
          </h2>
          {meals.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {meals.length} {meals.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
      </div>

      {/* ========== Quick-add FAB ========== */}
      <Button
        size="lg"
        className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg shadow-primary/30 md:right-[calc(50%-14rem)]"
        aria-label="Quick add meal"
        asChild={false}
      >
        <Plus className="size-6" />
      </Button>
    </PageContainer>
  );
}
