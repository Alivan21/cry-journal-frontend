import type { BreadcrumbsItem } from "@/components/breadcrumbs";
import type { ReactNode } from "react";

export type AppPageMeta = {
  breadcrumbs?: BreadcrumbsItem[];
  title?: string;
  description?: string;
  action?: ReactNode;
};

export type AppPageMetaState = {
  breadcrumbs: BreadcrumbsItem[];
  title?: string;
  description?: string;
  action?: ReactNode;
};

export type AppPageMetaActions = {
  setMeta: (meta: AppPageMeta) => void;
  clearMeta: () => void;
};

export type AppPageMetaStore = AppPageMetaState & AppPageMetaActions;

export type AppShellProps = AppPageMeta & {
  children: ReactNode;
};
