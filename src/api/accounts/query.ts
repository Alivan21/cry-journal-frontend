import { queryOptions, useMutation } from "@tanstack/react-query";
import type { UpsertAccountRequest } from "./type";
import {
  archiveAccount,
  bulkCreateAccounts,
  bulkUpdateAccounts,
  createAccount,
  getAccountBrokers,
  getAccountCurrencies,
  getAccounts,
  getAccount,
  getAccountTimezones,
  getAccountTypes,
  restoreAccount,
  updateAccount,
} from "./route";

const accountQueries = {
  all: () => ["accounts"],
  detail: (id: string) => [...accountQueries.all(), id],
  selectOptions: () => ["select-options"],
  getAccountsQuery: (group_id: string, archived: boolean) =>
    queryOptions({
      queryKey: [...accountQueries.all(), group_id, archived],
      queryFn: () => getAccounts(group_id, archived),
    }),
  getAccountQuery: (id: string) =>
    queryOptions({
      queryKey: accountQueries.detail(id),
      queryFn: () => getAccount(id),
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

const invalidateRelatedQueries = [accountQueries.all(), ["account-groups"]];

const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => createAccount(payload),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useBulkCreateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest[]) => bulkCreateAccounts(payload),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useUpdateAccountMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => updateAccount(id, payload),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useBulkUpdateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: (UpsertAccountRequest & { id: string })[]) => bulkUpdateAccounts(payload),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useArchiveAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => archiveAccount(id),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useRestoreAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => restoreAccount(id),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

export {
  accountQueries,
  useArchiveAccountMutation,
  useBulkCreateAccountsMutation,
  useBulkUpdateAccountsMutation,
  useCreateAccountMutation,
  useRestoreAccountMutation,
  useUpdateAccountMutation,
};
