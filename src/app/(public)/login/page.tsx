import { useForm } from "@tanstack/react-form";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginMutation } from "@/api/auth/query";
import { loginSchema } from "@/api/auth/type";
import { ROUTES } from "@/common/constant/routes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const navigate = useNavigate();
  const { isPending, mutate } = useLoginMutation();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        { ...value, rememberMe },
        { onSuccess: () => void navigate(ROUTES.PROTECTED.DASHBOARD) }
      );
    },
  });

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <p className="text-primary text-sm font-medium">Welcome back</p>
        <h2 className="text-3xl font-semibold tracking-tight">Sign in to Cry Journal</h2>
        <p className="text-muted-foreground text-sm">
          Continue your reflections and check in with your emotional patterns.
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
                    autoComplete="current-password"
                    className="h-9"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Enter your password"
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

        <div className="space-y-1.5">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Checkbox
              checked={rememberMe}
              id="remember-me"
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label className="cursor-pointer leading-none" htmlFor="remember-me">
              Stay signed in for 30 days
            </Label>
          </div>
          <p className="text-muted-foreground pl-6 text-xs">
            When off, your session cookie expires after one day.
          </p>
        </div>

        <Button className="h-11 w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Signing in…" : "Sign in"}
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
        Don&apos;t have an account?{" "}
        <Button asChild className="h-auto p-0" variant="link">
          <Link to={ROUTES.PUBLIC.REGISTER}>Sign up</Link>
        </Button>
      </p>
    </div>
  );
}
