"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import {
  ArrowLeft,
  PlusCircle,
  UtensilsCrossed,
  Save,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCustomFoodsStore } from "@/stores/custom-foods-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import type { FoodItem } from "@/types/food";
import type { MealType } from "@/types/meal";

const CATEGORIES = [
  "Proteins",
  "Grains",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Fats",
  "Snacks",
  "Beverages",
  "Supplements",
  "Other",
];

const UNITS = ["g", "ml", "oz", "cup", "piece", "tbsp", "tsp", "scoop"];

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export default function AddCustomFoodPage() {
  const router = useRouter();
  const addFood = useCustomFoodsStore((s) => s.addFood);
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState("100");
  const [servingUnit, setServingUnit] = useState("g");
  const [servingDescription, setServingDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [sugar, setSugar] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [saved, setSaved] = useState(false);
  const [addedToMeal, setAddedToMeal] = useState(false);

  const isValid =
    name.trim() &&
    parseFloat(servingSize) > 0 &&
    parseFloat(calories) >= 0 &&
    parseFloat(protein) >= 0 &&
    parseFloat(carbs) >= 0 &&
    parseFloat(fat) >= 0;

  const buildFoodItem = (): FoodItem => ({
    id: nanoid(),
    name: name.trim(),
    brand: brand.trim() || undefined,
    source: "manual",
    nutrients: {
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbohydrates: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      fiber: fiber ? parseFloat(fiber) : undefined,
      sugar: sugar ? parseFloat(sugar) : undefined,
    },
    servingSize: parseFloat(servingSize) || 100,
    servingSizeUnit: servingUnit,
    servingDescription: servingDescription.trim() || undefined,
    foodCategory: category,
  });

  const handleSaveOnly = () => {
    if (!isValid) return;
    addFood(buildFoodItem());
    setSaved(true);
    setTimeout(() => {
      router.push("/food-search");
    }, 1000);
  };

  const handleSaveAndLog = () => {
    if (!isValid) return;
    const foodItem = buildFoodItem();
    addFood(foodItem);

    const today = new Date().toISOString().split("T")[0];
    addMealEntry(today, {
      id: nanoid(),
      foodItem,
      quantity: foodItem.servingSize,
      mealType,
      timestamp: new Date().toISOString(),
    });

    setAddedToMeal(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <PlusCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add Custom Food</h1>
          <p className="text-sm text-muted-foreground">
            Create a food with custom nutrition values
          </p>
        </div>
      </div>

      {/* Food Info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Food Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Homemade Chicken Soup"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand (optional)</Label>
            <Input
              id="brand"
              placeholder="e.g., Homemade"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="servingSize">Serving Size *</Label>
              <Input
                id="servingSize"
                type="number"
                min="1"
                step="1"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servingUnit">Unit</Label>
              <Select value={servingUnit} onValueChange={setServingUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servingDesc">
              Serving Description (optional)
            </Label>
            <Input
              id="servingDesc"
              placeholder="e.g., 1 bowl (250ml)"
              value={servingDescription}
              onChange={(e) => setServingDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Facts */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Nutrition Facts (per serving)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (kcal) *</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g) *</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g) *</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g) *</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                min="0"
                step="0.1"
                placeholder="Optional"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                min="0"
                step="0.1"
                placeholder="Optional"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal type for quick-log */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Log as meal type</Label>
            <Select
              value={mealType}
              onValueChange={(v) => setMealType(v as MealType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((mt) => (
                  <SelectItem key={mt.value} value={mt.value}>
                    {mt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pb-4">
        <Button
          className="w-full"
          disabled={!isValid || addedToMeal}
          onClick={handleSaveAndLog}
        >
          {addedToMeal ? (
            "Saved & Logged!"
          ) : (
            <>
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Save & Add to Today&apos;s Meals
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={!isValid || saved}
          onClick={handleSaveOnly}
        >
          {saved ? (
            "Saved!"
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save for Later
            </>
          )}
        </Button>
      </div>
    </PageContainer>
  );
}
