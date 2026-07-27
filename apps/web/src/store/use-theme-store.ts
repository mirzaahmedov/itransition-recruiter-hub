import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

export const useThemeStore = create(
  persist<{
    theme: Theme;
    toggleTheme: VoidFunction;
  }>(
    (set, get) => ({
      theme: "dark",
      toggleTheme() {
        set({ theme: get().theme === "dark" ? "light" : "dark" });
      },
    }),
    {
      name: "app-theme",
    },
  ),
);
