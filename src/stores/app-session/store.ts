import { create } from "zustand";

import type { AppSessionStore } from "./types";

const INITIAL_SESSION_STATE = {
  user: null,
  status: "idle" as const,
};

export const useAppSessionStore = create<AppSessionStore>((set) => ({
  ...INITIAL_SESSION_STATE,
  setSession: (user) => set({ user, status: "ready" }),
  setStatus: (status) => set({ status }),
  clearSession: () => set(INITIAL_SESSION_STATE),
}));
