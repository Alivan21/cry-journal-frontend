import z from "zod";
import type { SuccessResponse } from "@/common/types/base-response";
import { optionalIfHasInitialValue } from "@/common/utils/zod-helper";

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

const createAccountSchema = (initialValue: Partial<AccountItem>) => {
  return z.object({
    accountType: optionalIfHasInitialValue(initialValue.accountType, z.string().min(1)),
    baseCurrency: optionalIfHasInitialValue(initialValue.baseCurrency, z.string().min(1)),
    broker: optionalIfHasInitialValue(initialValue.broker, z.string().min(1)),
    groupId: optionalIfHasInitialValue(initialValue.groupId, z.string().min(1).optional()),
    name: optionalIfHasInitialValue(initialValue.name, z.string().min(1)),
    startingBalance: optionalIfHasInitialValue(initialValue.startingBalance, z.string().min(1)),
    timezone: optionalIfHasInitialValue(initialValue.timezone, z.string().min(1).optional()),
  });
};

const updateAccountSchema = (initialValue: Partial<AccountItem>) =>
  createAccountSchema(initialValue).extend({
    id: z.string().min(1),
  });

function upsertAccountSchema(initialValue: Partial<AccountItem>, isUpdate: boolean = false) {
  return isUpdate ? updateAccountSchema(initialValue) : createAccountSchema(initialValue);
}

type AccountListResponse = SuccessResponse<AccountItem[]>;
type AccountResponse = SuccessResponse<AccountItem>;

type UpsertAccountRequest = z.infer<ReturnType<typeof upsertAccountSchema>>;

export {
  type AccountItem,
  type AccountListResponse,
  type AccountResponse,
  type UpsertAccountRequest,
  upsertAccountSchema,
};
