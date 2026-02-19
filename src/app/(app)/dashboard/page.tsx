"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { useFastingStore } from "@/stores/fasting-store";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalorieRing } from "@/components/nutrition/CalorieRing";
import { MacroProgressBar } from "@/components/nutrition/MacroProgressBar";
import { MacroDonutChart } from "@/components/nutrition/MacroDonutChart";
import { MealList } from "@/components/meals/MealList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { MilestoneCelebration } from "@/components/gamification/MilestoneCelebration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Droplets,
  Minus,
  CalendarDays,
  Camera,
  Search,
  PlusCircle,
  Timer,
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
  const getCurrentStreak = useDailyLogStore((s) => s.getCurrentStreak);
  const currentSession = useFastingStore((s) => s.currentSession);
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [fastingTime, setFastingTime] = useState(getTimeRemaining());

  // Update streak on mount and when todayLog changes
  useEffect(() => {
    setStreak(getCurrentStreak());
  }, [getCurrentStreak, todayLog]);

  // Live fasting timer
  useEffect(() => {
    if (!currentSession) {
      setFastingTime(null);
      return;
    }
    const interval = setInterval(() => {
      setFastingTime(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession, getTimeRemaining]);

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

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <PageContainer>
      {/* Milestone celebration overlay */}
      <MilestoneCelebration />

      {/* ========== Greeting Header ========== */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {profile.name.split(" ")[0]}
          </h1>
          <StreakBadge streak={streak} />
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>{formatDate()}</span>
        </div>
        <Badge variant="secondary" className="mt-2 capitalize">
          {profile.goal.replace("_", " ")}
        </Badge>
      </div>

      {/* ========== Fasting Status Card ========== */}
      {currentSession && fastingTime && (
        <Link href="/fasting">
          <Card className="mb-4 cursor-pointer transition-colors hover:bg-card/80">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10">
                  <Timer className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {fastingTime.phase === "fasting"
                      ? "Fasting"
                      : "Eating Window"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentSession.protocol} protocol
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-amber-400">
                  {pad(fastingTime.hours)}:{pad(fastingTime.minutes)}:
                  {pad(fastingTime.seconds)}
                </p>
                <p className="text-[10px] text-muted-foreground">remaining</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {!currentSession && (
        <Link href="/fasting">
          <Card className="mb-4 cursor-pointer transition-colors hover:bg-card/80">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Intermittent Fasting
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap to start a fast
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Start
              </Badge>
            </CardContent>
          </Card>
        </Link>
      )}

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
        onClick={() => setQuickAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      {/* ========== Quick-add Sheet ========== */}
      <Sheet open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Add Food</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 p-4 pb-8">
            <Link href="/scan?mode=plate" onClick={() => setQuickAddOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3 h-14">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Scan Plate</p>
                  <p className="text-xs text-muted-foreground">
                    AI estimates calories from a photo
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/food-search" onClick={() => setQuickAddOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3 h-14">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Search Food</p>
                  <p className="text-xs text-muted-foreground">
                    Find in database or custom foods
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/food-search/add" onClick={() => setQuickAddOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3 h-14">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Add Custom</p>
                  <p className="text-xs text-muted-foreground">
                    Enter nutrition info manually
                  </p>
                </div>
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
