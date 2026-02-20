export interface RecognizedPlateItem {
  name: string;
  category: string;
  estimatedQuantity: string;
  estimatedServingSizeG: number;
  nutrients: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  confidence: number;
  nutritionConfidence: number;
}
