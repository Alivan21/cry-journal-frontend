import type { SelectOption } from "@/common/types/base-response";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "../form-context";

type ComboboxMultiFieldProps = {
  label: string;
  options: SelectOption[];
  description?: string;
  required?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

function ComboboxMultiField({
  label,
  options,
  description,
  required = false,
  placeholder,
  emptyMessage = "No items found.",
  disabled = false,
}: ComboboxMultiFieldProps) {
  const field = useFieldContext<string[]>();
  const anchorRef = useComboboxAnchor();
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && errors.length > 0;
  const selectedValues = field.state.value ?? [];
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Combobox
        disabled={disabled}
        isItemEqualToValue={(a, b) => a.value === b.value}
        items={options}
        multiple
        onValueChange={(nextOptions) =>
          field.handleChange(nextOptions.map((option) => option.value))
        }
        value={selectedOptions}
      >
        <ComboboxChips ref={anchorRef}>
          <ComboboxValue>
            {selectedOptions.map((option) => (
              <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput
            aria-invalid={isInvalid}
            disabled={disabled}
            id={field.name}
            onBlur={field.handleBlur}
            placeholder={placeholder}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchorRef}>
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

export { ComboboxMultiField, type ComboboxMultiFieldProps };
