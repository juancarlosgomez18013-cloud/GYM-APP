import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

      addItem: (item: PantryItem) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      getItemsByCategory: (category: PantryCategory) => {
        return get().items.filter((item) => item.category === category);
      },

      clearExpired: () => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => ({
          items: state.items.filter(
            (item) => !item.expirationDate || item.expirationDate >= today
          ),
        }));
      },
    }),
    {
      name: "gymfuel-pantry",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
