"use client";

import { useActionState, useState } from "react";
import { updateLead } from "@/app/lib/admin/lead-actions";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";

/**
 * The edit form behind a lead's "Edit" link, revealed in place so the list
 * page stays a server component that reads the database directly.
 */
export function EditLeadForm({
  lead,
  kinds,
}: {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    kind: string;
    subject: string;
    message: string;
    notes: string | null;
  };
  kinds: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateLead, {});
  const errors = state.fieldErrors ?? {};
  const id = (name: string) => `${name}-${lead.id}`;

  if (!open)
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );

  return (
    <form action={action} className="mt-3 grid w-full gap-3 border-t border-ink/10 pt-3">
      <input type="hidden" name="id" value={lead.id} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" name={id("name")} error={errors.name} required>
          <Input id={id("name")} name="name" defaultValue={lead.name} error={errors.name} />
        </Field>
        <Field label="Form" name={id("kind")} error={errors.kind}>
          <Select id={id("kind")} name="kind" defaultValue={lead.kind} error={errors.kind}>
            {kinds.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Email" name={id("email")} error={errors.email}>
          <Input id={id("email")} name="email" type="email" defaultValue={lead.email} error={errors.email} />
        </Field>
        <Field label="Phone" name={id("phone")} error={errors.phone} hint="With the country code: +92 300 1234567.">
          <Input id={id("phone")} name="phone" type="tel" defaultValue={lead.phone} error={errors.phone} />
        </Field>
      </div>
      <Field label="Subject" name={id("subject")}>
        <Input id={id("subject")} name="subject" defaultValue={lead.subject} />
      </Field>
      <Field label="Message" name={id("message")}>
        <Textarea id={id("message")} name="message" defaultValue={lead.message} dir="auto" />
      </Field>
      <Field label="Notes" name={id("notes")} hint="For the team only. Not sent to Bitrix24.">
        <Textarea id={id("notes")} name="notes" defaultValue={lead.notes ?? ""} className="min-h-[80px]" />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
        >
          Close
        </button>
      </div>
    </form>
  );
}
