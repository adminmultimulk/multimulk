"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/lib/admin/auth-actions";
import { Alert, Button, Field, Input } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, {});

  return (
    <form action={action} className="grid gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}

      <Field label="Username" name="username" required>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
        />
      </Field>

      <Field label="Password" name="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Button type="submit" disabled={pending} className="mt-1 w-full py-2.5">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
