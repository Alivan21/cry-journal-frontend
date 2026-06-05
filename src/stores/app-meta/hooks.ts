import { useShallow } from "zustand/react/shallow";

import { usePageMetaStore } from "./store";

export function usePageMeta() {
  return usePageMetaStore(
    useShallow((state) => ({
      breadcrumbs: state.breadcrumbs,
      title: state.title,
      description: state.description,
      action: state.action,
      metaRegistered: state.actions.metaRegistered,
      metaCleared: state.actions.metaCleared,
    }))
  );
}
