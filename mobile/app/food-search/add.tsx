import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { nanoid } from "nanoid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { COLORS } from "@/constants/theme";
import { useCustomFoodsStore } from "@/stores/custom-foods-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import type { FoodItem } from "@/types/food";

export default function AddCustomFoodScreen() {
  const router = useRouter();
  const addFood = useCustomFoodsStore((s) => s.addFood);
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState("100");
  const [servingUnit, setServingUnit] = useState("g");
  const [servingDesc, setServingDesc] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const isValid = name.trim() && calories && protein && carbs && fat;

  const save = (addToLog: boolean) => {
    if (!isValid) { Alert.alert("Error", "Please fill in all required fields"); return; }
    const food: FoodItem = {
      id: nanoid(), name: name.trim(), brand: brand.trim() || undefined, source: "manual",
      nutrients: { calories: Number(calories), protein: Number(protein), carbohydrates: Number(carbs), fat: Number(fat) },
      servingSize: Number(servingSize) || 100, servingSizeUnit: servingUnit,
      servingDescription: servingDesc.trim() || undefined,
    };
    addFood(food);
    if (addToLog) {
      const today = new Date().toISOString().split("T")[0];
      addMealEntry(today, { id: nanoid(), foodItem: food, quantity: food.servingSize, mealType: "lunch", timestamp: new Date().toISOString() });
    }
    Alert.alert("Saved!", addToLog ? "Food saved and added to today's log" : "Food saved to your custom foods");
    router.back();
  };

  const Field = ({ label, value, onChange, placeholder, numeric }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; numeric?: boolean }) => (
    <View className="mb-3">
      <Text className="text-sm font-medium text-foreground mb-1.5">{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={COLORS.mutedForeground}
        keyboardType={numeric ? "numeric" : "default"}
        className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground text-sm"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View className="flex-row items-center gap-3 pt-4 mb-6">
            <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.foreground} /></Pressable>
            <Text className="text-xl font-bold text-foreground">Add Custom Food</Text>
          </View>

          <Card className="mb-4">
            <CardContent>
              <Field label="Food Name *" value={name} onChange={setName} placeholder="e.g. Homemade Granola" />
              <Field label="Brand (optional)" value={brand} onChange={setBrand} placeholder="e.g. My Kitchen" />
              <View className="flex-row gap-3">
                <View className="flex-1"><Field label="Serving Size *" value={servingSize} onChange={setServingSize} placeholder="100" numeric /></View>
                <View className="flex-1"><Field label="Unit" value={servingUnit} onChange={setServingUnit} placeholder="g" /></View>
              </View>
              <Field label="Description (optional)" value={servingDesc} onChange={setServingDesc} placeholder="e.g. 1 cup, 1 medium slice" />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent>
              <Text className="text-base font-semibold text-foreground mb-3">Nutrition Facts</Text>
              <Field label="Calories (kcal) *" value={calories} onChange={setCalories} placeholder="0" numeric />
              <Field label="Protein (g) *" value={protein} onChange={setProtein} placeholder="0" numeric />
              <Field label="Carbohydrates (g) *" value={carbs} onChange={setCarbs} placeholder="0" numeric />
              <Field label="Fat (g) *" value={fat} onChange={setFat} placeholder="0" numeric />
            </CardContent>
          </Card>

          <Button onPress={() => save(true)} disabled={!isValid} className="mb-2">
            <Text className="text-sm font-semibold text-primary-foreground">Save & Add to Today's Log</Text>
          </Button>
          <Button variant="outline" onPress={() => save(false)} disabled={!isValid}>
            <Text className="text-sm text-foreground">Save Only</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
