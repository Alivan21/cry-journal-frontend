import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  useBulkCreateAccountsMutation,
  useCreateAccountGroupMutation,
} from "@/api/accounts/query";
import {
  createAccountGroupFormSchema,
  type CreateAccountGroupFormValues,
} from "@/api/accounts/type";
import { ROUTES } from "@/common/constant/routes";
import { useAppForm } from "@/components/forms";

const defaultValues: CreateAccountGroupFormValues = {
  name: "",
  description: "",
  accounts: [],
};

function useCreateAccountGroupForm() {
  const navigate = useNavigate();
  const createGroupMutation = useCreateAccountGroupMutation();
  const bulkCreateAccountsMutation = useBulkCreateAccountsMutation();
  const schema = createAccountGroupFormSchema(defaultValues);

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account group...");

      try {
        const groupResponse = await createGroupMutation.mutateAsync({
          name: value.name,
          description: value.description,
        });
        const groupId = groupResponse.data.id;

        if (value.accounts.length > 0) {
          toast.loading("Creating accounts...", { id: toastId });

          await bulkCreateAccountsMutation.mutateAsync(
            value.accounts.map((account) => ({
              ...account,
              groupId,
            }))
          );
        }

        toast.success(
          value.accounts.length > 0
            ? `Account group created with ${value.accounts.length} account${value.accounts.length > 1 ? "s" : ""}.`
            : "Account group created successfully.",
          { id: toastId }
        );

        void navigate(ROUTES.PROTECTED.ACCOUNTS.INDEX);
      } catch {
        toast.error("Failed to create account group. Please try again.", { id: toastId });
      }
    },
  });

  const isPending = createGroupMutation.isPending || bulkCreateAccountsMutation.isPending;

  return { form, isPending };
}

type AccountGroupFormApi = ReturnType<typeof useCreateAccountGroupForm>["form"];

export { defaultValues, useCreateAccountGroupForm, type AccountGroupFormApi };
