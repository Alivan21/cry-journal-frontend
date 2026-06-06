import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/tanstack-query/query-client";
import type { UpsertAccountGroupRequest } from "./type";
import { createAccountGroup, getAccountGroups, updateAccountGroup } from "./route";

const accountGroupQueries = {
  all: () => ["account-groups"],
  getAccountGroupsQuery: () =>
    queryOptions({
      queryKey: accountGroupQueries.all(),
      queryFn: getAccountGroups,
    }),
};

const invalidateRelatedQueries = [accountGroupQueries.all(), ["accounts"] as const];

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
