import type { ActivityLevel } from "../../types/user";
import type { TDEEResult } from "../../types/nutrition";
import { ACTIVITY_MULTIPLIERS } from "./constants";

/**
 * Calculates Total Daily Energy Expenditure (TDEE) by multiplying
 * the Basal Metabolic Rate by the appropriate activity multiplier.
 *
 * @param bmr           - Basal Metabolic Rate in kcal/day
 * @param activityLevel - The user's self-reported activity level
 * @returns TDEEResult with TDEE, BMR, activity level, and multiplier used
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): TDEEResult {
  if (bmr <= 0) {
    throw new Error("BMR must be a positive number.");
  }

  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = Math.round(bmr * activityMultiplier);

  return {
    tdee,
    bmr,
    activityLevel,
    activityMultiplier,
  };
}
