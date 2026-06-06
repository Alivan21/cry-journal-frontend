import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/libs/clsx";

type AccountGroupCardProps = {
  name: string;
  description: string;
  accountCount?: number;
  updatedAt?: string;
  actions?: ActionMenuItem[];
};

export function AccountGroupCard({
  name,
  description,
  accountCount,
  updatedAt,
  actions,
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
      <div className="relative z-10 flex flex-1 flex-col gap-1 p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge className="rounded-full font-normal" variant="secondary">
            {accountCount ?? 0} {accountCount && accountCount > 1 ? "Accounts" : "Account"}
          </Badge>
          <div className="flex items-center gap-1">
            {actions?.length ? <ActionMenu actions={actions} /> : null}
          </div>
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
