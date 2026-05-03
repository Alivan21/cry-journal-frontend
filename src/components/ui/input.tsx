import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/libs/clsx";

type InputProps = React.ComponentProps<"input"> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

function Input({ className, endIcon, startIcon, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasEndIcon = Boolean(endIcon);
  const hasStartIcon = Boolean(startIcon);
  const hasTrailingContent = hasEndIcon || isPassword;
  const input = (
    <input
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-sm",
        hasStartIcon && "pl-9",
        hasTrailingContent && (hasEndIcon && isPassword ? "pr-16" : "pr-10"),
        className
      )}
      data-slot="input"
      type={inputType}
      {...props}
    />
  );

  if (!hasStartIcon && !hasTrailingContent) {
    return input;
  }

  return (
    <div className="relative">
      {hasStartIcon && (
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 flex size-4 -translate-y-1/2 items-center justify-center [&_svg]:size-4">
          {startIcon}
        </span>
      )}
      {input}
      {hasEndIcon && (
        <span
          className={cn(
            "text-muted-foreground pointer-events-none absolute top-1/2 flex size-4 -translate-y-1/2 items-center justify-center [&_svg]:size-4",
            isPassword ? "right-11" : "right-3"
          )}
        >
          {endIcon}
        </span>
      )}
      {isPassword && (
        <Button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 size-9 -translate-y-1/2"
          disabled={props.disabled}
          onClick={() => setShowPassword((current) => !current)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      )}
    </div>
  );
}

export { Input };
