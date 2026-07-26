import type { Category } from "@rh/database/browser";
import { create } from "zustand";

export const useCategoryStore = create<{
  categories: Category[];
  setCategories: (data: Category[]) => void;
}>((set) => ({
  categories: [],
  setCategories: (data) => set({ categories: data }),
}));
