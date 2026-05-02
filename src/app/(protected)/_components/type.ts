import type { BreadcrumbsItem } from "@/components/breadcrumbs";
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AppContainerUser = {
  name?: string;
  email?: string;
  avatarSrc?: string;
};

export type AppContainerProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  user?: AppContainerUser;
};

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

export type AppPageMetaContextValue = {
  meta: AppPageMetaState;
  setMeta: (meta: AppPageMeta) => void;
  clearMeta: () => void;
};

export type AppPageMetaProviderProps = {
  children: ReactNode;
};

export type AppShellProps = AppPageMeta & {
  children: ReactNode;
};

export type AppProfileMenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
};

export type AppProfileMenuProps = {
  user?: AppContainerUser;
  triggerClassName?: string;
  contentAlign?: "start" | "end" | "center";
};

export type AppSidebarLeafRoute = {
  title: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
};

export type AppSidebarParentRoute = {
  title: string;
  icon: LucideIcon;
  badge?: string;
  path?: string;
  children: AppSidebarLeafRoute[];
};

export type AppSidebarRoute = AppSidebarLeafRoute | AppSidebarParentRoute;

export type AppSidebarSection = {
  label: string;
  items: AppSidebarRoute[];
};

export type AppSidebarFooterLink = AppSidebarLeafRoute;

export type AppSidebarProps = {
  user?: AppContainerUser;
};

export type NavBadgeProps = {
  badge?: string;
};

export type EllipsisTooltipProps = {
  text: string;
  className?: string;
  enabled?: boolean;
};

export type SidebarLeafItemProps = {
  item: AppSidebarLeafRoute;
};

export type SidebarCollapsibleItemProps = {
  item: AppSidebarParentRoute;
};

export type FooterLinkItemProps = {
  item: AppSidebarFooterLink;
};
