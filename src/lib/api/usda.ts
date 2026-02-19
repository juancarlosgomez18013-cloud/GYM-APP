import type { FoodItem } from "@/types/food";

export interface FoodSearchResult {
  foods: FoodItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export async function searchFoods(
  query: string,
  pageSize = 20,
  pageNumber = 1
): Promise<FoodSearchResult> {
  const params = new URLSearchParams({
    query,
    pageSize: String(pageSize),
    pageNumber: String(pageNumber),
  });

  const response = await fetch(`/api/food/search?${params}`);

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}

export async function getFoodDetails(fdcId: string) {
  const response = await fetch(`/api/food/${fdcId}`);

  if (!response.ok) {
    throw new Error("Failed to get food details");
  }

  return response.json();
}
