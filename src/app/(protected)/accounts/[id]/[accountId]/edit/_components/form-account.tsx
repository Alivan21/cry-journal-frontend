import { accountQueries } from "@/api/accounts/query";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { useQuery } from "@/hooks/request/use-query";
import type { AccountFormApi } from "../_hooks/use-edit-account-form";

type FormAccountProps = {
  form: AccountFormApi;
  disabled?: boolean;
};

function FormAccount({ form, disabled = false }: FormAccountProps) {
  const { data: accountTypesData, isPending: isAccountTypesPending } = useQuery(
    accountQueries.getAccountTypesQuery()
  );
  const { data: currenciesData, isPending: isCurrenciesPending } = useQuery(
    accountQueries.getAccountCurrenciesQuery()
  );
  const { data: timezonesData, isPending: isTimezonesPending } = useQuery(
    accountQueries.getAccountTimezonesQuery()
  );
  const { data: brokersData, isPending: isBrokersPending } = useQuery(
    accountQueries.getAccountBrokersQuery()
  );

  const accountTypes = accountTypesData?.data ?? [];
  const currencies = currenciesData?.data ?? [];
  const timezones = timezonesData?.data ?? [];
  const brokers = brokersData?.data ?? [];
  const isOptionsLoading =
    isAccountTypesPending || isCurrenciesPending || isTimezonesPending || isBrokersPending;

  return (
    <FieldSet className="gap-4" disabled={disabled}>
      <div className="space-y-1">
        <FieldLegend className="mb-0">Account details</FieldLegend>
        <p className="text-muted-foreground text-sm">
          Update this account&apos;s name, balance, and trading settings.
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-4 @md/field-group:grid-cols-2">
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                disabled={disabled}
                label="Account name"
                placeholder="e.g. Main Trading"
                required
              />
            )}
          </form.AppField>
          <form.AppField name="startingBalance">
            {(field) => (
              <field.TextField
                disabled={disabled}
                inputMode="decimal"
                label="Starting balance"
                placeholder="0.00"
                required
                type="number"
              />
            )}
          </form.AppField>
        </div>

        <div className="grid gap-4 @md/field-group:grid-cols-2">
          <form.AppField name="broker">
            {(field) => (
              <field.ComboboxField
                disabled={disabled || isOptionsLoading}
                emptyMessage="No brokers found."
                label="Broker"
                options={brokers}
                placeholder="Select broker"
                required
              />
            )}
          </form.AppField>

          <form.AppField name="accountType">
            {(field) => (
              <field.ComboboxField
                disabled={disabled || isOptionsLoading}
                emptyMessage="No account types found."
                label="Account type"
                options={accountTypes}
                placeholder="Select account type"
                required
              />
            )}
          </form.AppField>
        </div>

        <div className="grid gap-4 @md/field-group:grid-cols-2">
          <form.AppField name="baseCurrency">
            {(field) => (
              <field.ComboboxField
                disabled={disabled || isOptionsLoading}
                emptyMessage="No currencies found."
                label="Base currency"
                options={currencies}
                placeholder="Select currency"
                required
              />
            )}
          </form.AppField>

          <form.AppField name="timezone">
            {(field) => (
              <field.ComboboxField
                disabled={disabled || isOptionsLoading}
                emptyMessage="No timezones found."
                label="Timezone"
                options={timezones}
                placeholder="Select timezone"
                required
              />
            )}
          </form.AppField>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}

export { FormAccount, type FormAccountProps };
