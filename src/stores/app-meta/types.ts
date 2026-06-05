import type { BreadcrumbsItem } from "@/components/breadcrumbs";
import type { ReactNode } from "react";

export type AppMeta = {
  breadcrumbs?: BreadcrumbsItem[];
  title?: string;
  description?: string;
  action?: ReactNode;
};

export type AppMetaState = {
  breadcrumbs: BreadcrumbsItem[];
  title?: string;
  description?: string;
  action?: ReactNode;
};

export type AppMetaActions = {
  metaRegistered: (meta: AppMeta) => void;
  metaCleared: () => void;
};

export type AppMetaStore = AppMetaState & {
  actions: AppMetaActions;
};

export type AppShellProps = AppMeta & {
  children: ReactNode;
};
