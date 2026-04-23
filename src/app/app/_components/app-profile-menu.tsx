import { ChevronDown, LogOut, Settings, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

import { ROUTES } from "@/common/constant/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import type { VariantProps } from "class-variance-authority";

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

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  {
    label: "Settings",
    icon: Settings,
    href: ROUTES.PROTECTED.SETTINGS,
  },

  {
    label: "Logout",
    icon: LogOut,
    variant: "destructive",
    onClick: () => console.log("Mock logout action"),
  },
];

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
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem
              asChild
              className="cursor-pointer border-0"
              key={item.label}
              variant={item.variant as "default" | "destructive"}
            >
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <Button onClick={item.onClick} variant={item.variant}>
                  {item.label}
                </Button>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
