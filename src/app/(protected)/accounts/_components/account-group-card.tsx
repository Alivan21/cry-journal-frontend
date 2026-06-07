import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/libs/clsx";
import type { KeyboardEvent } from "react";

type AccountGroupCardProps = {
  name: string;
  description: string;
  accountCount?: number;
  updatedAt?: string;
  actions?: ActionMenuItem[];
  onClick?: () => void;
};

export function AccountGroupCard({
  name,
  description,
  accountCount,
  updatedAt,
  actions,
  onClick,
}: AccountGroupCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(onClick && "hover:cursor-pointer")}
      interactive
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardContent className="gap-1">
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
      </CardContent>

      <CardFooter className="justify-between">
        {updatedAt ? <span>Updated {updatedAt}</span> : null}
        <span className="text-foreground font-medium">View accounts →</span>
      </CardFooter>
    </Card>
  );
}
