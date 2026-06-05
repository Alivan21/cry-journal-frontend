import { queryOptions, useMutation } from "@tanstack/react-query";
import type { UpsertAccountGroupRequest, UpsertAccountRequest } from "./type";
import {
  archiveAccount,
  createAccount,
  createAccountGroup,
  getAccountGroups,
  getAccounts,
  restoreAccount,
  updateAccount,
  updateAccountGroup,
} from "./route";

const accountQueries = {
  accountGroups: () => ["account-groups"],
  accounts: () => ["accounts"],
  getAccountGroupsQuery: () =>
    queryOptions({
      queryKey: accountQueries.accountGroups(),
      queryFn: getAccountGroups,
    }),
  getAccountsQuery: (group_id: string, archived: boolean) =>
    queryOptions({
      queryKey: [...accountQueries.accounts(), group_id, archived],
      queryFn: () => getAccounts(group_id, archived),
    }),
};

const useCreateAccountGroupMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => createAccountGroup(payload),
    meta: {
      invalidates: [accountQueries.accountGroups()],
    },
  });
};

const useUpdateAccountGroupMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => updateAccountGroup(id, payload),
    meta: {
      invalidates: [accountQueries.accountGroups()],
    },
  });
};

const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => createAccount(payload),
    meta: {
      invalidates: [accountQueries.accounts()],
    },
  });
};

const useUpdateAccountMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountRequest) => updateAccount(id, payload),
    meta: {
      invalidates: [accountQueries.accounts()],
    },
  });
};

const useArchiveAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => archiveAccount(id),
    meta: {
      invalidates: [accountQueries.accounts()],
    },
  });
};

const useRestoreAccountMutation = () => {
  return useMutation({
    mutationFn: (id: string) => restoreAccount(id),
    meta: {
      invalidates: [accountQueries.accounts()],
    },
  });
};

export {
  accountQueries,
  useCreateAccountGroupMutation,
  useUpdateAccountGroupMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useArchiveAccountMutation,
  useRestoreAccountMutation,
};
