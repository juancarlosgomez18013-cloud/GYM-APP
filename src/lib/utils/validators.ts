import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
  sex: z.enum(["male", "female"]),
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Must be 120 or younger"),
  heightCm: z.number().min(100, "Height must be at least 100 cm").max(280, "Height must be 280 cm or less"),
  weightKg: z.number().min(25, "Weight must be at least 25 kg").max(350, "Weight must be 350 kg or less"),
  unitSystem: z.enum(["metric", "imperial"]),
  goal: z.enum(["weight_loss", "muscle_gain", "recomposition", "maintenance"]),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "active", "very_active"]),
  dietType: z.enum(["balanced", "high_protein", "keto", "mediterranean", "iifym"]),
  country: z.string().min(1, "Please select a country"),
  language: z.string().default("en"),
  dietaryRestrictions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  targetWeightKg: z.number().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
