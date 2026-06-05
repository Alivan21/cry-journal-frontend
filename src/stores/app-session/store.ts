import { create } from "zustand";

import type { AppSessionStore } from "./types";

const INITIAL_SESSION_STATE = {
  user: null,
  status: "idle" as const,
};

export const useAppSessionStore = create<AppSessionStore>((set) => ({
  ...INITIAL_SESSION_STATE,
  actions: {
    sessionLoaded: (user) => set({ user, status: "ready" }),
    sessionLoading: () => set({ status: "loading" }),
    sessionFailed: () => set({ user: null, status: "error" }),
    sessionCleared: () => set(INITIAL_SESSION_STATE),
  },
}));
