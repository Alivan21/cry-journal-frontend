import { createFormHook } from "@tanstack/react-form";

import { SubmitButton } from "./components/submit-button";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useFieldContext, useFormContext } from "./form-context";
export { TextField, type TextFieldProps } from "./fields/text-field";
export { TextareaField, type TextareaFieldProps } from "./fields/textarea-field";
export { SubmitButton, type SubmitButtonProps } from "./components/submit-button";
