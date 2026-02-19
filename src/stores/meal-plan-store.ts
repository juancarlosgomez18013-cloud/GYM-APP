import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

      setPlan: (plan: MealPlan) => {
        const current = get().currentPlan;

        set((state) => ({
          currentPlan: plan,
          planHistory: current
            ? [...state.planHistory, current]
            : state.planHistory,
        }));
      },

      clearPlan: () => {
        const current = get().currentPlan;

        set((state) => ({
          currentPlan: null,
          planHistory: current
            ? [...state.planHistory, current]
            : state.planHistory,
        }));
      },
    }),
    {
      name: "gymfuel-meal-plan",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
