"use client";

import { useActionState } from "react";
import { createUser, resetUserPassword } from "@/app/lib/admin/user-actions";
import {
  assignableRoles,
  roleDescriptions,
  roleLabels,
} from "@/app/lib/auth/roles";
import { Alert, Button, Field, Input, Select } from "./ui";

/** The only way an account comes into existence. */
export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4" key={state.success ?? "new"}>
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} required>
          <Input id="name" name="name" error={errors.name} required />
        </Field>
        <Field
          label="Username"
          name="username"
          error={errors.username}
          hint="What they type to sign in. Lowercase; cannot be changed later."
          required
        >
          <Input
            id="username"
            name="username"
            autoCapitalize="none"
            spellCheck={false}
            error={errors.username}
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" error={errors.email} hint="Optional — for reaching them, not for signing in.">
          <Input id="email" name="email" type="email" error={errors.email} />
        </Field>
        <Field label="Role" name="role" error={errors.role} required>
          <Select id="role" name="role" defaultValue="EDITOR" error={errors.role}>
            {assignableRoles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]} — {roleDescriptions[role]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Temporary password"
          name="password"
          error={errors.password}
          hint="At least 12 characters. They will be made to change it the first time they sign in."
          required
        >
          <Input
            id="password"
            name="password"
            type="text"
            autoComplete="off"
            error={errors.password}
            required
          />
        </Field>
        <Field label="Repeat password" name="confirm" required>
          <Input id="confirm" name="confirm" type="text" autoComplete="off" required />
        </Field>
      </div>

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}

/** For the one case self-service cannot cover: they have forgotten it. */
export function ResetPasswordForm({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [state, action, pending] = useActionState(resetUserPassword, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="flex flex-wrap items-end gap-2">
        <div className="grid gap-1.5">
          <label htmlFor={`password-${id}`} className="text-[12px] text-ink/60">
            New password for {name}
          </label>
          <Input
            id={`password-${id}`}
            name="password"
            type="text"
            autoComplete="off"
            error={errors.password}
            className="w-[220px]"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={`confirm-${id}`} className="text-[12px] text-ink/60">
            Repeat
          </label>
          <Input
            id={`confirm-${id}`}
            name="confirm"
            type="text"
            autoComplete="off"
            className="w-[220px]"
          />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Setting…" : "Set password"}
        </Button>
      </div>
      {errors.password ? (
        <p className="text-[12px] text-red-700">{errors.password}</p>
      ) : null}
    </form>
  );
}

/** Changes a role in place, without a save button to forget. */
export function RoleSelect({
  id,
  role,
  onChange,
}: {
  id: string;
  role: string;
  onChange: (id: string, role: string) => Promise<void>;
}) {
  return (
    <form action={async (form: FormData) => onChange(id, String(form.get("role")))}>
      <Select
        name="role"
        defaultValue={role}
        className="w-[180px]"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {assignableRoles.map((value) => (
          <option key={value} value={value}>
            {roleLabels[value]}
          </option>
        ))}
      </Select>
    </form>
  );
}
