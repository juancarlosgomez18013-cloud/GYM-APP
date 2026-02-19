import type { Sex } from "../../types/user";
import type { BMRResult } from "../../types/nutrition";

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation.
 *
 * Males:   BMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
 * Females: BMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
 *
 * @param sex      - Biological sex for the formula constant
 * @param weightKg - Body weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age      - Age in years
 * @returns BMRResult with the calculated BMR and formula identifier
 */
export function calculateBMR(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number
): BMRResult {
  if (weightKg <= 0) {
    throw new Error("Weight must be a positive number.");
  }
  if (heightCm <= 0) {
    throw new Error("Height must be a positive number.");
  }
  if (age <= 0 || age > 150) {
    throw new Error("Age must be between 1 and 150.");
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const sexConstant = sex === "male" ? 5 : -161;
  const bmr = Math.round(base + sexConstant);

  return {
    bmr,
    formula: "mifflin_st_jeor",
  };
}
