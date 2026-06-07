import { Suspense } from "react";
import { useParams } from "react-router";

import NotFoundPage from "@/app/404";
import { ROUTES } from "@/common/constant/routes";
import { LoadingState } from "@/components/ui/loading-state";
import { AppShell } from "../../../../_components/app-shell";
import { FormAccount } from "./_components/form-account";
import { useEditAccountForm } from "./_hooks/use-edit-account-form";

type EditAccountFormProps = {
  groupId: string;
  accountId: string;
};

function EditAccountForm({ groupId, accountId }: EditAccountFormProps) {
  const { form, isPending } = useEditAccountForm({ groupId, accountId });

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
        <FormAccount disabled={isPending} form={form} />

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
  const { id, accountId } = useParams<{ id: string; accountId: string }>();

  if (!id || !accountId) {
    return <NotFoundPage />;
  }

  const breadcrumbs = [
    { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
    { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
    { text: "Edit account", url: ROUTES.PROTECTED.ACCOUNTS.EDIT_ACCOUNT(id, accountId) },
  ];

  return (
    <AppShell
      backTo={ROUTES.PROTECTED.ACCOUNTS.DETAIL(id)}
      breadcrumbs={breadcrumbs}
      description="Update this account's details and trading settings."
      title="Edit Account"
    >
      <Suspense
        fallback={<LoadingState count={1} title="Loading account" variant="inline" />}
      >
        <EditAccountForm accountId={accountId} groupId={id} />
      </Suspense>
    </AppShell>
  );
}
