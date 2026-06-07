import { httpClient } from "@/libs/axios";
import type {
  AccountGroupListResponse,
  AccountGroupResponse,
  UpsertAccountGroupRequest,
} from "./type";

async function getAccountGroups() {
  const response = await httpClient.get<AccountGroupListResponse>("/account-groups");
  return response.data;
}

async function getAccountGroup(id: string) {
  const response = await httpClient.get<AccountGroupResponse>(`/account-groups/${id}`);
  return response.data;
}

async function createAccountGroup(payload: UpsertAccountGroupRequest) {
  const response = await httpClient.post<AccountGroupResponse>("/account-groups", payload);
  return response.data;
}

async function updateAccountGroup(id: string, payload: UpsertAccountGroupRequest) {
  const response = await httpClient.put<AccountGroupResponse>(`/account-groups/${id}`, payload);
  return response.data;
}

export { createAccountGroup, getAccountGroups, getAccountGroup, updateAccountGroup };
