import { ROUTES } from "@/common/constant/routes";
import { FieldSeparator } from "@/components/ui/field";
import { AppShell } from "../../_components/app-shell";
import { FormAccountGroup } from "../_components/form-account-group";
import { AccountSection } from "../_components/form-account-group/account-section";
import { useCreateAccountGroupForm } from "./_hooks/use-create-account-group-form";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
  { text: "Create", url: ROUTES.PROTECTED.ACCOUNTS.CREATE },
];

export default function Page() {
  const { form, isPending } = useCreateAccountGroupForm();

  return (
    <AppShell
      backTo={ROUTES.PROTECTED.ACCOUNTS.INDEX}
      breadcrumbs={breadcrumbs}
      description="Create a new account group to organize your accounts."
      title="Create Account Group"
    >
      <form
        className="border-border/60 bg-card/40 rounded-xl border p-5 shadow-sm backdrop-blur-sm"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppForm>
          <div className="space-y-6">
            <FormAccountGroup disabled={isPending} form={form} />

            <FieldSeparator className="my-1">Accounts</FieldSeparator>

            <AccountSection disabled={isPending} form={form} />
          </div>

          <div className="border-border/60 mt-6 flex justify-end border-t pt-5">
            <form.SubmitButton isPending={isPending} pendingLabel="Creating...">
              Create account group
            </form.SubmitButton>
          </div>
        </form.AppForm>
      </form>
    </AppShell>
  );
}
