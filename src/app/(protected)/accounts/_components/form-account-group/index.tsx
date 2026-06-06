import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";

import type { AccountGroupFormApi } from "../../create/_hooks/use-create-account-group-form";

type FormAccountGroupProps = {
  form: AccountGroupFormApi;
  disabled?: boolean;
};

function FormAccountGroup({ form, disabled = false }: FormAccountGroupProps) {
  return (
    <FieldSet className="gap-4">
      <div className="space-y-1">
        <FieldLegend className="mb-0">Account group</FieldLegend>
        <p className="text-muted-foreground text-sm">
          Name and describe the group that will hold your accounts.
        </p>
      </div>

      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              disabled={disabled}
              label="Name"
              placeholder="e.g. Brokerage"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              disabled={disabled}
              label="Description"
              placeholder="Describe what this account group is for"
              rows={3}
            />
          )}
        </form.AppField>
      </FieldGroup>
    </FieldSet>
  );
}

export { FormAccountGroup, type FormAccountGroupProps };
