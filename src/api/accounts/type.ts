import z from "zod";
import type { SuccessResponse } from "@/common/types/base-response";
import { optionalIfHasInitialValue } from "@/common/utils/zod-helper";

type AccountGroupItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type AccountItem = {
  id: string;
  groupId: string;
  userId: string;
  name: string;
  broker: string;
  accountType: string;
  baseCurrency: string;
  timezone: string;
  startingBalance: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const upsertAccountGroupSchema = (initialValue: Partial<AccountGroupItem>) => {
  return z.object({
    name: optionalIfHasInitialValue(initialValue.name, z.string().min(1)),
    description: z.string().min(1).optional(),
  });
};

const upsertAccountSchema = (initialValue: Partial<AccountItem>) => {
  return z.object({
    accountType: optionalIfHasInitialValue(initialValue.accountType, z.string().min(1)),
    baseCurrency: optionalIfHasInitialValue(initialValue.baseCurrency, z.string().min(1)),
    broker: optionalIfHasInitialValue(initialValue.broker, z.string().min(1)),
    groupId: optionalIfHasInitialValue(initialValue.groupId, z.string().min(1)),
    name: optionalIfHasInitialValue(initialValue.name, z.string().min(1)),
    startingBalance: optionalIfHasInitialValue(initialValue.startingBalance, z.string().min(1)),
    timezone: optionalIfHasInitialValue(initialValue.timezone, z.string().min(1)),
  });
};

type AccountGroupListResponse = SuccessResponse<AccountGroupItem[]>;
type AccountGroupResponse = SuccessResponse<AccountGroupItem>;

type AccountListResponse = SuccessResponse<AccountItem[]>;
type AccountResponse = SuccessResponse<AccountItem>;

type UpsertAccountGroupRequest = z.infer<ReturnType<typeof upsertAccountGroupSchema>>;
type UpsertAccountRequest = z.infer<ReturnType<typeof upsertAccountSchema>>;

export {
  type AccountGroupListResponse,
  type AccountGroupResponse,
  type AccountItem,
  type AccountListResponse,
  type AccountResponse,
  type UpsertAccountGroupRequest,
  type UpsertAccountRequest,
  upsertAccountGroupSchema,
  upsertAccountSchema,
};
