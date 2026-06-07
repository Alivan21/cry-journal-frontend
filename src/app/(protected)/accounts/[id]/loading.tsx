import { Skeleton } from "@/components/ui/skeleton";

function AccountGroupSummarySkeleton() {
  return (
    <section className="border-border/60 bg-card/40 space-y-4 rounded-xl border p-5 shadow-sm backdrop-blur-sm">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-4/5 max-w-xl" />
      </div>

      <div className="border-border/60 grid gap-4 border-t pt-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            className="border-border/60 bg-muted/15 flex items-center gap-3 rounded-lg border px-3 py-2.5"
            key={item}
          >
            <Skeleton className="size-4 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountCardSkeleton() {
  return (
    <div className="border-border bg-card/80 flex h-full flex-col overflow-hidden rounded-xl border shadow-lg">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="size-8 rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-2.5">
          {[0, 1, 2, 3].map((item) => (
            <div className="flex items-center gap-2.5" key={item}>
              <Skeleton className="size-3.5 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-border/60 flex min-h-9 items-center justify-end border-t px-4 py-2">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

function AccountsSectionSkeleton() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <AccountCardSkeleton key={item} />
        ))}
      </div>
    </section>
  );
}

export default function AccountGroupDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading account group" className="space-y-6" role="status">
      <section className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-8 w-52" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </section>

      <AccountGroupSummarySkeleton />
      <AccountsSectionSkeleton />
    </div>
  );
}
