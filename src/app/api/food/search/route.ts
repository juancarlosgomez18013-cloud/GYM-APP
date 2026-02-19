import { NextRequest, NextResponse } from "next/server";

// USDA FoodData Central API
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const pageSize = searchParams.get("pageSize") || "20";
  const pageNumber = searchParams.get("pageNumber") || "1";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY || "DEMO_KEY";

  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&pageNumber=${pageNumber}&api_key=${apiKey}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json();

    // Map USDA response to our FoodItem format
    const foods = (data.foods || []).map((food: any) => ({
      id: String(food.fdcId),
      name: food.description || food.lowercaseDescription || "Unknown",
      brand: food.brandOwner || food.brandName || undefined,
      source: "usda" as const,
      nutrients: mapUSDANutrients(food.foodNutrients || []),
      servingSize: food.servingSize || 100,
      servingSizeUnit: food.servingSizeUnit || "g",
      servingDescription: food.householdServingFullText || undefined,
      foodCategory: food.foodCategory || undefined,
    }));

    return NextResponse.json({
      foods,
      totalHits: data.totalHits || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
    });
  } catch (error) {
    console.error("USDA API error:", error);
    return NextResponse.json(
      { error: "Failed to search foods" },
      { status: 500 }
    );
  }
}

function mapUSDANutrients(nutrients: any[]) {
  // USDA nutrient IDs: 1003=protein, 1004=fat, 1005=carbs, 1008=calories, 1079=fiber, 2000=sugar, 1093=sodium
  const findNutrient = (id: number) => {
    const n = nutrients.find(
      (n: any) => n.nutrientId === id || n.nutrientNumber === String(id)
    );
    return n ? Math.round((n.value || 0) * 10) / 10 : 0;
  };

  return {
    calories: findNutrient(1008),
    protein: findNutrient(1003),
    carbohydrates: findNutrient(1005),
    fat: findNutrient(1004),
    fiber: findNutrient(1079) || undefined,
    sugar: findNutrient(2000) || undefined,
    sodium: findNutrient(1093) || undefined,
  };
}
