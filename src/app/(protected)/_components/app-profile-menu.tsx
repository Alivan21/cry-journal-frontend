import { ChevronDown, Loader2, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { toast } from "sonner";
import { useLogoutMutation } from "@/api/auth/query";
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
import { useAppSession } from "@/stores/app-session/hooks";

import type { AppProfileMenuProps } from "./type";

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

export function AppProfileMenu({ triggerClassName, contentAlign = "end" }: AppProfileMenuProps) {
  const { sessionCleared, status, user } = useAppSession();
  const navigate = useNavigate();
  const { isPending, mutate: logout } = useLogoutMutation();

  const displayName = user?.name ?? "Profile";
  const displayEmail = user?.email ?? "Add account details";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        sessionCleared();
        void navigate(ROUTES.PUBLIC.LOGIN);
        toast.success("Logout Successfully");
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "border-border/60 bg-background h-11 rounded-xl px-3 shadow-sm",
            triggerClassName
          )}
          disabled={isPending || status === "loading"}
          type="button"
          variant="outline"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Avatar className="bg-muted text-primary" size="sm">
                {user?.avatarSrc ? <AvatarImage alt={displayName} src={user.avatarSrc} /> : null}
                <AvatarFallback delayMs={0}>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <span className="max-w-32 truncate">{displayName}</span>
              <ChevronDown className="text-muted-foreground ml-auto size-4 shrink-0" />
            </>
          )}
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
            disabled={isPending}
            onClick={handleLogout}
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
