import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MealPlan } from "@/types/plan";

interface MealPlanState {
  currentPlan: MealPlan | null;
  planHistory: MealPlan[];
  setPlan: (plan: MealPlan) => void;
  clearPlan: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      planHistory: [],
      setPlan: (plan) => {
        const current = get().currentPlan;
        set((s) => ({ currentPlan: plan, planHistory: current ? [...s.planHistory, current] : s.planHistory }));
      },
      clearPlan: () => {
        const current = get().currentPlan;
        set((s) => ({ currentPlan: null, planHistory: current ? [...s.planHistory, current] : s.planHistory }));
      },
    }),
    { name: "gymfuel-meal-plan", storage: createJSONStorage(() => AsyncStorage) }
  )
);
