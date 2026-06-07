import { useNavigate } from "react-router";
import { toast } from "sonner";

import { accountGroupQueries, useUpdateAccountGroupMutation } from "@/api/account-groups/query";
import {
  createAccountGroupFormSchema,
  type AccountRowFormValues,
  type CreateAccountGroupFormValues,
} from "@/api/account-groups/type";
import {
  accountQueries,
  useArchiveAccountMutation,
  useBulkCreateAccountsMutation,
  useBulkUpdateAccountsMutation,
  useRestoreAccountMutation,
} from "@/api/accounts/query";
import { ROUTES } from "@/common/constant/routes";
import { useAppForm } from "@/components/forms";
import { useSuspenseQuery } from "@/hooks/request/use-suspense-query";

function useEditAccountGroupForm(id: string) {
  const navigate = useNavigate();
  const { data: groupData } = useSuspenseQuery(accountGroupQueries.getAccountGroupQuery(id));
  const { data: activeAccountsData } = useSuspenseQuery(accountQueries.getAccountsQuery(id, false));
  const { data: archivedAccountsData } = useSuspenseQuery(accountQueries.getAccountsQuery(id, true));

  const group = groupData.data;
  const mapAccountToRow = (
    account: (typeof activeAccountsData.data)[number],
    archived: boolean
  ): AccountRowFormValues => ({
    id: account.id,
    archived,
    name: account.name,
    broker: account.broker,
    accountType: account.accountType,
    baseCurrency: account.baseCurrency,
    timezone: account.timezone,
    startingBalance: account.startingBalance,
  });

  const defaultValues: CreateAccountGroupFormValues = {
    name: group.name,
    description: group.description,
    accounts: [
      ...activeAccountsData.data.map((account) => mapAccountToRow(account, false)),
      ...archivedAccountsData.data.map((account) => mapAccountToRow(account, true)),
    ],
  };

  const updateGroupMutation = useUpdateAccountGroupMutation(id);
  const bulkUpdateAccountsMutation = useBulkUpdateAccountsMutation();
  const bulkCreateAccountsMutation = useBulkCreateAccountsMutation();
  const archiveAccountMutation = useArchiveAccountMutation();
  const restoreAccountMutation = useRestoreAccountMutation();
  const schema = createAccountGroupFormSchema(group);

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving account group...");

      try {
        await updateGroupMutation.mutateAsync({
          name: value.name,
          description: value.description,
        });

        const existingAccounts = value.accounts.filter(
          (account): account is AccountRowFormValues & { id: string } =>
            Boolean(account.id) && !account.archived
        );
        const newAccounts = value.accounts.filter((account) => !account.id);

        if (existingAccounts.length > 0) {
          toast.loading("Updating accounts...", { id: toastId });

          await bulkUpdateAccountsMutation.mutateAsync(
            existingAccounts.map((account) => ({
              id: account.id,
              name: account.name,
              broker: account.broker,
              accountType: account.accountType,
              baseCurrency: account.baseCurrency,
              timezone: account.timezone,
              startingBalance: account.startingBalance,
              groupId: id,
            }))
          );
        }

        if (newAccounts.length > 0) {
          toast.loading("Creating accounts...", { id: toastId });

          await bulkCreateAccountsMutation.mutateAsync(
            newAccounts.map(({ id: _id, ...account }) => ({
              ...account,
              groupId: id,
            }))
          );
        }

        toast.success("Account group updated successfully.", { id: toastId });
        void navigate(ROUTES.PROTECTED.ACCOUNTS.INDEX);
      } catch {
        toast.error("Failed to update account group. Please try again.", { id: toastId });
      }
    },
  });

  const handleToggleArchiveAccount = async (index: number) => {
    const accounts = form.getFieldValue("accounts");
    const account = accounts[index];

    if (!account?.id) return;

    const isArchived = Boolean(account.archived);
    const toastId = toast.loading(isArchived ? "Restoring account..." : "Archiving account...");

    try {
      if (isArchived) {
        await restoreAccountMutation.mutateAsync(account.id);
        form.setFieldValue(`accounts[${index}].archived`, false);
        toast.success("Account restored successfully.", { id: toastId });
      } else {
        await archiveAccountMutation.mutateAsync(account.id);
        form.setFieldValue(`accounts[${index}].archived`, true);
        toast.success("Account archived successfully.", { id: toastId });
      }
    } catch {
      toast.error(
        isArchived
          ? "Failed to restore account. Please try again."
          : "Failed to archive account. Please try again.",
        { id: toastId }
      );
      throw new Error(isArchived ? "Failed to restore account" : "Failed to archive account");
    }
  };

  const isPending =
    updateGroupMutation.isPending ||
    bulkUpdateAccountsMutation.isPending ||
    bulkCreateAccountsMutation.isPending ||
    archiveAccountMutation.isPending ||
    restoreAccountMutation.isPending;

  return { form, isPending, handleToggleArchiveAccount };
}

export { useEditAccountGroupForm };
