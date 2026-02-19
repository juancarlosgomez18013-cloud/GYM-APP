import type { MealEntry, MealType } from "./meal";
import type { MacroNutrients } from "./food";

export interface PlannedMeal {
  mealType: MealType;
  entries: MealEntry[];
  targetMacros?: MacroNutrients;
}

export interface MealPlanDay {
  dayOfWeek: number;
  meals: PlannedMeal[];
  totalMacros: MacroNutrients;
}

export interface MealPlan {
  id: string;
  name: string;
  description?: string;
  days: MealPlanDay[];
  targetDailyMacros: MacroNutrients;
  createdAt: string;
  updatedAt: string;
}
