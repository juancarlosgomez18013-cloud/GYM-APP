export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "active" | "very_active";
export type FitnessGoal = "weight_loss" | "muscle_gain" | "recomposition" | "maintenance";
export type DietType = "balanced" | "high_protein" | "keto" | "mediterranean" | "iifym";
export type UnitSystem = "metric" | "imperial";

export interface UserProfile {
  id: string;
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  dietType: DietType;
  unitSystem: UnitSystem;
  targetWeightKg?: number;
  country: string;
  language: string;
  dietaryRestrictions: string[];
  allergies: string[];
  onboardingComplete: boolean;
  weightLog: Array<{ date: string; weightKg: number }>;
  createdAt: string;
  updatedAt: string;
}
