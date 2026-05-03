import { BookOpenText, Brain, LineChart, Sparkles } from "lucide-react";
import { Outlet } from "react-router";

import { ScrollArea } from "@/components/ui/scroll-area";

const featureChips = ["Journal", "Mood", "Insights", "Growth"];

export default function AuthLayout() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:overflow-hidden">
      <section className="hidden p-4 lg:block lg:h-dvh lg:min-h-0">
        <div className="border-border bg-card relative flex h-full overflow-hidden rounded-3xl border">
          <div className="bg-muted absolute inset-0" />
          <div className="absolute inset-0 opacity-80">
            <div className="bg-primary/20 absolute -top-24 -left-20 size-72 rounded-full blur-3xl" />
            <div className="bg-accent/20 absolute right-10 bottom-10 size-80 rounded-full blur-3xl" />
            <div className="from-background via-background/70 absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t to-transparent" />
          </div>
          <div className="relative z-10 flex w-full flex-col justify-between p-8">
            <div className="flex items-center gap-3">
              <div className="border-border bg-background/80 text-primary flex size-10 items-center justify-center rounded-2xl border shadow-sm">
                <BookOpenText className="size-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Cry Journal</span>
            </div>

            <div className="max-w-xl space-y-5">
              <div className="border-border bg-background/80 text-primary flex size-14 items-center justify-center rounded-3xl border shadow-sm">
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
                <div className="border-border bg-background/70 rounded-2xl border p-4">
                  <Brain className="text-primary mb-3 size-5" />
                  <p className="text-sm font-medium">Understand your mood</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    Track thoughts and feelings with daily context.
                  </p>
                </div>
                <div className="border-border bg-background/70 rounded-2xl border p-4">
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
                  className="border-border bg-background/70 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase"
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
