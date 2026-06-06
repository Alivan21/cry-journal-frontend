import { useLayoutEffect } from "react";

import { usePageMetaStore } from "@/stores/app-meta/store";
import type { AppShellProps } from "@/stores/app-meta/types";

export function AppShell({
  topActions,
  breadcrumbs,
  children,
  description,
  title,
  backTo,
}: AppShellProps) {
  useLayoutEffect(() => {
    const { metaCleared, metaRegistered } = usePageMetaStore.getState().actions;
    metaRegistered({ topActions, breadcrumbs, description, title, backTo });

    return () => {
      metaCleared();
    };
  }, [topActions, breadcrumbs, description, title, backTo]);

  return <>{children}</>;
}
