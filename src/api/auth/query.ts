import { queryOptions } from "@tanstack/react-query";

import { toast } from "sonner";
import { useMutation } from "@/hooks/request/use-mutation";
import { SessionAuthCookies } from "@/libs/cookies";

import type { LoginRequest, RegisterRequest } from "./type";
import { getCurrentUser, login, logout, register } from "./route";

const SESSION_COOKIE_MAX_AGE_ONE_DAY_SEC = 24 * 60 * 60;
const SESSION_COOKIE_MAX_AGE_THIRTY_DAYS_SEC = 30 * 24 * 60 * 60;

type LoginMutationVariables = LoginRequest & { rememberMe: boolean };

const authQueries = {
  auth: () => ["auth"],
  currentUser: () => [...authQueries.auth(), "currentUser"],
  getCurrentUserQuery: () =>
    queryOptions({
      queryKey: authQueries.currentUser(),
      queryFn: getCurrentUser,
    }),
};

const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ rememberMe: _rememberMe, ...credentials }: LoginMutationVariables) =>
      login(credentials),
    onSuccess: (data, variables) => {
      SessionAuthCookies.set(data.data.accessToken, {
        maxAge: variables.rememberMe
          ? SESSION_COOKIE_MAX_AGE_THIRTY_DAYS_SEC
          : SESSION_COOKIE_MAX_AGE_ONE_DAY_SEC,
      });
    },
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
    onSuccess: () => {
      SessionAuthCookies.remove();
    },
    onError: (error) => {
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
