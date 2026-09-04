"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/app/lib/admin/user-actions";
import { Alert, Button, Field, Input } from "./ui";

/**
 * Changing your own password.
 *
 * Used twice: on the account page, and as the only thing on screen when an
 * account still carries the password someone else typed for it.
 */
export function PasswordForm({ submitLabel = "Change password" }: { submitLabel?: string }) {
  const [state, action, pending] = useActionState(changeOwnPassword, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid max-w-[420px] gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Field label="Current password" name="current" error={errors.current} required>
        <Input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          error={errors.current}
          required
        />
      </Field>

      <Field
        label="New password"
        name="password"
        error={errors.password}
        hint="At least 12 characters. Length is the only rule — a passphrase beats a short password with a symbol in it."
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={errors.password}
          required
        />
      </Field>

      <Field label="Repeat new password" name="confirm" required>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
        />
      </Field>

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
