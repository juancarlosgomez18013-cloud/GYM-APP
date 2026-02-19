import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { image, mode } = await request.json();
    // image: base64 string
    // mode: "receipt" | "fridge"

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "ANTHROPIC_API_KEY not configured",
        items: getMockResults(mode), // Return mock results for demo
      }, { status: 200 });
    }

    const client = new Anthropic({ apiKey });

    const prompt =
      mode === "receipt"
        ? `Analyze this supermarket receipt image. Extract all food/grocery items you can identify.
For each item, provide:
1. name: The food item name (clean, normalized name)
2. category: One of: proteins, vegetables, fruits, dairy, grains, fats, condiments, beverages, other
3. estimatedQuantity: The quantity if visible (e.g., "1 kg", "500g", "2 units")
4. confidence: Your confidence level 0-1

Return ONLY a JSON array. Example:
[{"name": "Chicken breast", "category": "proteins", "estimatedQuantity": "1 kg", "confidence": 0.95}]
If you cannot identify any items, return an empty array [].`
        : `Analyze this image of food items (likely a fridge, pantry, or food display). Identify all food items visible.
For each food item, provide:
1. name: The food item name
2. category: One of: proteins, vegetables, fruits, dairy, grains, fats, condiments, beverages, other  
3. estimatedQuantity: Estimated quantity/weight
4. state: "fresh", "packaged", or "cooked"
5. confidence: Your confidence level 0-1

Return ONLY a JSON array. Example:
[{"name": "Eggs", "category": "proteins", "estimatedQuantity": "12 units", "state": "fresh", "confidence": 0.9}]
If you cannot identify any food items, return an empty array [].`;

    // Clean the base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Data,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    // Extract JSON from response
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const items = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Recognition error:", error);
    return NextResponse.json({
      error: "Recognition failed",
      items: getMockResults("fridge"),
    }, { status: 200 });
  }
}

function getMockResults(mode: string) {
  if (mode === "receipt") {
    return [
      {
        name: "Chicken breast",
        category: "proteins",
        estimatedQuantity: "1 kg",
        confidence: 0.85,
      },
      {
        name: "Brown rice",
        category: "grains",
        estimatedQuantity: "1 kg",
        confidence: 0.8,
      },
      {
        name: "Broccoli",
        category: "vegetables",
        estimatedQuantity: "500g",
        confidence: 0.75,
      },
      {
        name: "Eggs",
        category: "proteins",
        estimatedQuantity: "12 units",
        confidence: 0.9,
      },
      {
        name: "Olive oil",
        category: "fats",
        estimatedQuantity: "1 bottle",
        confidence: 0.85,
      },
      {
        name: "Greek yogurt",
        category: "dairy",
        estimatedQuantity: "500g",
        confidence: 0.8,
      },
    ];
  }
  return [
    {
      name: "Tomatoes",
      category: "vegetables",
      estimatedQuantity: "4 units",
      state: "fresh",
      confidence: 0.9,
    },
    {
      name: "Milk",
      category: "dairy",
      estimatedQuantity: "1 liter",
      state: "packaged",
      confidence: 0.85,
    },
    {
      name: "Cheese",
      category: "dairy",
      estimatedQuantity: "200g",
      state: "packaged",
      confidence: 0.8,
    },
    {
      name: "Lettuce",
      category: "vegetables",
      estimatedQuantity: "1 head",
      state: "fresh",
      confidence: 0.75,
    },
    {
      name: "Chicken thighs",
      category: "proteins",
      estimatedQuantity: "500g",
      state: "fresh",
      confidence: 0.7,
    },
  ];
}
