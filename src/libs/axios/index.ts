import axios from "axios";
import { SessionAuthCookies } from "../cookies";
import { env } from "../env";

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = SessionAuthCookies.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      SessionAuthCookies.remove();
      return Promise.reject(new Error("Unauthorized"));
    }
    return Promise.reject(
      error instanceof Error ? error : new Error("An unexpected error occurred")
    );
  }
);
