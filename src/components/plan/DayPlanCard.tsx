"use client";

import type { MealPlanDay } from "@/types/plan";
import type { MealType } from "@/types/meal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MealSlot } from "./MealSlot";
import { RefreshCw } from "lucide-react";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

interface DayPlanCardProps {
  dayPlan: MealPlanDay;
  dateLabel: string;
  onRegenerateDay: () => void;
}

export function DayPlanCard({
  dayPlan,
  dateLabel,
  onRegenerateDay,
}: DayPlanCardProps) {
  const dayName = DAY_SHORT[dayPlan.dayOfWeek] ?? "Day";

  return (
    <Card className="min-w-[260px] flex-shrink-0 snap-center border-border/50 bg-card/80 md:min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 py-2">
        <div>
          <CardTitle className="text-sm font-semibold">{dayName}</CardTitle>
          <p className="text-[10px] text-muted-foreground">{dateLabel}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onRegenerateDay}
          title="Regenerate this day"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pb-3">
        {MEAL_TYPES.map((type) => {
          const meal =
            dayPlan.meals.find((m) => m.mealType === type) ?? null;
          return <MealSlot key={type} meal={meal} mealType={type} />;
        })}

        <Separator className="my-1.5" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Daily Total</span>
          <span className="font-semibold text-primary">
            {Math.round(dayPlan.totalMacros.calories)} cal
          </span>
        </div>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>P: {Math.round(dayPlan.totalMacros.protein)}g</span>
          <span>C: {Math.round(dayPlan.totalMacros.carbohydrates)}g</span>
          <span>F: {Math.round(dayPlan.totalMacros.fat)}g</span>
        </div>
      </CardContent>
    </Card>
  );
}
