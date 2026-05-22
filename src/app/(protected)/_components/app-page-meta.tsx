import * as React from "react";

import { useAppPageMetaStore, type AppShellProps } from "@/stores/app-page-meta";

export function AppShell({ action, breadcrumbs, children, description, title }: AppShellProps) {
  React.useLayoutEffect(() => {
    useAppPageMetaStore.getState().setMeta({ action, breadcrumbs, description, title });

    return () => {
      useAppPageMetaStore.getState().clearMeta();
    };
  }, [action, breadcrumbs, description, title]);

  return <>{children}</>;
}
