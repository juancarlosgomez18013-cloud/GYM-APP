import type { ActivityLevel, DietType, FitnessGoal } from "../../types/user";

/**
 * Human-readable descriptions for each fitness goal.
 */
export const GOAL_DESCRIPTIONS: Record<FitnessGoal, string> = {
  weight_loss:
    "Lose body fat while preserving lean muscle mass through a moderate caloric deficit and high protein intake.",
  muscle_gain:
    "Build lean muscle mass with a caloric surplus and balanced macronutrient distribution to fuel training and recovery.",
  recomposition:
    "Simultaneously reduce body fat and build muscle with a slight deficit and elevated protein intake.",
  maintenance:
    "Maintain your current weight and body composition with balanced nutrition matched to your energy expenditure.",
};

/**
 * Macro split override for specific diet types.
 * Returns a percentage-based split if the diet type requires overriding
 * the default goal-based splits, or null if the goal defaults should be used.
 *
 * @param dietType - The user's selected diet type
 * @returns Object with protein/carbs/fat percentages, or null
 */
export function getDietTypeOverride(
  dietType: DietType
): { protein: number; carbs: number; fat: number } | null {
  switch (dietType) {
    case "keto":
      return {
        protein: 0.2,
        carbs: 0.05,
        fat: 0.75,
      };
    case "high_protein":
      return {
        protein: 0.4,
        carbs: 0.35,
        fat: 0.25,
      };
    case "balanced":
    case "mediterranean":
    case "iifym":
    default:
      return null;
  }
}

/**
 * Returns a user-friendly label for a fitness goal.
 *
 * @param goal - The fitness goal enum value
 * @returns A formatted display string
 */
export function getGoalLabel(goal: FitnessGoal): string {
  const labels: Record<FitnessGoal, string> = {
    weight_loss: "Weight Loss",
    muscle_gain: "Muscle Gain",
    recomposition: "Body Recomposition",
    maintenance: "Maintenance",
  };
  return labels[goal];
}

/**
 * Returns a user-friendly label for an activity level.
 *
 * @param level - The activity level enum value
 * @returns A formatted display string
 */
export function getActivityLabel(level: ActivityLevel): string {
  const labels: Record<ActivityLevel, string> = {
    sedentary: "Sedentary (little or no exercise)",
    lightly_active: "Lightly Active (1-3 days/week)",
    moderately_active: "Moderately Active (3-5 days/week)",
    active: "Active (6-7 days/week)",
    very_active: "Very Active (twice per day / physical job)",
  };
  return labels[level];
}
