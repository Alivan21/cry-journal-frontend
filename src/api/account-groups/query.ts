import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/tanstack-query/query-client";
import type { UpsertAccountGroupRequest } from "./type";
import { accountQueries } from "../accounts/query";
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

const getInvalidateRelatedQueries = () => [accountGroupQueries.all(), accountQueries.all()];

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
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

const useUpdateAccountGroupMutation = (id: string) => {
  return useMutation({
    mutationFn: (payload: UpsertAccountGroupRequest) => updateAccountGroup(id, payload),
    meta: {
      invalidates: getInvalidateRelatedQueries(),
    },
  });
};

export { accountGroupQueries, useCreateAccountGroupMutation, useUpdateAccountGroupMutation };
