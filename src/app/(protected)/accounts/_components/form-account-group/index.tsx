import type { UpsertAccountGroupRequest, upsertAccountGroupSchema } from "@/api/accounts/type";
import { useAppForm } from "@/components/forms";
import { FieldGroup } from "@/components/ui/field";

type FormAccountGroupProps = {
  defaultValues: UpsertAccountGroupRequest;
  schema: ReturnType<typeof upsertAccountGroupSchema>;
  onSubmit: (value: UpsertAccountGroupRequest) => void;
  isPending?: boolean;
  submitLabel?: string;
};

function FormAccountGroup({
  defaultValues,
  schema,
  onSubmit,
  isPending = false,
  submitLabel = "Create",
}: FormAccountGroupProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" placeholder="e.g. Brokerage" required />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="Describe what this account group is for"
              rows={4}
            />
          )}
        </form.AppField>
      </FieldGroup>

      <form.AppForm>
        <form.SubmitButton isPending={isPending} pendingLabel="Saving...">
          {submitLabel}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

export { FormAccountGroup, type FormAccountGroupProps };
