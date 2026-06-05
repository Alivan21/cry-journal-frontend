import * as React from "react";

import { usePageMeta } from "@/stores/app-meta/hooks";
import type { AppShellProps } from "@/stores/app-meta/types";

export function AppShell({ action, breadcrumbs, children, description, title }: AppShellProps) {
  const { metaCleared, metaRegistered } = usePageMeta();

  React.useLayoutEffect(() => {
    metaRegistered({ action, breadcrumbs, description, title });

    return () => {
      metaCleared();
    };
  }, [action, breadcrumbs, description, metaCleared, metaRegistered, title]);

  return <>{children}</>;
}
