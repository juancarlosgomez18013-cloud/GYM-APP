import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PantryItem, PantryCategory } from "@/types/pantry";

interface PantryState {
  items: PantryItem[];
  addItem: (item: PantryItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getItemsByCategory: (category: PantryCategory) => PantryItem[];
  clearExpired: () => void;
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (itemId) => set((s) => ({ items: s.items.filter((i) => i.id !== itemId) })),
      updateQuantity: (itemId, quantity) => set((s) => ({ items: s.items.map((i) => i.id === itemId ? { ...i, quantity } : i) })),
      getItemsByCategory: (category) => get().items.filter((i) => i.category === category),
      clearExpired: () => {
        const today = new Date().toISOString().split("T")[0];
        set((s) => ({ items: s.items.filter((i) => !i.expirationDate || i.expirationDate >= today) }));
      },
    }),
    { name: "gymfuel-pantry", storage: createJSONStorage(() => AsyncStorage) }
  )
);
