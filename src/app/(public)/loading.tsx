import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading authentication page"
      className="bg-background text-foreground grid"
    >
      <section className="flex flex-col">
        <div className="flex-1">
          <div className="flex flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-3 text-center">
                <Skeleton className="mx-auto size-12 rounded-2xl" />
                <Skeleton className="mx-auto h-7 w-48" />
                <Skeleton className="mx-auto h-4 w-72 max-w-full" />
              </div>

              <div className="border-border bg-card rounded-3xl border p-6 shadow-sm sm:p-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>

              <Skeleton className="mx-auto h-4 w-64 max-w-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
