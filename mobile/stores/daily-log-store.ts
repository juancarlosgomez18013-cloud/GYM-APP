import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DailyLog, MealEntry } from "@/types/meal";
import type { MacroNutrients } from "@/types/food";

interface DailyLogState {
  logs: DailyLog[];
  addMealEntry: (date: string, entry: MealEntry) => void;
  removeMealEntry: (date: string, entryId: string) => void;
  getLogByDate: (date: string) => DailyLog | undefined;
  getTodayLog: () => DailyLog | undefined;
  updateWaterIntake: (date: string, ml: number) => void;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  hasLoggedToday: () => boolean;
  getStreakData: () => { current: number; longest: number; totalDaysLogged: number; loggedToday: boolean };
}

function calculateTotals(meals: MealEntry[]): MacroNutrients {
  return meals.reduce<MacroNutrients>(
    (totals, entry) => {
      const multiplier = entry.quantity / entry.foodItem.servingSize;
      const nutrients = entry.foodItem.nutrients;
      return {
        calories: totals.calories + nutrients.calories * multiplier,
        protein: totals.protein + nutrients.protein * multiplier,
        carbohydrates: totals.carbohydrates + nutrients.carbohydrates * multiplier,
        fat: totals.fat + nutrients.fat * multiplier,
        fiber: (totals.fiber ?? 0) + (nutrients.fiber ?? 0) * multiplier || undefined,
        sugar: (totals.sugar ?? 0) + (nutrients.sugar ?? 0) * multiplier || undefined,
        sodium: (totals.sodium ?? 0) + (nutrients.sodium ?? 0) * multiplier || undefined,
        saturatedFat: (totals.saturatedFat ?? 0) + (nutrients.saturatedFat ?? 0) * multiplier || undefined,
      };
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function createEmptyLog(date: string): DailyLog {
  return { date, meals: [], totals: { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }, waterIntakeMl: 0 };
}

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      addMealEntry: (date: string, entry: MealEntry) => {
        set((state) => {
          const idx = state.logs.findIndex((l) => l.date === date);
          if (idx >= 0) {
            const updatedLogs = state.logs.map((log, i) => {
              if (i !== idx) return log;
              const updatedMeals = [...log.meals, entry];
              return { ...log, meals: updatedMeals, totals: calculateTotals(updatedMeals) };
            });
            return { logs: updatedLogs };
          }
          const newLog: DailyLog = { ...createEmptyLog(date), meals: [entry], totals: calculateTotals([entry]) };
          return { logs: [...state.logs, newLog] };
        });
      },
      removeMealEntry: (date: string, entryId: string) => {
        set((state) => ({
          logs: state.logs.map((log) => {
            if (log.date !== date) return log;
            const updatedMeals = log.meals.filter((m) => m.id !== entryId);
            return { ...log, meals: updatedMeals, totals: calculateTotals(updatedMeals) };
          }),
        }));
      },
      getLogByDate: (date: string) => get().logs.find((l) => l.date === date),
      getTodayLog: () => get().logs.find((l) => l.date === getTodayDateString()),
      updateWaterIntake: (date: string, ml: number) => {
        set((state) => {
          const idx = state.logs.findIndex((l) => l.date === date);
          if (idx >= 0) {
            return { logs: state.logs.map((log, i) => i !== idx ? log : { ...log, waterIntakeMl: ml }) };
          }
          return { logs: [...state.logs, { ...createEmptyLog(date), waterIntakeMl: ml }] };
        });
      },
      hasLoggedToday: () => {
        const today = getTodayDateString();
        const log = get().logs.find((l) => l.date === today);
        return !!log && log.meals.length > 0;
      },
      getCurrentStreak: () => {
        const { logs } = get();
        const loggedDates = new Set(logs.filter((l) => l.meals.length > 0).map((l) => l.date));
        let streak = 0;
        const date = new Date();
        const todayStr = date.toISOString().split("T")[0];
        if (!loggedDates.has(todayStr)) date.setDate(date.getDate() - 1);
        while (true) {
          const dateStr = date.toISOString().split("T")[0];
          if (loggedDates.has(dateStr)) { streak++; date.setDate(date.getDate() - 1); }
          else break;
        }
        return streak;
      },
      getLongestStreak: () => {
        const { logs } = get();
        const loggedDates = logs.filter((l) => l.meals.length > 0).map((l) => l.date).sort();
        if (loggedDates.length === 0) return 0;
        let maxStreak = 1, currentStreak = 1;
        for (let i = 1; i < loggedDates.length; i++) {
          const prev = new Date(loggedDates[i - 1]);
          const curr = new Date(loggedDates[i]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) { currentStreak++; maxStreak = Math.max(maxStreak, currentStreak); }
          else if (diffDays > 1) currentStreak = 1;
        }
        return maxStreak;
      },
      getStreakData: () => {
        const state = get();
        return {
          current: state.getCurrentStreak(),
          longest: state.getLongestStreak(),
          totalDaysLogged: state.logs.filter((l) => l.meals.length > 0).length,
          loggedToday: state.hasLoggedToday(),
        };
      },
    }),
    { name: "gymfuel-daily-log", storage: createJSONStorage(() => AsyncStorage) }
  )
);
