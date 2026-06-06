import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/libs/clsx";
import type { ReactNode } from "react";

type LoadingStateVariant = "inline" | "card-grid";

type LoadingStateProps = React.ComponentProps<"section"> & {
  title?: string;
  description?: ReactNode;
  variant?: LoadingStateVariant;
  count?: number;
};

function CardGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          className="border-border bg-card/80 flex h-full flex-col overflow-hidden rounded-xl border shadow-lg"
          key={index}
        >
          <div className="flex flex-1 flex-col p-4">
            <Skeleton className="mb-2 size-10 rounded-lg" />
            <Skeleton className="mb-1.5 h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
          </div>
          <div className="border-border/60 flex min-h-9 items-center justify-end border-t px-4 py-2">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingState({
  className,
  count = 6,
  description,
  title = "Loading",
  variant = "inline",
  ...props
}: LoadingStateProps) {
  if (variant === "card-grid") {
    return (
      <section
        aria-busy="true"
        aria-label={title}
        className={cn("w-full", className)}
        role="status"
        {...props}
      >
        <span className="sr-only">{title}</span>
        <CardGridSkeleton count={count} />
      </section>
    );
  }

  return (
    <section
      aria-busy="true"
      aria-label={title}
      className={cn(
        "border-border bg-card/80 flex min-h-[240px] rounded-2xl border px-5 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_22px_60px_-46px_rgba(15,23,42,0.9)] backdrop-blur-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_22px_60px_-46px_rgba(0,0,0,1)]",
        className
      )}
      role="status"
      {...props}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center text-center">
        <div className="border-border bg-background/80 mb-5 flex size-14 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_42px_-30px_rgba(15,23,42,0.9)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_42px_-30px_rgba(0,0,0,1)]">
          <Loader2 aria-hidden className="text-primary size-5 animate-spin" />
        </div>

        <p className="font-heading text-foreground text-lg font-semibold tracking-tight">{title}</p>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
