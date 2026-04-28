import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SquareChartGantt,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { Link, matchPath, NavLink, useLocation, useMatch } from "react-router";

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

const DEFAULT_BRAND_NAME = "Cry Journal";

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

const EMPTY_FOOTER_LINKS: AppSidebarFooterLink[] = [];

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
    setTruncated(isTextOverflowing(el));
  });

  React.useLayoutEffect(() => {
    if (!enabled) return;
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

  // `enabled && truncated` derives the tooltip state without a synchronous
  // setState call in an effect — when disabled, skip the tooltip regardless
  // of the last measured value.
  if (!enabled || !truncated) {
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

function SidebarLeafItem({ item }: { item: AppSidebarLeafRoute }) {
  const { state } = useSidebar();
  // useMatch gives React Router's own interpretation of "active" (handles params,
  // trailing slashes, etc.) rather than a raw string comparison.
  const isActive = Boolean(useMatch({ path: item.path, end: true }));

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
        <NavLink className="flex w-full min-w-0 items-center gap-2" to={item.path}>
          <item.icon
            className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
          />
          <EllipsisTooltip
            className={cn("flex-1", isActive ? "text-primary" : "text-sidebar-foreground")}
            enabled={state === "expanded"}
            text={item.title}
          />
          <NavBadge badge={item.badge} />
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarCollapsibleItem({ item }: { item: AppSidebarParentRoute }) {
  const { state } = useSidebar();
  // matchPath is a plain utility (not a hook), safe to call inside .some() / .map()
  const { pathname } = useLocation();
  const hasActiveChild = item.children.some((child) =>
    Boolean(matchPath({ path: child.path, end: true }, pathname))
  );
  const [manuallyOpen, setManuallyOpen] = React.useState(false);
  const open = hasActiveChild || manuallyOpen;

  return (
    <SidebarMenuItem>
      <Collapsible onOpenChange={setManuallyOpen} open={open}>
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
              const isActive = Boolean(matchPath({ path: child.path, end: true }, pathname));

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
                    <NavLink className="flex w-full min-w-0 items-center gap-2" to={child.path}>
                      <EllipsisTooltip
                        className="min-w-0 flex-1"
                        enabled={state === "expanded"}
                        text={child.title}
                      />
                    </NavLink>
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

/** Footer navigation item — extracted so it can call `useMatch` as a hook. */
function FooterLinkItem({ item }: { item: AppSidebarFooterLink }) {
  const isActive = Boolean(useMatch({ path: item.path, end: true }));

  return (
    <SidebarMenuItem>
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
        <NavLink to={item.path}>
          <item.icon
            className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")}
          />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
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
  footerLinks = EMPTY_FOOTER_LINKS,
  brandName = DEFAULT_BRAND_NAME,
  user,
}: AppSidebarProps) {
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
            <Link className="flex min-w-0 items-center gap-2" to={ROUTES.PROTECTED.DASHBOARD}>
              <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
                <SquareChartGantt className="text-primary" />
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
                    <SidebarCollapsibleItem item={item} key={item.title} />
                  ) : (
                    <SidebarLeafItem item={item} key={item.path} />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border/80 border-t px-3 pt-2 pb-4">
        <div className="flex items-center gap-2 md:hidden">
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
          {footerLinks.map((item) => (
            <FooterLinkItem item={item} key={item.path} />
          ))}
        </SidebarMenu>
        <p className="text-muted-foreground px-1 pt-3 text-center text-[0.68rem] group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} {brandName}. Inc
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
