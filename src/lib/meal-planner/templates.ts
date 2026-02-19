import type { MealType } from "@/types/meal";

export const MEAL_BUDGET_ALLOCATION: Record<MealType, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack: 0.1,
};

export const MEAL_TYPE_ORDER: MealType[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

export function getMealCalorieBudget(
  totalCalories: number,
  mealType: MealType
): number {
  return Math.round(totalCalories * MEAL_BUDGET_ALLOCATION[mealType]);
}

export function getMealMacroBudget(
  totalMacros: { protein: number; carbohydrates: number; fat: number },
  mealType: MealType
): { protein: number; carbohydrates: number; fat: number } {
  const allocation = MEAL_BUDGET_ALLOCATION[mealType];
  return {
    protein: Math.round(totalMacros.protein * allocation),
    carbohydrates: Math.round(totalMacros.carbohydrates * allocation),
    fat: Math.round(totalMacros.fat * allocation),
  };
}
