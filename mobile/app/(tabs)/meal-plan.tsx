import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/theme";
import { useUserStore } from "@/stores/user-store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const SAMPLE_MEALS: Record<string, MealSuggestion[]> = {
  Breakfast: [
    { name: "Oatmeal with banana", calories: 350, protein: 12, carbs: 55, fat: 8 },
    { name: "Greek yogurt parfait", calories: 280, protein: 20, carbs: 35, fat: 6 },
    { name: "Scrambled eggs + toast", calories: 380, protein: 22, carbs: 30, fat: 18 },
  ],
  Lunch: [
    { name: "Grilled chicken salad", calories: 450, protein: 38, carbs: 20, fat: 22 },
    { name: "Turkey wrap", calories: 420, protein: 30, carbs: 40, fat: 14 },
    { name: "Salmon bowl", calories: 520, protein: 35, carbs: 45, fat: 18 },
  ],
  Dinner: [
    { name: "Lean steak + sweet potato", calories: 550, protein: 42, carbs: 45, fat: 16 },
    { name: "Chicken stir-fry", calories: 480, protein: 35, carbs: 40, fat: 18 },
    { name: "Baked fish + veggies", calories: 400, protein: 38, carbs: 25, fat: 12 },
  ],
  Snack: [
    { name: "Protein shake", calories: 180, protein: 25, carbs: 8, fat: 3 },
    { name: "Almonds + apple", calories: 250, protein: 8, carbs: 25, fat: 14 },
  ],
};

export default function MealPlanScreen() {
  const profile = useUserStore((s) => s.profile);
  const [selectedDay, setSelectedDay] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekLabel = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === 1) return "Next Week";
    return `Week +${weekOffset}`;
  };

  return (
    <PageContainer>
      <View className="mb-6">
        <Text className="text-xl font-bold text-foreground">Meal Plan</Text>
        <Text className="text-sm text-muted-foreground">Weekly nutrition planning</Text>
      </View>

      {/* Week navigation */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => setWeekOffset(Math.max(0, weekOffset - 1))}>
          <Ionicons name="chevron-back" size={24} color={weekOffset > 0 ? COLORS.foreground : COLORS.mutedForeground} />
        </Pressable>
        <Text className="text-sm font-medium text-foreground">{getWeekLabel()}</Text>
        <Pressable onPress={() => setWeekOffset(weekOffset + 1)}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.foreground} />
        </Pressable>
      </View>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {DAYS.map((day, i) => (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(i)}
              className={`px-4 py-2 rounded-xl ${selectedDay === i ? "bg-primary" : "bg-card border border-border"}`}
            >
              <Text className={`text-sm font-medium ${selectedDay === i ? "text-primary-foreground" : "text-foreground"}`}>{day}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Day plan */}
      <Text className="text-lg font-semibold text-foreground mb-3">{DAYS[selectedDay]}'s Plan</Text>

      {MEALS.map((meal) => {
        const suggestions = SAMPLE_MEALS[meal] ?? [];
        const suggestion = suggestions[selectedDay % suggestions.length];
        if (!suggestion) return null;

        return (
          <Card key={meal} className="mb-3">
            <CardContent>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-foreground">{meal}</Text>
                <Badge variant="secondary">{suggestion.calories} kcal</Badge>
              </View>
              <Text className="text-sm text-foreground">{suggestion.name}</Text>
              <View className="flex-row gap-3 mt-2">
                <Text className="text-xs" style={{ color: COLORS.macroProtein }}>P {suggestion.protein}g</Text>
                <Text className="text-xs" style={{ color: COLORS.macroCarbs }}>C {suggestion.carbs}g</Text>
                <Text className="text-xs" style={{ color: COLORS.macroFat }}>F {suggestion.fat}g</Text>
              </View>
            </CardContent>
          </Card>
        );
      })}

      <Button variant="outline" className="mt-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="refresh" size={16} color={COLORS.foreground} />
          <Text className="text-sm text-foreground">Regenerate Plan</Text>
        </View>
      </Button>
    </PageContainer>
  );
}
