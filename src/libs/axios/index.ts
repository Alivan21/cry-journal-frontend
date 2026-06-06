import axios from "axios";
import { env } from "../env";
import { queryClient } from "../tanstack-query/query-client";

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const LOGOUT_UNAUTHORIZED_SUPPRESSION_MS = 5_000;

let unauthorizedDispatched = false;
let suppressUnauthorizedUntil = 0;

export const setSuppressUnauthorizedEvent = (value: boolean) => {
  suppressUnauthorizedUntil = value ? Date.now() + LOGOUT_UNAUTHORIZED_SUPPRESSION_MS : 0;
};

httpClient.interceptors.response.use(
  (response) => {
    unauthorizedDispatched = false;
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        queryClient.removeQueries({ queryKey: ["auth"] });

        if (Date.now() < suppressUnauthorizedUntil) {
          return Promise.reject(error);
        }

        if (!unauthorizedDispatched) {
          unauthorizedDispatched = true;
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(
      error instanceof Error ? error : new Error("An unexpected error occurred")
    );
  }
);
