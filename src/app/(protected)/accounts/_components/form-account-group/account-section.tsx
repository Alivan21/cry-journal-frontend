import { Plus, Trash2 } from "lucide-react";

import { accountQueries } from "@/api/accounts/query";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { useQuery } from "@/hooks/request/use-query";

import type { AccountGroupFormApi } from "../../create/_hooks/use-create-account-group-form";
import { emptyAccountRow } from "./constants";

type AccountSectionProps = {
  form: AccountGroupFormApi;
  disabled?: boolean;
};

function AccountSection({ disabled = false, form }: AccountSectionProps) {
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
      <form.Field mode="array" name="accounts">
        {(accountsField) => (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <FieldLegend className="mb-0">Accounts</FieldLegend>
                <p className="text-muted-foreground text-sm">
                  Optional. Add one or more accounts to create with this group.
                </p>
              </div>

              <Button
                disabled={disabled}
                onClick={() => accountsField.pushValue(emptyAccountRow)}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add account
              </Button>
            </div>

            {accountsField.state.value.length === 0 ? (
              <div className="border-border/70 bg-muted/15 rounded-lg border border-dashed px-4 py-5 text-center">
                <p className="text-muted-foreground text-sm">
                  No accounts added yet. You can create the group on its own or add accounts now.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {accountsField.state.value.map((_, index) => (
                  <div className="border-border/60 bg-muted/15 rounded-lg border p-4" key={index}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">Account {index + 1}</p>
                      <Button
                        disabled={disabled}
                        onClick={() => accountsField.removeValue(index)}
                        size="sm"
                        type="button"
                        variant="destructive"
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </Button>
                    </div>

                    <FieldGroup>
                      <form.AppField name={`accounts[${index}].name`}>
                        {(field) => (
                          <field.TextField
                            disabled={disabled}
                            label="Account name"
                            placeholder="e.g. Main Trading"
                            required
                          />
                        )}
                      </form.AppField>

                      <div className="grid gap-4 @md/field-group:grid-cols-2">
                        <form.AppField name={`accounts[${index}].broker`}>
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

                        <form.AppField name={`accounts[${index}].accountType`}>
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
                        <form.AppField name={`accounts[${index}].baseCurrency`}>
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

                        <form.AppField name={`accounts[${index}].timezone`}>
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

                      <form.AppField name={`accounts[${index}].startingBalance`}>
                        {(field) => (
                          <field.TextField
                            disabled={disabled}
                            inputMode="decimal"
                            label="Starting balance"
                            placeholder="0.00"
                            required
                            type="text"
                          />
                        )}
                      </form.AppField>
                    </FieldGroup>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </form.Field>
    </FieldSet>
  );
}

export { AccountSection, type AccountSectionProps };
