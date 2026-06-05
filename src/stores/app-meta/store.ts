import { create } from "zustand";

import type { AppMeta, AppMetaState, AppMetaStore } from "./types";

const EMPTY_META: AppMetaState = {
  breadcrumbs: [],
};

function normalizeMeta(meta?: AppMeta | null): AppMetaState {
  if (!meta) {
    return EMPTY_META;
  }

  return {
    breadcrumbs: meta.breadcrumbs ?? [],
    title: meta.title,
    description: meta.description,
    action: meta.action,
  };
}

export const usePageMetaStore = create<AppMetaStore>((set) => ({
  ...EMPTY_META,
  actions: {
    metaRegistered: (meta) => set(normalizeMeta(meta)),
    metaCleared: () => set(EMPTY_META),
  },
}));
