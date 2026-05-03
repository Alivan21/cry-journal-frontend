import { useForm } from "@tanstack/react-form";
import { ArrowRight, LockKeyhole, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useRegisterMutation } from "@/api/auth/query";
import { registerSchema } from "@/api/auth/type";
import { ROUTES } from "@/common/constant/routes";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Page() {
  const navigate = useNavigate();
  const { isPending, mutate } = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value, { onSuccess: () => void navigate(ROUTES.PROTECTED.DASHBOARD) });
    },
  });

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <p className="text-primary text-sm font-medium">Start your journal</p>
        <h2 className="text-3xl font-semibold tracking-tight">Create your account</h2>
        <p className="text-muted-foreground text-sm">
          Build a quiet space for check-ins, reflections, and emotional clarity.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const errors = field.state.meta.errors;
              const isInvalid = field.state.meta.isTouched && errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="name"
                    className="h-9"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Your name"
                    startIcon={<User />}
                    type="text"
                    value={field.state.value}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const errors = field.state.meta.errors;
              const isInvalid = field.state.meta.isTouched && errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="email"
                    className="h-9"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="name@example.com"
                    startIcon={<Mail />}
                    type="email"
                    value={field.state.value}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const errors = field.state.meta.errors;
              const isInvalid = field.state.meta.isTouched && errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                    className="h-9"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Create a password"
                    startIcon={<LockKeyhole />}
                    type="password"
                    value={field.state.value}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => {
              const errors = field.state.meta.errors;
              const isInvalid = field.state.meta.isTouched && errors.length > 0;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                    className="h-9"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Confirm your password"
                    startIcon={<LockKeyhole />}
                    type="password"
                    value={field.state.value}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <Button className="h-11 w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Creating account…" : "Create account"}
          <ArrowRight className="size-4" />
        </Button>

        <FieldSeparator>or continue with</FieldSeparator>

        <div className="my-4 flex gap-3">
          <Button className="h-10 flex-1" type="button" variant="outline">
            <span className="font-semibold">G</span>
            Google
          </Button>
        </div>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Button asChild className="h-auto p-0" variant="link">
          <Link to={ROUTES.PUBLIC.LOGIN}>Sign in</Link>
        </Button>
      </p>
    </div>
  );
}
