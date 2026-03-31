import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "employee" | "manager" | "hr";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId: string;
}

export interface CheckInEntry {
  id: string;
  userId: string;
  date: string; // ISO date
  mood: number;        // 1-5
  energy: number;      // 1-5
  stress: number;      // 1-5
  mentalLoad: number;  // 1-5
  note?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

interface CheckInStore {
  entries: CheckInEntry[];
  addEntry: (entry: CheckInEntry) => void;
  todayDone: boolean;
  setTodayDone: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "mindly-auth" }
  )
);

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set) => ({
      entries: [],
      todayDone: false,
      addEntry: (entry) =>
        set((s) => ({ entries: [...s.entries, entry], todayDone: true })),
      setTodayDone: (v) => set({ todayDone: v }),
    }),
    { name: "mindly-checkins" }
  )
);
