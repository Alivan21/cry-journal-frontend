import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Link, useLocation } from "react-router";

import { ROUTES } from "@/common/constant/routes";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/libs/clsx";
import type { AppContainerUser } from "./app-container";
import { APP_NAV_SECTIONS } from "../_constant/sidebar-items";

import { AppProfileMenu } from "./app-profile-menu";
import { ModeToggle } from "./app-toogle-theme";

const DEFAULT_BRAND_NAME = "Crimson";

type AppSidebarLeafRoute = {
  title: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
};

type AppSidebarParentRoute = {
  title: string;
  icon: LucideIcon;
  badge?: string;
  path?: string;
  children: AppSidebarLeafRoute[];
};

type AppSidebarRoute = AppSidebarLeafRoute | AppSidebarParentRoute;

export type AppSidebarSection = {
  label: string;
  items: AppSidebarRoute[];
};

export type AppSidebarFooterLink = AppSidebarLeafRoute;

export type AppSidebarProps = {
  navSections?: AppSidebarSection[];
  footerLinks?: AppSidebarFooterLink[];
  brandName?: string;
  user?: AppContainerUser;
};

function hasChildren(route: AppSidebarRoute): route is AppSidebarParentRoute {
  return "children" in route && Array.isArray(route.children) && route.children.length > 0;
}

function NavBadge({ badge }: { badge?: string }) {
  if (!badge) return null;

  return (
    <span className="bg-muted text-primary ml-auto rounded-full px-2 py-0.5 text-[0.68rem] font-semibold group-data-[collapsible=icon]:hidden">
      {badge}
    </span>
  );
}

function isTextOverflowing(el: HTMLElement): boolean {
  if (el.clientWidth < 1) return false;

  if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const textWidth = range.getBoundingClientRect().width;
    return textWidth > el.clientWidth + 1;
  }

  return el.scrollWidth > el.clientWidth + 1;
}

