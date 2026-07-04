import type { User } from "@/types/prisma/browser";
import { create } from "zustand";

export const useAuthStore = create<{
  isAuthenticated: boolean;
  user: User | null;
  setUserProfile(user: User): void;
  logOut(): void;
}>((set) => ({
  isAuthenticated: false,
  user: null,
  setUserProfile(user) {
    set({ isAuthenticated: true, user });
  },
  logOut() {
    set({ isAuthenticated: false, user: null });
  },
}));
