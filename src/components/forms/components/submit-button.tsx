import { Button } from "@/components/ui/button";
import { useFormContext } from "../form-context";

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "type" | "disabled"> & {
  isPending?: boolean;
  pendingLabel?: string;
};

function SubmitButton({
  children,
  isPending = false,
  pendingLabel,
  ...buttonProps
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {(state) => {
        const isLoading = state.isSubmitting || isPending;

        return (
          <Button
            disabled={!state.canSubmit || isLoading}
            type="submit"
            {...buttonProps}
          >
            {isLoading ? (pendingLabel ?? children) : children}
          </Button>
        );
      }}
    </form.Subscribe>
  );
}

export { SubmitButton, type SubmitButtonProps };
