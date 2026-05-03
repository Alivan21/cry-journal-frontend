import { httpClient } from "@/libs/axios";
import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "./type";

async function register(payload: RegisterRequest) {
  const response = await httpClient.post<RegisterResponse>("/auth/register", payload);
  return response.data;
}

async function login(payload: LoginRequest) {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

async function logout() {
  const response = await httpClient.post<LogoutResponse>("/auth/logout");
  return response.data;
}

async function getCurrentUser() {
  const response = await httpClient.get<CurrentUserResponse>("/auth/current-user");
  return response.data;
}

export { register, login, logout, getCurrentUser };
