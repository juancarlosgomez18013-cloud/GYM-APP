export interface MacroNutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  saturatedFat?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  source: "usda" | "open_food_facts" | "manual" | "ai_recognized";
  nutrients: MacroNutrients;
  servingSize: number;
  servingSizeUnit: string;
  servingDescription?: string;
  foodCategory?: string;
  barcode?: string;
  imageUrl?: string;
}
