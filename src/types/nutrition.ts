import type { ActivityLevel, FitnessGoal } from "./user";

export interface BMRResult {
  bmr: number;
  formula: "mifflin_st_jeor";
}

export interface TDEEResult {
  tdee: number;
  bmr: number;
  activityLevel: ActivityLevel;
  activityMultiplier: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  goal: FitnessGoal;
  deficit: number;
}
