import { nanoid } from "nanoid";
import type { MealPlan, MealPlanDay, PlannedMeal } from "@/types/plan";
import type { MealType } from "@/types/meal";
import type { MacroNutrients } from "@/types/food";
import type { PantryItem } from "@/types/pantry";
import type { UserProfile } from "@/types/user";
import type { MacroTargets } from "@/types/nutrition";
import { MEAL_BUDGET_ALLOCATION } from "./templates";
import { MEAL_TYPE_ORDER } from "./templates";
import { filterRecipes, type RecipeCandidate } from "./constraints";
import { rankRecipes } from "./scorer";

/**
 * Configuration options for the meal plan generator.
 */
export interface GeneratorOptions {
  /** User profile with goal, diet type, restrictions, etc. */
  profile: UserProfile;
  /** Daily macro targets */
  macroTargets: MacroTargets;
  /** Items available in the user's pantry */
  pantryItems: PantryItem[];
  /** Full list of available recipes to choose from */
  recipes: RecipeCandidate[];
  /** Preferred cuisine country code */
  cuisineCountry: string;
  /** User preference tags (e.g., favorited categories) */
  preferredTags?: string[];
  /** Number of days to generate (default: 7) */
  days?: number;
  /** Randomization factor 0-1 (0 = always pick best, 1 = fully random). Default: 0.2 */
  randomness?: number;
}

/**
 * Select a recipe from the ranked list with some randomization for variety.
 * The randomness factor controls how much randomization is applied:
 * - 0: always pick the top-scored recipe
 * - 1: fully random selection from the candidate pool
 * - 0.2 (default): mostly picks top candidates but occasionally picks lower-ranked ones
 */
function selectWithRandomness(
  ranked: Array<{ recipe: RecipeCandidate; score: number }>,
  randomness: number
): RecipeCandidate | null {
  if (ranked.length === 0) return null;
  if (ranked.length === 1) return ranked[0].recipe;

  if (randomness <= 0) {
    return ranked[0].recipe;
  }

  // Determine how many top candidates to consider
  // At randomness=0.2, consider top ~30% of candidates (min 2)
  const poolSize = Math.max(
    2,
    Math.min(ranked.length, Math.ceil(ranked.length * (0.3 + randomness * 0.7)))
  );
  const pool = ranked.slice(0, poolSize);

  // Apply weighted random selection based on scores
  // Higher-scored recipes get proportionally more chance
  const totalScore = pool.reduce((sum, item) => sum + item.score, 0);
  if (totalScore === 0) {
    // All scores are 0, pick randomly
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx].recipe;
  }

  let random = Math.random() * totalScore;
  for (const item of pool) {
    random -= item.score;
    if (random <= 0) {
      return item.recipe;
    }
  }

  // Fallback to first item
  return pool[0].recipe;
}

/**
 * Calculate the macro target for a specific meal slot.
 */
function getMealSlotTarget(
  dailyTargets: MacroTargets,
  mealType: MealType
): { calories: number; protein: number; carbohydrates: number; fat: number } {
  const allocation = MEAL_BUDGET_ALLOCATION[mealType];
  return {
    calories: Math.round(dailyTargets.calories * allocation),
    protein: Math.round(dailyTargets.protein * allocation),
    carbohydrates: Math.round(dailyTargets.carbohydrates * allocation),
    fat: Math.round(dailyTargets.fat * allocation),
  };
}

/**
 * Build a PlannedMeal from a selected recipe and the meal type.
 */
function buildPlannedMeal(
  recipe: RecipeCandidate,
  mealType: MealType,
  mealTarget: { calories: number; protein: number; carbohydrates: number; fat: number }
): PlannedMeal {
  return {
    mealType,
    entries: [
      {
        id: nanoid(),
        foodItem: {
          id: recipe.id,
          name: recipe.name,
          source: "manual" as const,
          nutrients: {
            calories: recipe.nutrients.calories,
            protein: recipe.nutrients.protein,
            carbohydrates: recipe.nutrients.carbohydrates,
            fat: recipe.nutrients.fat,
          },
          servingSize: 1,
          servingSizeUnit: "serving",
        },
        quantity: 1,
        mealType,
        timestamp: new Date().toISOString(),
      },
    ],
    targetMacros: {
      calories: mealTarget.calories,
      protein: mealTarget.protein,
      carbohydrates: mealTarget.carbohydrates,
      fat: mealTarget.fat,
    },
  };
}