function EllipsisTooltip({
  text,
  className,
  enabled = true,
}: {
  text: string;
  className?: string;
  enabled?: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = React.useState(false);

  const measure = React.useEffectEvent(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      setTruncated(false);
      return;
    }
    setTruncated(isTextOverflowing(el));
  });

  React.useLayoutEffect(() => {
    if (!enabled) {
      measure();
      return;
    }
    // Defer until after the sidebar's 200ms width transition has settled,
    // otherwise clientWidth is still at icon-mode width and every label
    // is falsely reported as truncated.
    const timer = setTimeout(() => measure(), 220);
    return () => clearTimeout(timer);
  }, [text, enabled]);

  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);

  const span = (
    <span className={cn("min-w-0 truncate", className)} ref={ref}>
      {text}
    </span>
  );

  if (!truncated) {
    return span;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{span}</TooltipTrigger>
      <TooltipContent align="center" side="right" sideOffset={4}>
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarLeafItem({ item, pathname }: { item: AppSidebarLeafRoute; pathname: string }) {
  const { state } = useSidebar();
  const isActive = pathname === item.path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "text-sidebar-foreground/85 hover:text-sidebar-foreground h-11 rounded-xl px-3 text-sm font-medium transition-all",
          isActive &&
            "bg-background text-primary ring-border/70 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.9)] ring-1"
        )}
        isActive={isActive}
        tooltip={state === "collapsed" ? item.title : undefined}
      >
        <Link className="flex w-full min-w-0 items-center gap-2" to={item.path}>
          <item.icon
            className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
          />
          <EllipsisTooltip
            className={cn("flex-1", isActive ? "text-primary" : "text-sidebar-foreground")}
            enabled={state === "expanded"}
            text={item.title}
          />
          <NavBadge badge={item.badge} />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarCollapsibleItem({
  item,
  pathname,
}: {
  item: AppSidebarParentRoute;
  pathname: string;
}) {
  const { state } = useSidebar();
  const hasActiveChild = item.children.some((child) => pathname === child.path);
  const [open, setOpen] = React.useState(hasActiveChild);

  React.useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  return (
    <SidebarMenuItem>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="text-sidebar-foreground/85 hover:text-sidebar-foreground h-11 rounded-xl px-3 text-sm font-medium transition-all"
            tooltip={state === "collapsed" ? item.title : undefined}
          >
            <item.icon className="text-muted-foreground size-4 shrink-0" />
            <EllipsisTooltip
              className="flex-1 text-left"
              enabled={state === "expanded"}
              text={item.title}
            />
            <NavBadge badge={item.badge} />
            <ChevronDown
              className={cn(
                "text-muted-foreground size-4 shrink-0 transition-transform group-data-[collapsible=icon]:hidden",
                open && "rotate-180"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="border-sidebar-border/80 mt-1 space-y-1 border-l pl-3">
            {item.children.map((child) => {
              const isActive = pathname === child.path;

              return (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      "text-sidebar-foreground/80 hover:text-sidebar-foreground h-9 rounded-xl px-3 text-sm transition-all",
                      isActive &&
                        "bg-background text-primary ring-border/70 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.9)] ring-1"
                    )}
                    isActive={isActive}
                  >
                    <Link className="flex w-full min-w-0 items-center gap-2" to={child.path}>
                      <EllipsisTooltip
                        className="min-w-0 flex-1"
                        enabled={state === "expanded"}
                        text={child.title}
                      />
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function SidebarHeaderToggle() {
  const { state, toggleSidebar } = useSidebar();
  const Icon = state === "collapsed" ? ChevronRight : ChevronLeft;

  return (
    <Button
      className="border-border/70 bg-background/90 text-muted-foreground hover:bg-background hover:text-foreground size-9 rounded-xl border shadow-sm"
      onClick={toggleSidebar}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-4" />
      <span className="sr-only">
        {state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </Button>
  );
}

export function AppSidebar({
  navSections = APP_NAV_SECTIONS,
  footerLinks = [],
  brandName = DEFAULT_BRAND_NAME,
  user,
}: AppSidebarProps) {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-sidebar-border/80 bg-sidebar/95 border-r" collapsible="icon">
      <SidebarHeader className="border-sidebar-border/80 border-b px-4 py-4">
        {isCollapsed ? (
          <div className="flex justify-center">
            <SidebarHeaderToggle />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Link className="flex min-w-0 items-center gap-3" to={ROUTES.PROTECTED.DASHBOARD}>
              <div className="bg-muted text-primary grid size-9 shrink-0 grid-cols-2 gap-1 rounded-2xl p-1.5">
                <span className="rounded-full bg-current opacity-90" />
                <span className="rounded-full bg-current opacity-70" />
                <span className="rounded-full bg-current opacity-70" />
                <span className="rounded-full bg-current opacity-90" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[1.05rem] font-semibold tracking-tight">{brandName}</p>
              </div>
            </Link>

            <SidebarHeaderToggle />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        {navSections.map((section) => (
          <SidebarGroup className="px-0" key={section.label}>
            <SidebarGroupLabel className="text-muted-foreground px-3 pb-2 text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) =>
                  hasChildren(item) ? (
                    <SidebarCollapsibleItem item={item} key={item.title} pathname={pathname} />
                  ) : (
                    <SidebarLeafItem item={item} key={item.path} pathname={pathname} />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border/80 border-t px-3 py-4">
        <div className="md:hidden flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <AppProfileMenu
              contentAlign="start"
              triggerClassName="w-full justify-start border-sidebar-border/80 shadow-none"
              user={user}
            />
          </div>
          <ModeToggle />
        </div>
        <SidebarMenu className="gap-1">
          {footerLinks.map((item) => {
            const isActive = pathname === item.path;

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-sidebar-foreground/85 hover:text-sidebar-foreground h-10 rounded-xl px-3 text-sm font-medium transition-all",
                    isActive &&
                      "bg-background text-primary ring-border/70 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.9)] ring-1"
                  )}
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link to={item.path}>
                    <item.icon
                      className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")}
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <p className="text-muted-foreground px-1 pt-3 text-center text-[0.68rem] group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} {brandName}. Inc
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
