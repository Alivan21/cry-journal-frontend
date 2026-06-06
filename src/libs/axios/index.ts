import axios from "axios";
import { env } from "../env";
import { SessionAuthStorage } from "../local-storage";

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let unauthorizedDispatched = false;

httpClient.interceptors.request.use((config) => {
  const token = SessionAuthStorage.get();
  if (token) {
    unauthorizedDispatched = false;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const hadSession = Boolean(SessionAuthStorage.get());
        SessionAuthStorage.remove();

        if (hadSession && !unauthorizedDispatched) {
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
