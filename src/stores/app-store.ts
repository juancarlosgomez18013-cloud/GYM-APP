import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  onboardingComplete: boolean;
  locale: string;
  setOnboardingComplete: (value: boolean) => void;
  setLocale: (locale: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      locale: "en",

      setOnboardingComplete: (value: boolean) => {
        set({ onboardingComplete: value });
      },

      setLocale: (locale: string) => {
        set({ locale });
      },
    }),
    {
      name: "gymfuel-app",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
