import { BookOpenText, Brain, LineChart, Loader2 } from "lucide-react";

const loadingHints = [
  {
    description: "Daily check-ins help you name what you feel.",
    icon: Brain,
    title: "Understand your mood",
  },
  {
    description: "Trends emerge when moments are captured over time.",
    icon: LineChart,
    title: "Notice patterns",
  },
] as const;

export default function RootLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading Cry Journal"
      className="bg-background text-foreground relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10"
      role="status"
    >
      <div
        aria-hidden
        className="bg-primary/6 pointer-events-none absolute top-[-12%] left-1/2 size-[min(72vw,28rem)] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-muted/40 pointer-events-none absolute right-[-8%] bottom-[-10%] size-56 rounded-full blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="border-border bg-card/90 rounded-3xl border p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_28px_80px_-44px_rgba(15,23,42,0.85)] ring-1 ring-border/60 backdrop-blur-xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_80px_-44px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center text-center">
            <div className="border-border bg-background/85 text-primary mb-6 flex size-14 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_42px_-30px_rgba(15,23,42,0.9)] ring-1 ring-border/60 backdrop-blur-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_42px_-30px_rgba(0,0,0,1)]">
              <Loader2 aria-hidden className="size-6 animate-spin" />
            </div>

            <div className="mb-1 flex items-center justify-center gap-2">
              <BookOpenText aria-hidden className="text-primary size-4" />
              <span className="text-sm font-medium tracking-wide">Cry Journal</span>
            </div>

            <h1 className="font-heading text-foreground text-xl font-semibold tracking-tight">
              Preparing your workspace
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6">
              Setting up your journal, mood tools, and insights. This usually takes just a moment.
            </p>
          </div>

          <div className="border-border/70 mt-8 space-y-3 border-t pt-6">
            <p className="text-muted-foreground text-center text-xs font-medium tracking-wide uppercase">
              While you wait
            </p>
            {loadingHints.map((hint) => (
              <div
                className="border-border bg-background/75 flex items-start gap-3 rounded-2xl border p-3.5 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45)] ring-1 ring-border/50 backdrop-blur-sm"
                key={hint.title}
              >
                <div className="border-border bg-card text-primary flex size-9 shrink-0 items-center justify-center rounded-xl border">
                  <hint.icon aria-hidden className="size-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium">{hint.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-5">{hint.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground mt-5 text-center text-xs">
          Make room for what you feel.
        </p>
      </div>

      <span className="sr-only">Loading Cry Journal. Preparing your workspace.</span>
    </main>
  );
}
