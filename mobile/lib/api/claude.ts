import type { RecognizedPlateItem } from "../../types/recognition";
import { API_BASE_URL } from "./config";

export interface RecognizedItem {
  name: string;
  category: string;
  estimatedQuantity?: string;
  state?: string;
  confidence: number;
}

export async function recognizeFoodFromImage(base64Image: string, mode: "receipt" | "fridge"): Promise<RecognizedItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image, mode }),
  });
  const data = await response.json();
  return data.items || [];
}

export async function recognizePlateFromImage(base64Image: string): Promise<RecognizedPlateItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image, mode: "plate" }),
  });
  const data = await response.json();
  return data.items || [];
}
