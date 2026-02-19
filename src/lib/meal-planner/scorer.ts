import type { RecipeCandidate } from "./constraints";
import type { PantryItem } from "@/types/pantry";

/**
 * Weight configuration for the scoring components.
 * These weights must sum to 1.0.
 */
const SCORE_WEIGHTS = {
  macroFit: 0.4,
  pantryAvailability: 0.2,
  variety: 0.15,
  userPreference: 0.1,
  cuisineMatch: 0.15,
} as const;

interface MacroTargets {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

interface ScoringContext {
  /** The macro budget for this specific meal slot */
  mealMacroTarget: MacroTargets;
  /** User's pantry items */
  pantryItems: PantryItem[];
  /** Recipe IDs already selected for this plan (for variety tracking) */
  usedRecipeIds: Set<string>;
  /** Recipe IDs already selected for this specific day (penalize harder) */
  usedRecipeIdsToday: Set<string>;
  /** The user's preferred cuisine country code */
  preferredCuisine: string;
  /** Tags that the user has favorited or upvoted */
  preferredTags: string[];
}

/**
 * Score how well a recipe's macros fit the target budget for this meal.
 * Returns a value between 0 and 1, where 1 is a perfect match.
 */
function scoreMacroFit(
  recipe: RecipeCandidate,
  target: MacroTargets
): number {
  if (target.calories === 0) return 0.5; // No target set, neutral score

  // Calculate percentage deviation for each macro
  const calorieDev = Math.abs(recipe.nutrients.calories - target.calories) / Math.max(target.calories, 1);
  const proteinDev = Math.abs(recipe.nutrients.protein - target.protein) / Math.max(target.protein, 1);
  const carbDev = Math.abs(recipe.nutrients.carbohydrates - target.carbohydrates) / Math.max(target.carbohydrates, 1);
  const fatDev = Math.abs(recipe.nutrients.fat - target.fat) / Math.max(target.fat, 1);

  // Weighted average deviation (calories and protein matter more)
  const avgDeviation =
    calorieDev * 0.35 + proteinDev * 0.30 + carbDev * 0.20 + fatDev * 0.15;

  // Convert deviation to a 0-1 score using an exponential decay
  // A 0% deviation => 1.0, a 50% deviation => ~0.37, a 100% deviation => ~0.14
  return Math.exp(-2 * avgDeviation);
}

/**
 * Score how many of the recipe's likely ingredients the user already has in their pantry.
 * Uses fuzzy name matching between recipe tags/name and pantry item names.
 * Returns a value between 0 and 1.
 */
function scorePantryAvailability(
  recipe: RecipeCandidate,
  pantryItems: PantryItem[]
): number {
  if (pantryItems.length === 0) return 0.5; // No pantry data, neutral score

  // Build a set of normalized pantry item names for quick lookup
  const pantryNames = new Set(
    pantryItems.map((item) => item.name.toLowerCase().trim())
  );
  const pantryNamesList = Array.from(pantryNames);

  // Combine recipe name words and tags as "ingredients" to check against pantry
  const recipeTerms = [
    ...recipe.name.toLowerCase().split(/[\s,\-()]+/),
    ...recipe.tags.map((t) => t.toLowerCase()),
  ].filter((term) => term.length > 2); // Ignore very short words

  if (recipeTerms.length === 0) return 0.5;

  let matchCount = 0;
  for (const term of recipeTerms) {
    const found = pantryNamesList.some(
      (pantryName) =>
        pantryName.includes(term) || term.includes(pantryName)
    );
    if (found) matchCount++;
  }

  // Normalize: ratio of matched terms
  return Math.min(matchCount / Math.max(recipeTerms.length * 0.5, 1), 1);
}

/**
 * Score variety: penalize recipes that have already been used in the current plan.
 * Heavier penalty for same-day repeats than for same-week repeats.
 * Returns a value between 0 and 1.
 */
function scoreVariety(
  recipe: RecipeCandidate,
  usedRecipeIds: Set<string>,
  usedRecipeIdsToday: Set<string>
): number {
  // Same-day repeat: heavy penalty
  if (usedRecipeIdsToday.has(recipe.id)) {
    return 0.05;
  }

  // Same-week repeat: moderate penalty
  if (usedRecipeIds.has(recipe.id)) {
    return 0.3;
  }

  // Never used: full variety score
  return 1.0;
}

/**
 * Score user preference based on matching tags with user's preferred tags.
 * Returns a value between 0 and 1.
 */
function scoreUserPreference(
  recipe: RecipeCandidate,
  preferredTags: string[]
): number {
  if (preferredTags.length === 0) return 0.5; // No preferences, neutral

  const recipeTags = new Set(recipe.tags.map((t) => t.toLowerCase()));
  const normalizedPreferred = preferredTags.map((t) => t.toLowerCase());

  let matchCount = 0;
  for (const tag of normalizedPreferred) {
    if (recipeTags.has(tag)) matchCount++;
  }

  // Base score of 0.3, plus up to 0.7 for matching tags
  return 0.3 + 0.7 * Math.min(matchCount / Math.max(normalizedPreferred.length, 1), 1);
}

/**
 * Score cuisine match: full score if cuisine matches, partial otherwise.
 * Returns a value between 0 and 1.
 */
function scoreCuisineMatch(
  recipe: RecipeCandidate,
  preferredCuisine: string
): number {
  if (!preferredCuisine) return 0.5; // No preference, neutral

  const recipeCuisine = recipe.cuisineCountry.toLowerCase();
  const preferred = preferredCuisine.toLowerCase();

  if (recipeCuisine === preferred) {
    return 1.0;
  }

  // Partial match for related cuisines is not implemented here,
  // so non-matching cuisines get a base score
  return 0.35;
}

/**
 * Calculate the overall score for a recipe given the scoring context.
 * Returns a value between 0 and 1, where higher is better.
 */
export function scoreRecipe(
  recipe: RecipeCandidate,
  context: ScoringContext
): number {
  const macroScore = scoreMacroFit(recipe, context.mealMacroTarget);
  const pantryScore = scorePantryAvailability(recipe, context.pantryItems);
  const varietyScore = scoreVariety(
    recipe,
    context.usedRecipeIds,
    context.usedRecipeIdsToday
  );
  const preferenceScore = scoreUserPreference(recipe, context.preferredTags);
  const cuisineScore = scoreCuisineMatch(recipe, context.preferredCuisine);

  const totalScore =
    macroScore * SCORE_WEIGHTS.macroFit +
    pantryScore * SCORE_WEIGHTS.pantryAvailability +
    varietyScore * SCORE_WEIGHTS.variety +
    preferenceScore * SCORE_WEIGHTS.userPreference +
    cuisineScore * SCORE_WEIGHTS.cuisineMatch;

  return totalScore;
}

/**
 * Score and rank all candidate recipes, returning them sorted by score (descending).
 */
export function rankRecipes(
  candidates: RecipeCandidate[],
  context: ScoringContext
): Array<{ recipe: RecipeCandidate; score: number }> {
  const scored = candidates.map((recipe) => ({
    recipe,
    score: scoreRecipe(recipe, context),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored;
}
