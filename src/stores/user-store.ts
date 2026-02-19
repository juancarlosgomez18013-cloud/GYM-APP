import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types/user";

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addWeightEntry: (weightKg: number) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: (profile: UserProfile) => {
        set({ profile });
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const current = get().profile;
        if (!current) return;

        set({
          profile: {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      addWeightEntry: (weightKg: number) => {
        const current = get().profile;
        if (!current) return;

        const today = new Date().toISOString().split("T")[0];
        const existingIndex = current.weightLog.findIndex(
          (entry) => entry.date === today
        );

        let updatedLog: Array<{ date: string; weightKg: number }>;

        if (existingIndex >= 0) {
          updatedLog = current.weightLog.map((entry, index) =>
            index === existingIndex ? { date: today, weightKg } : entry
          );
        } else {
          updatedLog = [...current.weightLog, { date: today, weightKg }];
        }

        set({
          profile: {
            ...current,
            weightKg,
            weightLog: updatedLog,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearProfile: () => {
        set({ profile: null });
      },
    }),
    {
      name: "gymfuel-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
