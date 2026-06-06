import type { SelectOption } from "@/common/types/base-response";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "../form-context";

type ComboboxFieldProps = {
  label: string;
  options: SelectOption[];
  description?: string;
  required?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

function ComboboxField({
  label,
  options,
  description,
  required = false,
  placeholder,
  emptyMessage = "No items found.",
  disabled = false,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && errors.length > 0;
  const selectedOption = options.find((option) => option.value === field.state.value) ?? null;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Combobox
        disabled={disabled}
        isItemEqualToValue={(a, b) => a.value === b.value}
        items={options}
        onValueChange={(option) => field.handleChange(option?.value ?? "")}
        value={selectedOption}
      >
        <ComboboxInput
          aria-invalid={isInvalid}
          className="w-full"
          disabled={disabled}
          id={field.name}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          showClear={Boolean(selectedOption)}
        />
        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(option: SelectOption) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={errors} />
    </Field>
  );
}

export { ComboboxField, type ComboboxFieldProps };
