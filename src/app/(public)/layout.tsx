import { BookOpenText, Brain, LineChart, Sparkles } from "lucide-react";
import { Outlet } from "react-router";

import { ScrollArea } from "@/components/ui/scroll-area";

const featureChips = ["Journal", "Mood", "Insights", "Growth"];

export default function AuthLayout() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:overflow-hidden">
      <section className="hidden p-4 lg:block lg:h-dvh lg:min-h-0">
        <div className="border-border bg-card/95 relative flex h-full overflow-hidden rounded-3xl border shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] ring-1 ring-border/60 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:z-20 before:h-px before:bg-linear-to-r before:from-transparent before:via-foreground/10 before:to-transparent dark:shadow-[0_28px_80px_-40px_rgba(15,23,42,0.9)]">
          <div className="relative z-10 flex w-full flex-col justify-between p-8">
            <div className="flex items-center gap-3">
              <div className="border-border bg-background/85 text-primary flex size-10 items-center justify-center rounded-2xl border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)] ring-1 ring-border/60 backdrop-blur-sm">
                <BookOpenText className="size-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Cry Journal</span>
            </div>

            <div className="max-w-xl space-y-5">
              <div className="border-border bg-background/85 text-primary flex size-14 items-center justify-center rounded-3xl border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)] ring-1 ring-border/60 backdrop-blur-sm">
                <Sparkles className="size-7" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl leading-tight font-semibold tracking-tight">
                  Make room for what you feel.
                </h1>
                <p className="text-muted-foreground max-w-md text-sm leading-6">
                  Capture emotional check-ins, reflect on your patterns, and turn quiet moments into
                  gentle insight.
                </p>
              </div>

              <div className="grid max-w-md grid-cols-2 gap-3">
                <div className="border-border bg-background/80 rounded-2xl border p-4 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45)] ring-1 ring-border/50 backdrop-blur-sm">
                  <Brain className="text-primary mb-3 size-5" />
                  <p className="text-sm font-medium">Understand your mood</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    Track thoughts and feelings with daily context.
                  </p>
                </div>
                <div className="border-border bg-background/80 rounded-2xl border p-4 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45)] ring-1 ring-border/50 backdrop-blur-sm">
                  <LineChart className="text-primary mb-3 size-5" />
                  <p className="text-sm font-medium">Notice patterns</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    Review emotional trends without losing the story.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {featureChips.map((chip) => (
                <span
                  className="border-border bg-background/75 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase ring-1 ring-border/50 backdrop-blur-sm"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col lg:h-dvh lg:min-h-0">
        <ScrollArea className="min-h-dvh flex-1 lg:h-full lg:min-h-0">
          <div className="flex min-h-full flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <Outlet />
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
