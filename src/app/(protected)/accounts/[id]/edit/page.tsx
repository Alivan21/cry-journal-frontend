import { Suspense } from "react";
import { useParams } from "react-router";

import NotFoundPage from "@/app/404";
import { ROUTES } from "@/common/constant/routes";
import { FieldSeparator } from "@/components/ui/field";
import { LoadingState } from "@/components/ui/loading-state";
import { AppShell } from "../../../_components/app-shell";
import { FormAccountGroup } from "../../_components/form-account-group";
import { AccountSection } from "../../_components/form-account-group/account-section";
import { useEditAccountGroupForm } from "./_hooks/use-edit-account-group-form";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
  { text: "Edit", url: "" },
];

type EditAccountGroupFormProps = {
  id: string;
};

function EditAccountGroupForm({ id }: EditAccountGroupFormProps) {
  const { form, isPending, handleToggleArchiveAccount } = useEditAccountGroupForm(id);

  return (
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

          <AccountSection
            disabled={isPending}
            form={form}
            mode="edit"
            onToggleArchive={handleToggleArchiveAccount}
          />
        </div>

        <div className="border-border/60 mt-6 flex justify-end border-t pt-5">
          <form.SubmitButton isPending={isPending} pendingLabel="Saving...">
            Save changes
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  return (
    <AppShell
      backTo={ROUTES.PROTECTED.ACCOUNTS.INDEX}
      breadcrumbs={breadcrumbs}
      description="Update this account group and manage its accounts."
      title="Edit Account Group"
    >
      <Suspense
        fallback={<LoadingState count={1} title="Loading account group" variant="inline" />}
      >
        <EditAccountGroupForm id={id} />
      </Suspense>
    </AppShell>
  );
}
