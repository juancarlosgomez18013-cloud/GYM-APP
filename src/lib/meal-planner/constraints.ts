import type { DietType } from "@/types/user";

/**
 * A recipe candidate for the meal planner with tags and diet compatibility info.
 */
export interface RecipeCandidate {
  id: string;
  name: string;
  cuisineCountry: string;
  mealType: string[];
  nutrients: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  tags: string[];
  dietCompatibility: string[];
}

/**
 * Map of diet types to the tags/labels that indicate compatibility.
 */
const DIET_TYPE_TAGS: Record<DietType, string[]> = {
  balanced: [], // No restrictions -- all recipes are compatible
  high_protein: ["high_protein", "protein_rich"],
  keto: ["keto", "low_carb", "ketogenic"],
  mediterranean: ["mediterranean", "med_diet"],
  iifym: [], // IIFYM = "if it fits your macros" -- all recipes allowed
};

/**
 * Common dietary restriction labels and the recipe tags that violate them.
 * If the user has a restriction, any recipe containing a violating tag is excluded.
 */
const RESTRICTION_EXCLUSION_MAP: Record<string, string[]> = {
  vegetarian: ["meat", "poultry", "fish", "seafood"],
  vegan: ["meat", "poultry", "fish", "seafood", "dairy", "eggs", "honey"],
  gluten_free: ["gluten", "wheat", "barley", "rye"],
  dairy_free: ["dairy", "milk", "cheese", "yogurt", "butter"],
  nut_free: ["nuts", "peanuts", "tree_nuts", "almonds", "cashews", "walnuts"],
  shellfish_free: ["shellfish", "shrimp", "crab", "lobster"],
  soy_free: ["soy", "tofu", "tempeh", "edamame"],
  egg_free: ["eggs", "egg"],
  halal: ["pork", "alcohol"],
  kosher: ["pork", "shellfish"],
  pescatarian: ["meat", "poultry"],
  lactose_free: ["dairy", "milk", "lactose"],
};

/**
 * Check whether a recipe is compatible with the user's diet type.
 * For 'balanced' and 'iifym', all recipes pass this check.
 */
export function matchesDietType(
  recipe: RecipeCandidate,
  dietType: DietType
): boolean {
  const requiredTags = DIET_TYPE_TAGS[dietType];

  // If there are no required tags, all recipes are compatible
  if (requiredTags.length === 0) {
    return true;
  }

  // Check if the recipe's dietCompatibility or tags include at least one required tag
  const recipeTags = [
    ...recipe.tags.map((t) => t.toLowerCase()),
    ...recipe.dietCompatibility.map((t) => t.toLowerCase()),
  ];

  return requiredTags.some((tag) => recipeTags.includes(tag));
}

/**
 * Check whether a recipe satisfies all of the user's dietary restrictions.
 * Returns true if the recipe does NOT contain any excluded tags.
 */
export function matchesDietaryRestrictions(
  recipe: RecipeCandidate,
  restrictions: string[]
): boolean {
  if (!restrictions || restrictions.length === 0) {
    return true;
  }

  const recipeTags = [
    ...recipe.tags.map((t) => t.toLowerCase()),
    ...recipe.dietCompatibility.map((t) => t.toLowerCase()),
  ];

  for (const restriction of restrictions) {
    const normalizedRestriction = restriction.toLowerCase().replace(/[\s-]/g, "_");
    const excludedTags = RESTRICTION_EXCLUSION_MAP[normalizedRestriction];

    if (!excludedTags) {
      // Unknown restriction -- skip (permissive approach)
      continue;
    }

    // If the recipe has ANY of the excluded tags, it fails this restriction
    const hasExcludedTag = excludedTags.some((excluded) =>
      recipeTags.some((tag) => tag.includes(excluded))
    );

    if (hasExcludedTag) {
      return false;
    }
  }

  return true;
}

/**
 * Check whether a recipe matches a given meal type slot (e.g., "breakfast").
 */
export function matchesMealType(
  recipe: RecipeCandidate,
  mealType: string
): boolean {
  return recipe.mealType.some(
    (mt) => mt.toLowerCase() === mealType.toLowerCase()
  );
}

/**
 * Combined filter: checks diet type, dietary restrictions, and meal type all at once.
 * Returns true only if the recipe passes all constraint checks.
 */
export function satisfiesAllConstraints(
  recipe: RecipeCandidate,
  mealType: string,
  dietType: DietType,
  restrictions: string[]
): boolean {
  return (
    matchesMealType(recipe, mealType) &&
    matchesDietType(recipe, dietType) &&
    matchesDietaryRestrictions(recipe, restrictions)
  );
}

/**
 * Filter a list of recipes to only those that satisfy all constraints.
 */
export function filterRecipes(
  recipes: RecipeCandidate[],
  mealType: string,
  dietType: DietType,
  restrictions: string[]
): RecipeCandidate[] {
  return recipes.filter((recipe) =>
    satisfiesAllConstraints(recipe, mealType, dietType, restrictions)
  );
}
