import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

export type { AppShellProps } from "@/stores/app-meta/types";
export type { AppSessionUser } from "@/stores/app-session/types";

export type AppContainerProps = {
  className?: string;
  contentClassName?: string;
};

export type AppProfileMenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
};

export type AppProfileMenuProps = {
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
