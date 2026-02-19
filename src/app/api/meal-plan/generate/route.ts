import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { profile, macroTargets, pantryItems, cuisineCountry } =
      await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `Generate a 7-day meal plan for a person with these characteristics:
- Goal: ${profile.goal} 
- Daily calorie target: ${macroTargets.calories} kcal
- Macro targets: Protein ${macroTargets.protein}g, Carbs ${macroTargets.carbs}g, Fat ${macroTargets.fat}g
- Preferred cuisine: ${cuisineCountry}
- Diet type: ${profile.dietType}
- Dietary restrictions: ${profile.dietaryRestrictions?.join(", ") || "none"}
- Available pantry items: ${pantryItems?.map((i: any) => i.foodItem?.name || i.name).join(", ") || "not specified"}

For each day, provide 4 meals (breakfast, lunch, dinner, snack).
Each meal should include: name, estimated calories, protein(g), carbs(g), fat(g), and cuisine country.
Try to match the daily macro targets closely.
Prefer dishes from the ${cuisineCountry} cuisine but include variety.

Return ONLY a JSON object with this structure:
{
  "days": [
    {
      "date": "Day 1",
      "meals": [
        { "name": "Meal name", "mealType": "breakfast", "calories": 400, "protein": 30, "carbs": 40, "fat": 15, "cuisineCountry": "mexico" }
      ]
    }
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Meal plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
