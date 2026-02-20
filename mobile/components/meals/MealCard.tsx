import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import type { MealEntry } from "@/types/meal";

interface MealCardProps {
  entry: MealEntry;
  onDelete: (id: string) => void;
}

export function MealCard({ entry, onDelete }: MealCardProps) {
  const multiplier = entry.quantity / entry.foodItem.servingSize;
  const calories = Math.round(entry.foodItem.nutrients.calories * multiplier);
  const protein = Math.round(entry.foodItem.nutrients.protein * multiplier);
  const carbs = Math.round(entry.foodItem.nutrients.carbohydrates * multiplier);
  const fat = Math.round(entry.foodItem.nutrients.fat * multiplier);

  return (
    <View className="bg-card rounded-xl border border-border px-4 py-3 flex-row items-center gap-3">
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
            {entry.foodItem.name}
          </Text>
          {entry.foodItem.brand && (
            <Text className="text-xs text-muted-foreground">{entry.foodItem.brand}</Text>
          )}
        </View>
        <Text className="text-xs text-muted-foreground">
          {entry.quantity}{entry.foodItem.servingSizeUnit}
          {entry.foodItem.servingDescription ? ` (${entry.foodItem.servingDescription})` : ""}
        </Text>
        <View className="flex-row items-center gap-3 mt-2">
          <Text className="text-xs font-semibold text-foreground">{calories} kcal</Text>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.macroProtein }} />
            <Text className="text-xs text-muted-foreground">P {protein}g</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.macroCarbs }} />
            <Text className="text-xs text-muted-foreground">C {carbs}g</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.macroFat }} />
            <Text className="text-xs text-muted-foreground">F {fat}g</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={() => onDelete(entry.id)} hitSlop={10}>
        <Ionicons name="trash-outline" size={18} color={COLORS.mutedForeground} />
      </Pressable>
    </View>
  );
}
