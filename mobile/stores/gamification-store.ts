import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GamificationState {
  lastCelebratedMilestone: number;
  setLastCelebratedMilestone: (days: number) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      lastCelebratedMilestone: 0,
      setLastCelebratedMilestone: (days) => set({ lastCelebratedMilestone: days }),
    }),
    { name: "gymfuel-gamification", storage: createJSONStorage(() => AsyncStorage) }
  )
);
