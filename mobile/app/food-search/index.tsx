import { useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/theme";
import { useCustomFoodsStore } from "@/stores/custom-foods-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { nanoid } from "nanoid";
import type { FoodItem } from "@/types/food";
import type { MealType } from "@/types/meal";

const MOCK_FOODS: FoodItem[] = [
  { id: "1", name: "Chicken Breast (Grilled)", brand: "Generic", source: "usda", nutrients: { calories: 165, protein: 31, carbohydrates: 0, fat: 3.6 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g cooked", foodCategory: "Poultry" },
  { id: "2", name: "Brown Rice (Cooked)", brand: "Generic", source: "usda", nutrients: { calories: 123, protein: 2.7, carbohydrates: 25.6, fat: 1 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g cooked", foodCategory: "Grains" },
  { id: "3", name: "Banana", source: "usda", nutrients: { calories: 89, protein: 1.1, carbohydrates: 22.8, fat: 0.3 }, servingSize: 118, servingSizeUnit: "g", servingDescription: "1 medium", foodCategory: "Fruits" },
  { id: "4", name: "Greek Yogurt (Non-Fat)", brand: "Fage", source: "usda", nutrients: { calories: 59, protein: 10, carbohydrates: 3.6, fat: 0.7 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g", foodCategory: "Dairy" },
  { id: "5", name: "Salmon (Atlantic)", brand: "Generic", source: "usda", nutrients: { calories: 208, protein: 20, carbohydrates: 0, fat: 13.4 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g cooked", foodCategory: "Seafood" },
  { id: "6", name: "Oatmeal (Instant)", brand: "Quaker", source: "usda", nutrients: { calories: 158, protein: 5.5, carbohydrates: 27, fat: 3.2 }, servingSize: 40, servingSizeUnit: "g", servingDescription: "1 packet", foodCategory: "Grains" },
  { id: "7", name: "Eggs (Whole, Large)", source: "usda", nutrients: { calories: 143, protein: 12.6, carbohydrates: 0.7, fat: 9.5 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "2 large eggs", foodCategory: "Eggs" },
  { id: "8", name: "Sweet Potato (Baked)", source: "usda", nutrients: { calories: 90, protein: 2, carbohydrates: 20.7, fat: 0.1 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g baked", foodCategory: "Vegetables" },
  { id: "9", name: "Almonds (Raw)", brand: "Blue Diamond", source: "usda", nutrients: { calories: 579, protein: 21.2, carbohydrates: 21.7, fat: 49.9 }, servingSize: 28, servingSizeUnit: "g", servingDescription: "1 oz", foodCategory: "Nuts" },
  { id: "10", name: "Whey Protein Isolate", brand: "ON", source: "usda", nutrients: { calories: 120, protein: 24, carbohydrates: 3, fat: 1 }, servingSize: 31, servingSizeUnit: "g", servingDescription: "1 scoop", foodCategory: "Supplements" },
  { id: "11", name: "Broccoli (Steamed)", source: "usda", nutrients: { calories: 35, protein: 2.4, carbohydrates: 7.2, fat: 0.4 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g", foodCategory: "Vegetables" },
  { id: "12", name: "Avocado", source: "usda", nutrients: { calories: 160, protein: 2, carbohydrates: 8.5, fat: 14.7 }, servingSize: 100, servingSizeUnit: "g", servingDescription: "100g", foodCategory: "Fruits" },
];

export default function FoodSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const customFoods = useCustomFoodsStore((s) => s.foods);
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    setTimeout(() => {
      const lq = q.toLowerCase();
      const all = [...customFoods, ...MOCK_FOODS];
      setResults(all.filter((f) => f.name.toLowerCase().includes(lq) || f.brand?.toLowerCase().includes(lq) || f.foodCategory?.toLowerCase().includes(lq)));
      setLoading(false);
    }, 300);
  }, [customFoods]);

  const addFood = (food: FoodItem, mealType: MealType = "lunch") => {
    const today = new Date().toISOString().split("T")[0];
    addMealEntry(today, { id: nanoid(), foodItem: food, quantity: food.servingSize, mealType, timestamp: new Date().toISOString() });
    setSelectedFood(null);
  };

  const displayList = searched ? results : MOCK_FOODS.slice(0, 6);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <Pressable onPress={() => setSelectedFood(item)} className="bg-card border border-border rounded-xl px-4 py-3 mb-2 flex-row items-center gap-3 active:opacity-70">
      <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center">
        <Text className="text-sm font-bold text-primary">{item.nutrients.calories}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>{item.name}</Text>
        <Text className="text-xs text-muted-foreground">{item.brand ?? item.foodCategory} - {item.servingDescription}</Text>
      </View>
      <View className="flex-row gap-1.5">
        <View className="items-center"><Text className="text-xs font-semibold" style={{ color: COLORS.macroProtein }}>{item.nutrients.protein}g</Text></View>
        <View className="items-center"><Text className="text-xs font-semibold" style={{ color: COLORS.macroCarbs }}>{item.nutrients.carbohydrates}g</Text></View>
        <View className="items-center"><Text className="text-xs font-semibold" style={{ color: COLORS.macroFat }}>{item.nutrients.fat}g</Text></View>
      </View>
    </Pressable>
  );

  return (
    <PageContainer scrollable={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.foreground} /></Pressable>
          <Text className="text-xl font-bold text-foreground">Food Search</Text>
        </View>
        <Pressable onPress={() => router.push("/food-search/add")} className="flex-row items-center gap-1 border border-border rounded-lg px-3 py-1.5">
          <Ionicons name="add-circle-outline" size={16} color={COLORS.foreground} />
          <Text className="text-xs text-foreground">Custom</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-accent border border-border rounded-xl px-3 mb-4">
        <Ionicons name="search" size={18} color={COLORS.mutedForeground} />
        <TextInput
          value={query} onChangeText={search} placeholder="Search foods..." placeholderTextColor={COLORS.mutedForeground}
          className="flex-1 text-foreground text-sm py-3 ml-2" autoCapitalize="none" returnKeyType="search"
        />
        {query.length > 0 && <Pressable onPress={() => search("")}><Ionicons name="close-circle" size={18} color={COLORS.mutedForeground} /></Pressable>}
      </View>

      {/* Custom foods */}
      {!query && customFoods.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="person-outline" size={14} color={COLORS.mutedForeground} />
            <Text className="text-sm font-medium text-muted-foreground">My Custom Foods</Text>
            <Badge variant="secondary">{String(customFoods.length)}</Badge>
          </View>
          {customFoods.slice(0, 3).map((f) => renderItem({ item: f }))}
        </View>
      )}

      {!searched && !query && <Text className="text-xs text-muted-foreground mb-2">Popular Foods</Text>}
      {searched && !loading && <Text className="text-xs text-muted-foreground mb-2">{results.length} result{results.length !== 1 ? "s" : ""}</Text>}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} className="mt-8" />
      ) : (
        <FlatList data={displayList} renderItem={renderItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false}
          ListEmptyComponent={searched ? (
            <View className="items-center py-16">
              <Ionicons name="search" size={40} color={COLORS.mutedForeground} style={{ opacity: 0.5 }} />
              <Text className="text-sm font-medium text-muted-foreground mt-4">No results found</Text>
              <Button variant="outline" onPress={() => router.push("/food-search/add")} className="mt-4">
                <Text className="text-sm text-foreground">Add Custom Food</Text>
              </Button>
            </View>
          ) : null}
        />
      )}

      {/* Detail Modal */}
      {selectedFood && (
        <Pressable className="absolute inset-0 bg-black/50" onPress={() => setSelectedFood(null)}>
          <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border p-5">
            <Text className="text-lg font-bold text-foreground mb-1">{selectedFood.name}</Text>
            <Text className="text-sm text-muted-foreground mb-4">{selectedFood.servingDescription}</Text>
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 items-center bg-accent rounded-xl py-3">
                <Text className="text-xl font-bold text-foreground">{selectedFood.nutrients.calories}</Text>
                <Text className="text-xs text-muted-foreground">kcal</Text>
              </View>
              <View className="flex-1 items-center bg-accent rounded-xl py-3">
                <Text className="text-xl font-bold" style={{ color: COLORS.macroProtein }}>{selectedFood.nutrients.protein}g</Text>
                <Text className="text-xs text-muted-foreground">Protein</Text>
              </View>
              <View className="flex-1 items-center bg-accent rounded-xl py-3">
                <Text className="text-xl font-bold" style={{ color: COLORS.macroCarbs }}>{selectedFood.nutrients.carbohydrates}g</Text>
                <Text className="text-xs text-muted-foreground">Carbs</Text>
              </View>
              <View className="flex-1 items-center bg-accent rounded-xl py-3">
                <Text className="text-xl font-bold" style={{ color: COLORS.macroFat }}>{selectedFood.nutrients.fat}g</Text>
                <Text className="text-xs text-muted-foreground">Fat</Text>
              </View>
            </View>
            {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((mt) => (
              <Button key={mt} variant="outline" onPress={() => addFood(selectedFood, mt)} className="mb-2">
                <Text className="text-sm text-foreground capitalize">Add to {mt}</Text>
              </Button>
            ))}
          </View>
        </Pressable>
      )}
    </PageContainer>
  );
}
