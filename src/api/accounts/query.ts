import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/tanstack-query/query-client";
import type { UpsertAccountGroupRequest, UpsertAccountRequest } from "./type";
import {
  archiveAccount,
  bulkCreateAccounts,
  bulkUpdateAccounts,
  createAccount,
  createAccountGroup,
  getAccountBrokers,
  getAccountCurrencies,
  getAccountGroups,
  getAccounts,
  getAccountTimezones,
  getAccountTypes,
  restoreAccount,
  updateAccount,
  updateAccountGroup,
} from "./route";

const accountQueries = {
  all: () => ["account-groups"],
  accounts: () => [...accountQueries.all(), "accounts"],
  selectOptions: () => [...accountQueries.all(), "select-options"],
  getAccountGroupsQuery: () =>
    queryOptions({
      queryKey: accountQueries.all(),
      queryFn: getAccountGroups,
    }),
  getAccountsQuery: (group_id: string, archived: boolean) =>
    queryOptions({
      queryKey: [...accountQueries.accounts(), group_id, archived],
      queryFn: () => getAccounts(group_id, archived),
    }),
  getAccountTypesQuery: () =>
    queryOptions({
      queryKey: [...accountQueries.selectOptions(), "account-types"],
      queryFn: getAccountTypes,
    }),
  getAccountCurrenciesQuery: () =>
    queryOptions({
      queryKey: [...accountQueries.selectOptions(), "currencies"],
      queryFn: getAccountCurrencies,
    }),
  getAccountTimezonesQuery: () =>
    queryOptions({
      queryKey: [...accountQueries.selectOptions(), "timezones"],
      queryFn: getAccountTimezones,
    }),
  getAccountBrokersQuery: () =>
    queryOptions({
      queryKey: [...accountQueries.selectOptions(), "brokers"],
      queryFn: getAccountBrokers,
    }),
};

const useCreateAccountGroupMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => createAccountGroup(payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: accountQueries.all(),
        type: "all",
      });
    },
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useUpdateAccountGroupMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => updateAccountGroup(id, payload),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => createAccount(payload),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useBulkCreateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest[]) => bulkCreateAccounts(payload),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useUpdateAccountMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => updateAccount(id, payload),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useBulkUpdateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest & { id: string }[]) => bulkUpdateAccounts(payload),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};
const useArchiveAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => archiveAccount(id),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

const useRestoreAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => restoreAccount(id),
    meta: {
      invalidates: [accountQueries.all()],
    },
  });
};

export {
  accountQueries,
  useCreateAccountGroupMutation,
  useUpdateAccountGroupMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useBulkCreateAccountsMutation,
  useBulkUpdateAccountsMutation,
  useArchiveAccountMutation,
  useRestoreAccountMutation,
};
