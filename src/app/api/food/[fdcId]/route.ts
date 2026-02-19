import { NextRequest, NextResponse } from "next/server";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fdcId: string }> }
) {
  const { fdcId } = await params;
  const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY || "DEMO_KEY";

  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json();
    // Map and return the food detail
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get food details" },
      { status: 500 }
    );
  }
}
