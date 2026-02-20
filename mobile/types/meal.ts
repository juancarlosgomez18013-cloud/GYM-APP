import type { FoodItem, MacroNutrients } from "./food";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  mealType: MealType;
  timestamp: string;
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  totals: MacroNutrients;
  waterIntakeMl: number;
  notes?: string;
}
