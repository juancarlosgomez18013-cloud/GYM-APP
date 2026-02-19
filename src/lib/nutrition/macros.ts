import type { UserProfile } from "../../types/user";
import type { MacroTargets } from "../../types/nutrition";
import { calculateBMR } from "./bmr";
import { calculateTDEE } from "./tdee";
import {
  GOAL_MACRO_SPLITS,
  CALORIES_PER_GRAM,
  PROTEIN_TARGET_RANGE,
} from "./constants";
import { getDietTypeOverride } from "./goals";

/**
 * Calculates complete macro nutrient targets for a user profile.
 *
 * Steps:
 *  1. Calculate BMR using Mifflin-St Jeor
 *  2. Calculate TDEE from BMR and activity level
 *  3. Look up the macro split for the user's fitness goal
 *  4. Apply calorie adjustment (surplus or deficit)
 *  5. Apply diet type overrides (e.g. keto)
 *  6. Convert percentages to gram amounts
 *  7. Validate protein meets minimum 1.6 g/kg; redistribute if needed
 *
 * @param profile - The complete user profile
 * @returns MacroTargets with calorie and macro gram targets
 */
export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  // Step 1: Calculate BMR
  const bmrResult = calculateBMR(
    profile.sex,
    profile.weightKg,
    profile.heightCm,
    profile.age
  );

  // Step 2: Calculate TDEE
  const tdeeResult = calculateTDEE(bmrResult.bmr, profile.activityLevel);

  // Step 3: Look up goal macro split
  const goalSplit = GOAL_MACRO_SPLITS[profile.goal];

  // Step 4: Apply calorie adjustment
  const adjustedCalories = Math.round(
    tdeeResult.tdee + goalSplit.calorieAdjustment
  );

  // Ensure calories don't drop below a safe minimum (1200 kcal)
  const safeCalories = Math.max(adjustedCalories, 1200);

  // Step 5: Get macro percentages, applying diet type overrides if applicable
  const dietOverride = getDietTypeOverride(profile.dietType);
  let proteinPercent = dietOverride
    ? dietOverride.protein
    : goalSplit.protein;
  let carbsPercent = dietOverride ? dietOverride.carbs : goalSplit.carbs;
  let fatPercent = dietOverride ? dietOverride.fat : goalSplit.fat;

  // Step 6: Calculate gram amounts from percentages
  let proteinGrams = Math.round(
    (safeCalories * proteinPercent) / CALORIES_PER_GRAM.protein
  );
  let carbsGrams = Math.round(
    (safeCalories * carbsPercent) / CALORIES_PER_GRAM.carbohydrates
  );
  let fatGrams = Math.round(
    (safeCalories * fatPercent) / CALORIES_PER_GRAM.fat
  );

  // Step 7: Validate protein meets minimum threshold (1.6 g/kg body weight)
  const minProteinGrams = Math.round(
    PROTEIN_TARGET_RANGE.min * profile.weightKg
  );

  if (proteinGrams < minProteinGrams) {
    // Override protein to the minimum recommended intake
    proteinGrams = minProteinGrams;

    // Recalculate protein calories and its new percentage
    const proteinCalories = proteinGrams * CALORIES_PER_GRAM.protein;
    proteinPercent = proteinCalories / safeCalories;

    // Redistribute remaining calories between carbs and fat,
    // maintaining their original ratio to each other
    const remainingCalories = safeCalories - proteinCalories;
    const originalCarbFatRatio = carbsPercent / (carbsPercent + fatPercent);

    const carbsCalories = Math.round(remainingCalories * originalCarbFatRatio);
    const fatCalories = remainingCalories - carbsCalories;

    carbsGrams = Math.round(carbsCalories / CALORIES_PER_GRAM.carbohydrates);
    fatGrams = Math.round(fatCalories / CALORIES_PER_GRAM.fat);

    carbsPercent = carbsCalories / safeCalories;
    fatPercent = fatCalories / safeCalories;
  }

  // Round percentages for display (as whole-number percentages)
  const finalProteinPercent = Math.round(proteinPercent * 100);
  const finalFatPercent = Math.round(fatPercent * 100);
  // Ensure percentages sum to 100 by giving remainder to carbs
  const finalCarbsPercent = 100 - finalProteinPercent - finalFatPercent;

  return {
    calories: safeCalories,
    protein: proteinGrams,
    carbohydrates: carbsGrams,
    fat: fatGrams,
    proteinPercent: finalProteinPercent,
    carbsPercent: finalCarbsPercent,
    fatPercent: finalFatPercent,
    goal: profile.goal,
    deficit: goalSplit.calorieAdjustment,
  };
}
