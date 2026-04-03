import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/libs/clsx";
import type { ReactNode } from "react";

import { AppPageMetaProvider, useAppPageMetaValue } from "./app-page-meta";
import { AppProfileMenu } from "./app-profile-menu";
import { AppSidebar, type AppSidebarProps, type AppSidebarSection } from "./app-sidebar";
import { ModeToggle } from "./app-toogle-theme";

export type AppContainerUser = {
  name?: string;
  email?: string;
  avatarSrc?: string;
};

export type AppContainerProps = {
  children: ReactNode;
  navSections?: AppSidebarSection[];
  sidebarProps?: Omit<AppSidebarProps, "navSections" | "user">;
  className?: string;
  contentClassName?: string;
  user?: AppContainerUser;
};

function AppContainerContent({
  children,
  contentClassName,
  user,
}: Pick<AppContainerProps, "children" | "contentClassName" | "user">) {
  const { action, breadcrumbs, description, title } = useAppPageMetaValue();

  return (
    <SidebarInset className="bg-muted/22 min-h-svh">
      <header className="border-border/60 bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
        <div className="flex flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="border-border/70 bg-background rounded-xl border shadow-sm md:hidden" />

            <div className="min-w-0 flex-1">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <ModeToggle />
            <div className="hidden md:block">
              <AppProfileMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="bg-background/90 h-full max-h-dvh flex-1">
        <main className={cn("flex min-h-full flex-col gap-4 p-4 md:px-6", contentClassName)}>
          {title || description || action ? (
            <section className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                {title ? (
                  <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
                ) : null}
                {description ? (
                  <p className="text-muted-foreground mt-0.5 max-w-3xl text-sm">{description}</p>
                ) : null}
              </div>
              {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
            </section>
          ) : null}
          {children}
        </main>
      </ScrollArea>
    </SidebarInset>
  );
}

export function AppContainer({
  children,
  navSections,
  sidebarProps,
  className,
  contentClassName,
  user,
}: AppContainerProps) {
  return (
    <SidebarProvider className={cn("bg-muted/20 min-h-svh", className)}>
      <AppSidebar navSections={navSections} user={user} {...sidebarProps} />
      <AppPageMetaProvider>
        <AppContainerContent contentClassName={contentClassName} user={user}>
          {children}
        </AppContainerContent>
      </AppPageMetaProvider>
    </SidebarProvider>
  );
}
