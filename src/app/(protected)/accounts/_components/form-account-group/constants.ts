import type { AccountRowFormValues } from "@/api/accounts/type";

const emptyAccountRow: AccountRowFormValues = {
  name: "",
  broker: "",
  accountType: "",
  baseCurrency: "",
  timezone: "",
  startingBalance: "",
};

export { emptyAccountRow };
