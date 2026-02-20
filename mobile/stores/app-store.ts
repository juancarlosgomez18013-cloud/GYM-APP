import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "gymfuel-app", storage: createJSONStorage(() => AsyncStorage) }
  )
);
