import { useNavigation } from "react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/libs/clsx";
import { useAppPageMeta } from "@/stores/app-page-meta";
import { AppSessionSync } from "@/stores/app-session";

import type { AppContainerProps } from "./type";
import { AppProfileMenu } from "./app-profile-menu";
import { AppSidebar } from "./app-sidebar";
import { ModeToggle } from "./app-toogle-theme";

function AppContainerContent({
  children,
  contentClassName,
}: React.PropsWithChildren<Pick<AppContainerProps, "contentClassName">>) {
  const { action, breadcrumbs, description, title } = useAppPageMeta();
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <SidebarInset className="min-h-dvh bg-transparent">
      {isNavigating && (
        <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] overflow-hidden">
          <div className="bg-primary h-full w-full origin-left animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>
      )}
      <header className="border-border/60 bg-background/78 sticky top-0 z-20 border-b shadow-[0_18px_44px_-34px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 pt-3 pb-1.5 md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="border-border/70 bg-card/80 border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)] backdrop-blur-sm md:hidden" />

            <div className="min-w-0 flex-1">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <div className="hidden md:block">
              <AppProfileMenu />
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="h-full max-h-dvh flex-1">
        <main
          className={cn(
            "mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-6 px-4 py-5 md:px-6 md:py-6",
            contentClassName
          )}
        >
          {title || description || action ? (
            <section className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                {title ? (
                  <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
                ) : null}
                {description ? (
                  <p className="text-muted-foreground max-w-3xl text-sm leading-6">{description}</p>
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
  className,
  contentClassName,
}: React.PropsWithChildren<AppContainerProps>) {
  return (
    <SidebarProvider className={cn("bg-background text-foreground min-h-dvh", className)}>
      <AppSessionSync />
      <AppSidebar />
      <AppContainerContent contentClassName={contentClassName}>{children}</AppContainerContent>
    </SidebarProvider>
  );
}
