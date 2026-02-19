import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GamificationState {
  lastCelebratedMilestone: number;
  setLastCelebratedMilestone: (days: number) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      lastCelebratedMilestone: 0,

      setLastCelebratedMilestone: (days: number) => {
        set({ lastCelebratedMilestone: days });
      },
    }),
    {
      name: "gymfuel-gamification",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
