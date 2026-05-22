import { useShallow } from "zustand/react/shallow";

import { useAppPageMetaStore } from "./store";

/**
 * Page chrome for the app shell (header breadcrumbs, title, description, action)
 * plus actions pages use via `<AppShell />` to register that chrome.
 *
 * @example
 * // Layout header
 * const { breadcrumbs, title, description, action } = useAppPageMeta();
 *
 * @example
 * // Page wrapper — only need actions; props drive the effect deps
 * const { setMeta, clearMeta } = useAppPageMeta();
 */
export function useAppPageMeta() {
  return useAppPageMetaStore(
    useShallow((state) => ({
      breadcrumbs: state.breadcrumbs,
      title: state.title,
      description: state.description,
      action: state.action,
      setMeta: state.setMeta,
      clearMeta: state.clearMeta,
    }))
  );
}
