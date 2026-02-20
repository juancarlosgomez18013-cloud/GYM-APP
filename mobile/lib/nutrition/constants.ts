import type { ActivityLevel, FitnessGoal } from "../../types/user";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export interface GoalMacroSplit {
  protein: number;
  carbs: number;
  fat: number;
  calorieAdjustment: number;
}

export const GOAL_MACRO_SPLITS: Record<FitnessGoal, GoalMacroSplit> = {
  weight_loss: { protein: 0.4, carbs: 0.3, fat: 0.3, calorieAdjustment: -400 },
  muscle_gain: { protein: 0.3, carbs: 0.45, fat: 0.25, calorieAdjustment: 400 },
  recomposition: { protein: 0.35, carbs: 0.35, fat: 0.3, calorieAdjustment: -250 },
  maintenance: { protein: 0.3, carbs: 0.4, fat: 0.3, calorieAdjustment: 0 },
};

export const CALORIES_PER_GRAM = { protein: 4, carbohydrates: 4, fat: 9, alcohol: 7 } as const;
export const PROTEIN_TARGET_RANGE = { min: 1.6, max: 2.2 } as const;
