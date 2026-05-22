import { create } from "zustand";

import type { AppPageMeta, AppPageMetaState, AppPageMetaStore } from "./types";

export const EMPTY_PAGE_META: AppPageMetaState = {
  breadcrumbs: [],
};

function normalizeMeta(meta?: AppPageMeta | null): AppPageMetaState {
  if (!meta) {
    return EMPTY_PAGE_META;
  }

  return {
    breadcrumbs: meta.breadcrumbs ?? [],
    title: meta.title,
    description: meta.description,
    action: meta.action,
  };
}

export const useAppPageMetaStore = create<AppPageMetaStore>((set) => ({
  ...EMPTY_PAGE_META,
  setMeta: (meta) => set(normalizeMeta(meta)),
  clearMeta: () => set(EMPTY_PAGE_META),
}));
