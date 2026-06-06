import { MoreVertical, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/clsx";

type ActionMenuItem = {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
};

type ActionMenuProps = {
  actions: ActionMenuItem[];
  align?: "start" | "center" | "end";
  className?: string;
};

function ActionMenu({ actions, align = "end", className }: ActionMenuProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open actions"
          className={cn("text-muted-foreground shrink-0", className)}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          size="icon-sm"
          variant="ghost"
        >
          <MoreVertical />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} onClick={(event) => event.stopPropagation()}>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={action.disabled}
              key={action.label}
              onSelect={() => action.onClick()}
              variant={action.variant}
            >
              {Icon ? <Icon /> : null}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ActionMenu, type ActionMenuItem, type ActionMenuProps };
