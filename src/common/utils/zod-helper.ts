import { z } from "zod";

export const optionalIfHasInitialValue = <T extends z.ZodTypeAny>(
  initialValue: unknown,
  schema: T,
): T | z.ZodOptional<T> =>
  initialValue != null && initialValue !== "" ? schema.optional() : schema;
