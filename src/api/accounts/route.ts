import { httpClient } from "@/libs/axios";
import type {
  AccountGroupListResponse,
  AccountGroupResponse,
  AccountListResponse,
  AccountResponse,
  UpsertAccountGroupRequest,
  UpsertAccountRequest,
} from "./type";

async function getAccountGroups() {
  const response = await httpClient.get<AccountGroupListResponse>("/account-groups");
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

async function getAccounts(group_id: string, archived: boolean) {
  const response = await httpClient.get<AccountListResponse>("/accounts", {
    params: {
      group_id: group_id,
      archived: archived.toString(),
    },
  });
  return response.data;
}

async function createAccount(payload: UpsertAccountRequest) {
  const response = await httpClient.post<AccountResponse>("/accounts", payload);
  return response.data;
}

async function updateAccount(id: string, payload: UpsertAccountRequest) {
  const response = await httpClient.put<AccountResponse>(`/accounts/${id}`, payload);
  return response.data;
}

async function archiveAccount(id: string) {
  const response = await httpClient.post<AccountResponse>(`/accounts/${id}/archive`);
  return response.data;
}
async function restoreAccount(id: string) {
  const response = await httpClient.post<AccountResponse>(`/accounts/${id}/restore`);
  return response.data;
}

export {
  getAccountGroups,
  createAccountGroup,
  updateAccountGroup,
  getAccounts,
  createAccount,
  updateAccount,
  archiveAccount,
  restoreAccount,
};
