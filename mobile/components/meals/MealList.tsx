import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { MealCard } from "./MealCard";
import type { MealEntry, MealType } from "@/types/meal";

interface MealListProps {
  meals: MealEntry[];
  onDeleteMeal: (id: string) => void;
}

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const MEAL_META: Record<MealType, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  breakfast: { label: "Breakfast", icon: "cafe-outline" },
  lunch: { label: "Lunch", icon: "sunny-outline" },
  dinner: { label: "Dinner", icon: "moon-outline" },
  snack: { label: "Snack", icon: "nutrition-outline" },
};

export function MealList({ meals, onDeleteMeal }: MealListProps) {
  if (meals.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="restaurant-outline" size={40} color={COLORS.mutedForeground} style={{ opacity: 0.5 }} />
        <Text className="text-sm font-medium text-muted-foreground mt-3">No meals logged yet</Text>
        <Text className="text-xs text-muted-foreground mt-1" style={{ opacity: 0.7 }}>
          Tap the + button to add your first meal
        </Text>
      </View>
    );
  }

  const grouped = MEAL_ORDER.map((type) => ({
    type,
    ...MEAL_META[type],
    entries: meals.filter((m) => m.mealType === type),
  })).filter((g) => g.entries.length > 0);

  return (
    <View className="gap-5">
      {grouped.map((group) => (
        <View key={group.type}>
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name={group.icon} size={16} color={COLORS.mutedForeground} />
            <Text className="text-sm font-semibold text-muted-foreground">{group.label}</Text>
            <Text className="text-xs text-muted-foreground">
              ({group.entries.length} {group.entries.length === 1 ? "item" : "items"})
            </Text>
          </View>
          <View className="gap-2">
            {group.entries.map((entry) => (
              <MealCard key={entry.id} entry={entry} onDelete={onDeleteMeal} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
