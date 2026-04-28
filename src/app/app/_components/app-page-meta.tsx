/* eslint-disable react-refresh/only-export-components */

import * as React from "react";

import type {
  AppPageMeta,
  AppPageMetaContextValue,
  AppPageMetaProviderProps,
  AppPageMetaState,
  AppShellProps,
} from "./type";

const EMPTY_PAGE_META: AppPageMetaState = {
  breadcrumbs: [],
};

const AppPageMetaContext = React.createContext<AppPageMetaContextValue | null>(null);

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

export function AppPageMetaProvider({ children }: AppPageMetaProviderProps) {
  const [meta, setMetaState] = React.useState<AppPageMetaState>(EMPTY_PAGE_META);

  const setMeta = React.useCallback((value: AppPageMeta) => {
    setMetaState(normalizeMeta(value));
  }, []);

  const clearMeta = React.useCallback(() => {
    setMetaState(EMPTY_PAGE_META);
  }, []);

  const value = React.useMemo(
    () => ({
      meta,
      setMeta,
      clearMeta,
    }),
    [clearMeta, meta, setMeta]
  );

  return <AppPageMetaContext.Provider value={value}>{children}</AppPageMetaContext.Provider>;
}

function useAppPageMetaContext() {
  const context = React.useContext(AppPageMetaContext);

  if (!context) {
    throw new Error("App page metadata hooks must be used within AppPageMetaProvider.");
  }

  return context;
}

export function AppShell({
  action,
  breadcrumbs,
  children,
  description,
  title,
}: AppShellProps) {
  const { clearMeta, setMeta } = useAppPageMetaContext();

  React.useLayoutEffect(() => {
    setMeta({
      action,
      breadcrumbs,
      description,
      title,
    });

    return () => {
      clearMeta();
    };
  }, [action, breadcrumbs, clearMeta, description, setMeta, title]);

  return <>{children}</>;
}

export function useAppPageMetaValue() {
  return useAppPageMetaContext().meta;
}
