import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useCreateAccountGroupMutation } from "@/api/accounts/query";
import { upsertAccountGroupSchema, type UpsertAccountGroupRequest } from "@/api/accounts/type";
import { ROUTES } from "@/common/constant/routes";
import { AppShell } from "../../_components/app-shell";
import { FormAccountGroup } from "../_components/form-account-group";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
  { text: "Create", url: ROUTES.PROTECTED.ACCOUNTS.CREATE },
];

const defaultValues = {
  name: "",
  description: "",
};

export default function Page() {
  const navigate = useNavigate();
  const { isPending, mutate } = useCreateAccountGroupMutation();
  const schema = upsertAccountGroupSchema(defaultValues);

  const handleSubmit = (value: UpsertAccountGroupRequest) => {
    mutate(value, {
      onSuccess: () => {
        toast.success("Account group created successfully");
        void navigate(ROUTES.PROTECTED.ACCOUNTS.INDEX);
      },
      onError: () => {
        toast.error("Failed to create account group");
      },
    });
  };

  return (
    <AppShell
      backTo={ROUTES.PROTECTED.ACCOUNTS.INDEX}
      breadcrumbs={breadcrumbs}
      description="Create a new account group to organize your accounts."
      title="Create Account Group"
    >
      <FormAccountGroup
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={handleSubmit}
        schema={schema}
        submitLabel="Create Group"
      />
    </AppShell>
  );
}
