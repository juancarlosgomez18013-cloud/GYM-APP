"use client";

import type { MealPlan } from "@/types/plan";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DayPlanCard } from "./DayPlanCard";
import { format, addDays, startOfWeek } from "date-fns";

interface WeeklyPlanGridProps {
  plan: MealPlan;
  weekStartDate: Date;
  onRegenerateDay: (date: string) => void;
}

export function WeeklyPlanGrid({
  plan,
  weekStartDate,
  onRegenerateDay,
}: WeeklyPlanGridProps) {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });

  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden">
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4 snap-x snap-mandatory">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = addDays(weekStart, i);
              const dayOfWeek = date.getDay();
              const dayPlan = plan.days.find(
                (d) => d.dayOfWeek === dayOfWeek
              );
              const dateStr = format(date, "yyyy-MM-dd");
              const dateLabel = format(date, "MMM d");

              const fallbackDay = {
                dayOfWeek,
                meals: [],
                totalMacros: {
                  calories: 0,
                  protein: 0,
                  carbohydrates: 0,
                  fat: 0,
                },
              };

              return (
                <DayPlanCard
                  key={dateStr}
                  dayPlan={dayPlan ?? fallbackDay}
                  dateLabel={dateLabel}
                  onRegenerateDay={() => onRegenerateDay(dateStr)}
                />
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid md:grid-cols-7 md:gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(weekStart, i);
          const dayOfWeek = date.getDay();
          const dayPlan = plan.days.find((d) => d.dayOfWeek === dayOfWeek);
          const dateStr = format(date, "yyyy-MM-dd");
          const dateLabel = format(date, "MMM d");

          const fallbackDay = {
            dayOfWeek,
            meals: [],
            totalMacros: {
              calories: 0,
              protein: 0,
              carbohydrates: 0,
              fat: 0,
            },
          };

          return (
            <DayPlanCard
              key={dateStr}
              dayPlan={dayPlan ?? fallbackDay}
              dateLabel={dateLabel}
              onRegenerateDay={() => onRegenerateDay(dateStr)}
            />
          );
        })}
      </div>
    </>
  );
}
