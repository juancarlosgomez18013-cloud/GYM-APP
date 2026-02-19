import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DailyLog, MealEntry } from "@/types/meal";
import type { MacroNutrients } from "@/types/food";

interface DailyLogState {
  logs: DailyLog[];
  addMealEntry: (date: string, entry: MealEntry) => void;
  removeMealEntry: (date: string, entryId: string) => void;
  getLogByDate: (date: string) => DailyLog | undefined;
  getTodayLog: () => DailyLog | undefined;
  updateWaterIntake: (date: string, ml: number) => void;
}

function calculateTotals(meals: MealEntry[]): MacroNutrients {
  return meals.reduce<MacroNutrients>(
    (totals, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      const nutrients = entry.foodItem.nutrients;

      return {
        calories: totals.calories + nutrients.calories * multiplier,
        protein: totals.protein + nutrients.protein * multiplier,
        carbohydrates:
          totals.carbohydrates + nutrients.carbohydrates * multiplier,
        fat: totals.fat + nutrients.fat * multiplier,
        fiber:
          (totals.fiber ?? 0) + (nutrients.fiber ?? 0) * multiplier || undefined,
        sugar:
          (totals.sugar ?? 0) + (nutrients.sugar ?? 0) * multiplier || undefined,
        sodium:
          (totals.sodium ?? 0) + (nutrients.sodium ?? 0) * multiplier ||
          undefined,
        saturatedFat:
          (totals.saturatedFat ?? 0) +
            (nutrients.saturatedFat ?? 0) * multiplier || undefined,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    }
  );
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function createEmptyLog(date: string): DailyLog {
  return {
    date,
    meals: [],
    totals: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    },
    waterIntakeMl: 0,
  };
}

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      logs: [],

      addMealEntry: (date: string, entry: MealEntry) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date
          );

          if (existingLogIndex >= 0) {
            const updatedLogs = state.logs.map((log, index) => {
              if (index !== existingLogIndex) return log;

              const updatedMeals = [...log.meals, entry];
              return {
                ...log,
                meals: updatedMeals,
                totals: calculateTotals(updatedMeals),
              };
            });

            return { logs: updatedLogs };
          }

          const newLog: DailyLog = {
            ...createEmptyLog(date),
            meals: [entry],
            totals: calculateTotals([entry]),
          };

          return { logs: [...state.logs, newLog] };
        });
      },

      removeMealEntry: (date: string, entryId: string) => {
        set((state) => {
          const updatedLogs = state.logs.map((log) => {
            if (log.date !== date) return log;

            const updatedMeals = log.meals.filter(
              (meal) => meal.id !== entryId
            );
            return {
              ...log,
              meals: updatedMeals,
              totals: calculateTotals(updatedMeals),
            };
          });

          return { logs: updatedLogs };
        });
      },

      getLogByDate: (date: string) => {
        return get().logs.find((log) => log.date === date);
      },

      getTodayLog: () => {
        const today = getTodayDateString();
        return get().logs.find((log) => log.date === today);
      },

      updateWaterIntake: (date: string, ml: number) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date
          );

          if (existingLogIndex >= 0) {
            const updatedLogs = state.logs.map((log, index) => {
              if (index !== existingLogIndex) return log;
              return { ...log, waterIntakeMl: ml };
            });

            return { logs: updatedLogs };
          }

          const newLog: DailyLog = {
            ...createEmptyLog(date),
            waterIntakeMl: ml,
          };

          return { logs: [...state.logs, newLog] };
        });
      },
    }),
    {
      name: "gymfuel-daily-log",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
