import { create } from "zustand";

export const useAppStore = create<{
  isNavbarExpanded: boolean;
  toggleNavbar(): void;
}>((set) => ({
  isNavbarExpanded: false,
  toggleNavbar() {
    set({ isNavbarExpanded: true });
  },
}));
