import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Link } from "react-router";

import { ROUTES } from "@/common/constant/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/clsx";

import type { AppContainerUser } from "./app-container";

function getInitials(name?: string) {
  if (!name) return "CR";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "CR";
}

export type AppProfileMenuProps = {
  user?: AppContainerUser;
  triggerClassName?: string;
  contentAlign?: "start" | "end" | "center";
};

export function AppProfileMenu({
  user,
  triggerClassName,
  contentAlign = "end",
}: AppProfileMenuProps) {
  const displayName = user?.name || "Profile";
  const displayEmail = user?.email || "Add account details";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "border-border/60 bg-background h-11 rounded-xl px-3 shadow-sm",
            triggerClassName
          )}
          type="button"
          variant="outline"
        >
          <Avatar className="bg-muted text-primary" size="sm">
            {user?.avatarSrc ? <AvatarImage alt={displayName} src={user.avatarSrc} /> : null}
            <AvatarFallback delayMs={0}>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className="max-w-32 truncate">{displayName}</span>
          <ChevronDown className="text-muted-foreground ml-auto size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={contentAlign} className="w-42">
        <DropdownMenuLabel className="py-2">
          <div className="flex flex-col">
            <span className="text-foreground truncate text-sm font-medium">{displayName}</span>
            <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={ROUTES.PROTECTED.SETTINGS}>
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => console.log("Mock logout action")}
            variant="destructive"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