/**
 * Sum up the macros for all meals in a day.
 */
function calculateDayTotals(meals: PlannedMeal[]): MacroNutrients {
  const totals: MacroNutrients = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  };

  for (const meal of meals) {
    for (const entry of meal.entries) {
      totals.calories += entry.foodItem.nutrients.calories * entry.quantity;
      totals.protein += entry.foodItem.nutrients.protein * entry.quantity;
      totals.carbohydrates +=
        entry.foodItem.nutrients.carbohydrates * entry.quantity;
      totals.fat += entry.foodItem.nutrients.fat * entry.quantity;
    }
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbohydrates: Math.round(totals.carbohydrates),
    fat: Math.round(totals.fat),
  };
}

/**
 * Generate a complete meal plan.
 *
 * Algorithm:
 * 1. For each of N days (default 7):
 * 2.   For each meal slot (breakfast, lunch, dinner, snack):
 *      a. Calculate the calorie/macro budget for this slot
 *      b. Filter all recipes by meal type and dietary constraints
 *      c. Score each candidate based on macro fit, pantry, variety, preference, cuisine
 *      d. Select the best candidate (with randomization for variety)
 *      e. Record the selection and update tracking sets
 * 3. Assemble the MealPlan object with all days and meals
 */
export function generateMealPlan(options: GeneratorOptions): MealPlan {
  const {
    profile,
    macroTargets,
    pantryItems,
    recipes,
    cuisineCountry,
    preferredTags = [],
    days = 7,
    randomness = 0.2,
  } = options;

  // Track used recipe IDs across the entire plan for variety scoring
  const usedRecipeIds = new Set<string>();

  const planDays: MealPlanDay[] = [];

  for (let dayIndex = 0; dayIndex < days; dayIndex++) {
    // Track used recipe IDs for this specific day
    const usedRecipeIdsToday = new Set<string>();
    const dayMeals: PlannedMeal[] = [];

    for (const mealType of MEAL_TYPE_ORDER) {
      // 1. Calculate the macro budget for this meal slot
      const mealTarget = getMealSlotTarget(macroTargets, mealType);

      // 2. Filter recipes by meal type and dietary constraints
      const candidates = filterRecipes(
        recipes,
        mealType,
        profile.dietType,
        profile.dietaryRestrictions
      );

      if (candidates.length === 0) {
        // No candidates available for this slot -- skip
        continue;
      }

      // 3. Score and rank candidates
      const ranked = rankRecipes(candidates, {
        mealMacroTarget: mealTarget,
        pantryItems,
        usedRecipeIds,
        usedRecipeIdsToday,
        preferredCuisine: cuisineCountry,
        preferredTags,
      });

      // 4. Select with randomization
      const selected = selectWithRandomness(ranked, randomness);

      if (selected) {
        // Build the planned meal
        const plannedMeal = buildPlannedMeal(selected, mealType, mealTarget);
        dayMeals.push(plannedMeal);

        // Update tracking
        usedRecipeIds.add(selected.id);
        usedRecipeIdsToday.add(selected.id);
      }
    }

    // Calculate day totals
    const totalMacros = calculateDayTotals(dayMeals);

    planDays.push({
      dayOfWeek: dayIndex,
      meals: dayMeals,
      totalMacros,
    });
  }

  const now = new Date().toISOString();

  return {
    id: nanoid(),
    name: `${cuisineCountry} ${profile.goal} plan`,
    description: `${days}-day ${profile.dietType} meal plan targeting ${macroTargets.calories} kcal/day`,
    days: planDays,
    targetDailyMacros: {
      calories: macroTargets.calories,
      protein: macroTargets.protein,
      carbohydrates: macroTargets.carbohydrates,
      fat: macroTargets.fat,
    },
    createdAt: now,
    updatedAt: now,
  };
}
