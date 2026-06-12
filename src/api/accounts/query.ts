import { queryOptions, useMutation } from "@tanstack/react-query";
import type { UpsertAccountRequest } from "./type";
import { accountGroupQueries } from "../account-groups/query";
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

const getInvalidateRelatedQueries = () => [accountQueries.all(), accountGroupQueries.all()];

const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => createAccount(payload),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useBulkCreateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest[]) => bulkCreateAccounts(payload),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useUpdateAccountMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => updateAccount(id, payload),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useBulkUpdateAccountsMutation = () => {
  return useMutation({
    mutationFn: (payload: (UpsertAccountRequest & { id: string })[]) => bulkUpdateAccounts(payload),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useArchiveAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => archiveAccount(id),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useRestoreAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => restoreAccount(id),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
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
