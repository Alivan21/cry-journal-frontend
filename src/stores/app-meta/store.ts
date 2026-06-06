import { create } from "zustand";

import type { AppMeta, AppMetaState, AppMetaStore } from "./types";

const EMPTY_META: AppMetaState = {
  breadcrumbs: [],
  title: undefined,
  description: undefined,
  topActions: undefined,
  backTo: undefined,
};

function normalizeMeta(meta?: AppMeta | null): AppMetaState {
  if (!meta) {
    return EMPTY_META;
  }

  return {
    breadcrumbs: meta.breadcrumbs ?? [],
    title: meta.title,
    description: meta.description,
    topActions: meta.topActions,
    backTo: meta.backTo,
  };
}

export const usePageMetaStore = create<AppMetaStore>((set) => ({
  ...EMPTY_META,
  actions: {
    metaRegistered: (meta) => set(normalizeMeta(meta)),
    metaCleared: () => set(EMPTY_META),
  },
}));
