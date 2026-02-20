export interface CuisineCountry {
  id: string;
  name: string;
  flag: string;
  region: CuisineRegion;
  typicalIngredients: string[];
  mealPatterns: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snack: string[];
  };
}

export type CuisineRegion = "americas" | "europe" | "asia" | "africa" | "middle_east" | "oceania";
