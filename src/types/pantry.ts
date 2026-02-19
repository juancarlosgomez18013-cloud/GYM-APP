import type { MacroNutrients } from "./food";

export type PantryCategory =
  | "proteins"
  | "dairy"
  | "grains"
  | "fruits"
  | "vegetables"
  | "snacks"
  | "beverages"
  | "condiments"
  | "frozen"
  | "supplements"
  | "other";

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  nutrients?: MacroNutrients;
  expirationDate?: string;
  barcode?: string;
  addedAt: string;
}
