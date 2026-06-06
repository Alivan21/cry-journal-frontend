import { cn } from "@/libs/clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = React.ComponentProps<"section"> & {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  eyebrow,
  icon: Icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "border-border bg-card/80 flex min-h-[320px] rounded-2xl border px-5 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_22px_60px_-46px_rgba(15,23,42,0.9)] backdrop-blur-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_22px_60px_-46px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center text-center">
        <div className="border-border bg-background/80 mb-6 flex size-16 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_42px_-30px_rgba(15,23,42,0.9)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_42px_-30px_rgba(0,0,0,1)]">
          <Icon className="text-primary size-6" />
        </div>

        {eyebrow ? (
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.32em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-foreground max-w-md text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-6 text-pretty md:text-base">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">{action}</div>
        ) : null}
      </div>
    </section>
  );
}
