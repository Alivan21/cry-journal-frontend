import { Badge } from "@/components/ui/badge";
import { cn } from "@/libs/clsx";
import type { LucideIcon } from "lucide-react";

type Tone = "success" | "info" | "primary";

type AccountGroupCardProps = {
  name: string;
  description: string;
  accountCount?: number;
  icon: LucideIcon;
  tone?: Tone;
  updatedAt?: string;
};

const toneStyles: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  primary: "bg-primary/10 text-primary",
};

export function AccountGroupCard({
  name,
  description,
  accountCount,
  icon: Icon,
  tone = "primary",
  updatedAt,
}: AccountGroupCardProps) {
  return (
    <div
      className={cn(
        "group border-border relative flex h-full flex-col overflow-hidden rounded-xl border",
        "transition-all hover:-translate-y-0.5",
        "shadow-lg",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
        "before:bg-[linear-gradient(180deg,color-mix(in_oklch,white_6%,transparent)_0%,transparent_40%)]",
        "hover:cursor-pointer"
      )}
    >
      <div className="relative z-10 flex flex-1 flex-col p-4">
        <div className="mb-2 flex min-h-10 items-start justify-between">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              toneStyles[tone]
            )}
          >
            <Icon className="size-4" />
          </div>
          {accountCount ? (
            <Badge className="rounded-full font-normal" variant="secondary">
              {accountCount} accounts
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="font-heading text-foreground line-clamp-1 min-h-6 text-base font-semibold">
            {name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 min-h-11.5 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="border-border/60 text-muted-foreground relative z-10 flex min-h-9 shrink-0 items-center justify-between border-t px-4 py-2 text-xs">
        {updatedAt ? <span>Updated {updatedAt}</span> : null}
        <span className="text-foreground font-medium">View accounts →</span>
      </div>
    </div>
  );
}
