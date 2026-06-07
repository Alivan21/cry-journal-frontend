import { useNavigate } from "react-router";
import { toast } from "sonner";

import { accountQueries, useUpdateAccountMutation } from "@/api/accounts/query";
import { upsertAccountSchema, type UpsertAccountRequest } from "@/api/accounts/type";
import { ROUTES } from "@/common/constant/routes";
import { useAppForm } from "@/components/forms";
import { useSuspenseQuery } from "@/hooks/request/use-suspense-query";
import type z from "zod";

type UseEditAccountFormParams = {
  groupId: string;
  accountId: string;
};

const editAccountSchema = upsertAccountSchema({});
type EditAccountFormValues = Pick<
  z.infer<typeof editAccountSchema>,
  "name" | "broker" | "accountType" | "baseCurrency" | "timezone" | "startingBalance"
>;

function useEditAccountForm({ groupId, accountId }: UseEditAccountFormParams) {
  const navigate = useNavigate();
  const { data: accountData } = useSuspenseQuery(accountQueries.getAccountQuery(accountId));
  const account = accountData.data;

  const defaultValues: EditAccountFormValues = {
    name: account.name,
    broker: account.broker,
    accountType: account.accountType,
    baseCurrency: account.baseCurrency,
    timezone: account.timezone,
    startingBalance: account.startingBalance,
  };

  const updateAccountMutation = useUpdateAccountMutation(accountId);

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: editAccountSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving account...");

      try {
        const payload: UpsertAccountRequest = {
          ...value,
          groupId,
        };

        await updateAccountMutation.mutateAsync(payload);

        toast.success("Account updated successfully.", { id: toastId });
        void navigate(ROUTES.PROTECTED.ACCOUNTS.DETAIL(groupId));
      } catch {
        toast.error("Failed to update account. Please try again.", { id: toastId });
      }
    },
  });

  return {
    form,
    isPending: updateAccountMutation.isPending,
    accountName: account.name,
  };
}

type AccountFormApi = ReturnType<typeof useEditAccountForm>["form"];

export { useEditAccountForm, type AccountFormApi };
