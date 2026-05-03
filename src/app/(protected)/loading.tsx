import { Skeleton } from "@/components/ui/skeleton";

function SidebarNavSkeleton() {
  return (
    <div className="px-3 py-2">
      {[0, 1].map((section) => (
        <div className="py-2" key={section}>
          <Skeleton className="mx-3 mb-3 h-3 w-24" />
          <div className="space-y-1">
            {[0, 1, 2].map((item) => (
              <div className="flex h-11 items-center gap-3 rounded-xl px-3" key={item}>
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentCardSkeleton() {
  return (
    <div className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52 max-w-full" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((item) => (
          <div className="flex items-center gap-3" key={item}>
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-7/12" />
              <Skeleton className="h-3 w-10/12" />
            </div>
            <Skeleton className="hidden h-8 w-20 rounded-lg sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading app"
      className="bg-background text-foreground flex min-h-svh w-full"
    >
      <aside className="border-sidebar-border/80 bg-sidebar/95 hidden w-64 shrink-0 border-r md:flex md:flex-col lg:w-56 xl:w-64">
        <div className="border-sidebar-border/80 flex items-center justify-between gap-3 border-b px-4 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="size-9 rounded-xl" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <SidebarNavSkeleton />
        </div>

        <div className="border-sidebar-border/80 space-y-3 border-t px-3 pt-2 pb-4">
          <div className="space-y-1">
            {[0, 1].map((item) => (
              <div className="flex h-10 items-center gap-3 rounded-xl px-3" key={item}>
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
          <Skeleton className="mx-auto h-3 w-32" />
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col bg-transparent">
        <header className="border-border/60 bg-background/78 sticky top-0 z-20 border-b shadow-[0_18px_44px_-34px_rgba(15,23,42,0.85)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 pt-3 pb-1.5 md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton className="size-10 rounded-xl md:hidden" />
              <div className="flex min-w-0 items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="size-1.5 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Skeleton className="hidden size-11 rounded-xl md:block" />
              <Skeleton className="hidden h-11 w-36 rounded-xl md:block" />
            </div>
          </div>
        </header>

        <div className="h-full max-h-dvh flex-1 overflow-hidden">
          <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-6 px-4 py-5 md:px-6 md:py-6">
            <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-4 w-full max-w-2xl" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm" key={item}>
                  <Skeleton className="mb-4 size-10 rounded-xl" />
                  <Skeleton className="mb-2 h-5 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)]">
              <ContentCardSkeleton />
              <div className="border-border/70 bg-card rounded-2xl border p-5 shadow-sm">
                <Skeleton className="mb-5 h-5 w-32" />
                <div className="space-y-4">
                  {[0, 1, 2].map((item) => (
                    <div className="space-y-2" key={item}>
                      <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
