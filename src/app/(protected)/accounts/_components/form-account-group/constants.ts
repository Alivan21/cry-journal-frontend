import type { AccountRowFormValues } from "@/api/account-groups/type";

const emptyAccountRow: AccountRowFormValues = {
  name: "",
  broker: "",
  accountType: "",
  baseCurrency: "",
  timezone: "",
  startingBalance: "",
};

export { emptyAccountRow };
