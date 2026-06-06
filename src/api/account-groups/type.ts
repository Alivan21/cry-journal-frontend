import z from "zod";
import type { SuccessResponse } from "@/common/types/base-response";
import { optionalIfHasInitialValue } from "@/common/utils/zod-helper";

type AccountGroupItem = {
  id: string;
  name: string;
  description: string;
  accountCount: number;
  createdAt: string;
  updatedAt: string;
};

const upsertAccountGroupSchema = (initialValue: Partial<AccountGroupItem>) => {
  return z.object({
    name: optionalIfHasInitialValue(initialValue.name, z.string().min(1)),
    description: z.string().min(1).optional(),
  });
};

const accountRowSchema = () =>
  z.object({
    name: z.string().min(1),
    broker: z.string().min(1),
    accountType: z.string().min(1),
    baseCurrency: z.string().min(1),
    timezone: z.string().min(1),
    startingBalance: z.string().min(1),
  });

const createAccountGroupFormSchema = (initialValue: Partial<AccountGroupItem>) =>
  upsertAccountGroupSchema(initialValue).extend({
    accounts: z.array(accountRowSchema()),
  });

type AccountGroupListResponse = SuccessResponse<AccountGroupItem[]>;
type AccountGroupResponse = SuccessResponse<AccountGroupItem>;

type UpsertAccountGroupRequest = z.infer<ReturnType<typeof upsertAccountGroupSchema>>;
type AccountRowFormValues = z.infer<ReturnType<typeof accountRowSchema>>;
type CreateAccountGroupFormValues = z.infer<ReturnType<typeof createAccountGroupFormSchema>>;

export {
  type AccountGroupItem,
  type AccountGroupListResponse,
  type AccountGroupResponse,
  type AccountRowFormValues,
  type CreateAccountGroupFormValues,
  type UpsertAccountGroupRequest,
  accountRowSchema,
  createAccountGroupFormSchema,
  upsertAccountGroupSchema,
};
