import { queryOptions } from "@tanstack/react-query";

import { toast } from "sonner";
import { useMutation } from "@/hooks/request/use-mutation";
import { setSuppressUnauthorizedEvent } from "@/libs/axios";
import { queryClient } from "@/libs/tanstack-query/query-client";

import type { LoginPayload, RegisterRequest } from "./type";
import { getCurrentUser, login, logout, register } from "./route";

const AUTH_STALE_TIME_MS = 5 * 60 * 1000;

type LoginMutationVariables = LoginPayload;

const authQueries = {
  auth: () => ["auth"],
  currentUser: () => [...authQueries.auth(), "currentUser"],
  getCurrentUserQuery: () =>
    queryOptions({
      queryKey: authQueries.currentUser(),
      queryFn: getCurrentUser,
      staleTime: AUTH_STALE_TIME_MS,
    }),
};

const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginMutationVariables) => login(credentials),
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || "Failed to login");
    },
    meta: {
      invalidates: [authQueries.auth()],
    },
  });
};

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (credentials: RegisterRequest) => register(credentials),
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || "Failed to register");
    },
    meta: {
      invalidates: [authQueries.auth()],
    },
  });
};

const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logout(),
    onMutate: () => {
      setSuppressUnauthorizedEvent(true);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQueries.auth() });
    },
    onError: (error) => {
      setSuppressUnauthorizedEvent(false);
      toast.error(error.response?.data?.error?.message || "Failed to logout");
    },
    meta: {
      invalidates: [authQueries.auth()],
    },
  });
};

export {
  authQueries,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  type LoginMutationVariables,
};
