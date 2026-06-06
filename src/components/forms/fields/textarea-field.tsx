import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "../form-context";

type TextareaFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "id" | "name" | "value" | "onBlur" | "onChange" | "aria-invalid"
> & {
  label: string;
  description?: string;
  required?: boolean;
};

function TextareaField({
  label,
  description,
  required = false,
  ...textareaProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Textarea
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        value={field.state.value}
        {...textareaProps}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={errors} />
    </Field>
  );
}

export { TextareaField, type TextareaFieldProps };
