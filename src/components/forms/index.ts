import { createFormHook } from "@tanstack/react-form";

import { SubmitButton } from "./components/submit-button";
import { ComboboxField } from "./fields/combobox-field";
import { ComboboxMultiField } from "./fields/combobox-multi-field";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    ComboboxField,
    ComboboxMultiField,
    TextField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useFieldContext, useFormContext } from "./form-context";
export { ComboboxField, type ComboboxFieldProps } from "./fields/combobox-field";
export { ComboboxMultiField, type ComboboxMultiFieldProps } from "./fields/combobox-multi-field";
export { TextField, type TextFieldProps } from "./fields/text-field";
export { TextareaField, type TextareaFieldProps } from "./fields/textarea-field";
export { SubmitButton, type SubmitButtonProps } from "./components/submit-button";
