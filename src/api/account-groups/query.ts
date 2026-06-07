import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/tanstack-query/query-client";
import type { UpsertAccountGroupRequest } from "./type";
import { createAccountGroup, getAccountGroups, getAccountGroup, updateAccountGroup } from "./route";

const accountGroupQueries = {
  all: () => ["account-groups"],
  detail: (id: string) => [...accountGroupQueries.all(), id],
  getAccountGroupsQuery: () =>
    queryOptions({
      queryKey: accountGroupQueries.all(),
      queryFn: getAccountGroups,
    }),
  getAccountGroupQuery: (id: string) =>
    queryOptions({
      queryKey: accountGroupQueries.detail(id),
      queryFn: () => getAccountGroup(id),
    }),
};

const invalidateRelatedQueries = [accountGroupQueries.all(), ["accounts"]];

const useCreateAccountGroupMutation = () => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => createAccountGroup(payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: accountGroupQueries.all(),
        type: "all",
      });
    },
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

const useUpdateAccountGroupMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => updateAccountGroup(id, payload),
    meta: {
      invalidates: invalidateRelatedQueries,
    },
  });
};

export { accountGroupQueries, useCreateAccountGroupMutation, useUpdateAccountGroupMutation };
