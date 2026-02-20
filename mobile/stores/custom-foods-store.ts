import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FoodItem } from "@/types/food";

interface CustomFoodsState {
  foods: FoodItem[];
  addFood: (food: FoodItem) => void;
  removeFood: (foodId: string) => void;
  updateFood: (foodId: string, updates: Partial<FoodItem>) => void;
  searchCustomFoods: (query: string) => FoodItem[];
}

export const useCustomFoodsStore = create<CustomFoodsState>()(
  persist(
    (set, get) => ({
      foods: [],
      addFood: (food) => set((s) => ({ foods: [food, ...s.foods] })),
      removeFood: (foodId) => set((s) => ({ foods: s.foods.filter((f) => f.id !== foodId) })),
      updateFood: (foodId, updates) => set((s) => ({ foods: s.foods.map((f) => f.id === foodId ? { ...f, ...updates } : f) })),
      searchCustomFoods: (query) => {
        const q = query.toLowerCase();
        return get().foods.filter((f) => f.name.toLowerCase().includes(q) || f.brand?.toLowerCase().includes(q) || f.foodCategory?.toLowerCase().includes(q));
      },
    }),
    { name: "gymfuel-custom-foods", storage: createJSONStorage(() => AsyncStorage) }
  )
);
