"use client";

import { useActionState, useState, useTransition } from "react";
import {
  importVisitors,
  logWhatsappSent,
  saveVisitor,
  sendDueReminders,
  setVisitorStatus,
} from "@/app/lib/admin/event-actions";
import { STATUS_LABELS } from "@/app/lib/events/config";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";

/**
 * The visitor list's client-side pieces.
 *
 * Three of them do something the server cannot: open WhatsApp, put a message
 * on the clipboard, and reveal an edit form without a page of its own. The
 * rest are ordinary `useActionState` forms and live here only so the list page
 * stays a server component that reads the database directly.
 */

/**
 * Importing by paste rather than by file upload.
 *
 * Selecting cells in Excel and pressing copy puts tab-separated text on the
 * clipboard. That is one keystroke from the sheet the team already has open,
 * and it skips the whole business of a file that has to be exported, saved,
 * found again and kept in step with the sheet it came from.
 */
export function ImportForm() {
  const [state, action, pending] = useActionState(importVisitors, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4" key={state.success ?? "import"}>
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Field
        label="Which tab"
        name="list"
        hint="Kept separate in the report: a client already has a relationship, a visitor is a lead."
      >
        <Select id="list" name="list" defaultValue="Visitors" className="max-w-[220px]">
          <option value="Visitors">Visitors</option>
          <option value="Clients">Clients</option>
        </Select>
      </Field>

      <Field
        label="Paste the rows"
        name="paste"
        error={errors.paste}
        hint="Select the rows in the spreadsheet and paste them here — Ser., Name, Visit Date, Preferred Time, Phone, Email, Remarks. The header row is ignored, and pasting the same sheet again updates what is here instead of duplicating it."
      >
        <Textarea
          id="paste"
          name="paste"
          rows={8}
          spellCheck={false}
          error={errors.paste}
          className="font-mono text-[12px] leading-[20px]"
          placeholder={"1\tMohammed Mehdi\t7 Sep 2026\tAfternoon\t971559488448\tname@example.com\tConfirmed"}
        />
      </Field>

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Importing…" : "Import rows"}
      </Button>
    </form>
  );
}

/** Sends to everyone whose reminder is due, and reports what happened. */
export function SendDueForm({ due }: { due: number }) {
  const [state, action, pending] = useActionState(sendDueReminders, {});

  return (
    <form action={action} className="grid gap-3">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <Button type="submit" disabled={pending || due === 0} className="justify-self-start">
        {pending
          ? "Sending…"
          : due === 0
            ? "Nobody is due right now"
            : `Send ${due} due reminder${due === 1 ? "" : "s"}`}
      </Button>
    </form>
  );
}

/** Changes a booking's state in place, without a save button to forget. */
export function StatusSelect({ id, status }: { id: string; status: string }) {
  return (
    <form action={async (form: FormData) => setVisitorStatus(id, String(form.get("status")))}>
      <Select
        name="status"
        defaultValue={status}
        aria-label="Booking status"
        className="w-[168px] py-1.5 text-[12px]"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </form>
  );
}

/**
 * Opens WhatsApp with the reminder already typed, and records that it did.
 *
 * The window is opened from the click itself rather than after the server has
 * answered: a popup blocker only trusts a navigation that a user gesture
 * started, and awaiting the log first is exactly what turns this into a
 * blocked popup. So the message goes first and the record follows.
 */
export function WhatsappButton({
  id,
  link,
  sent,
}: {
  id: string;
  link: string | null;
  sent: boolean;
}) {
  const [pending, start] = useTransition();

  if (!link)
    return (
      <span className="text-[12px] text-ink/40">No phone number</span>
    );

  return (
    <Button
      type="button"
      variant={sent ? "secondary" : "primary"}
      disabled={pending}
      className="py-1.5 text-[12px]"
      onClick={() => {
        window.open(link, "_blank", "noopener,noreferrer");
        start(async () => {
          await logWhatsappSent(id);
        });
      }}
    >
      {pending ? "Saving…" : sent ? "WhatsApp again" : "WhatsApp"}
    </Button>
  );
}

/** For sending the same text from a phone, or pasting it somewhere else. */
export function CopyButton({ text, label = "Copy message" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // A browser that refuses the clipboard is not worth an alert; the
          // message is on screen in the preview below either way.
          setCopied(false);
        }
      }}
      className="text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

/** The corrected email address, the appointment that moved. */
export function EditVisitorForm({
  visitor,
}: {
  visitor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    visitDateRaw: string;
    preferredTimeRaw: string;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(saveVisitor, {});
  const errors = state.fieldErrors ?? {};

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
      >
        Edit
      </button>
    );

  return (
    <form action={action} className="mt-3 grid gap-3 border-t border-ink/10 pt-3">
      <input type="hidden" name="id" value={visitor.id} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" name={`name-${visitor.id}`} error={errors.name}>
          <Input
            id={`name-${visitor.id}`}
            name="name"
            defaultValue={visitor.name}
            error={errors.name}
          />
        </Field>
        <Field label="Email" name={`email-${visitor.id}`} error={errors.email}>
          <Input
            id={`email-${visitor.id}`}
            name="email"
            type="email"
            defaultValue={visitor.email ?? ""}
            error={errors.email}
          />
        </Field>
        <Field
          label="Phone"
          name={`phone-${visitor.id}`}
          hint="Country code and number, no plus — 971559488448."
        >
          <Input
            id={`phone-${visitor.id}`}
            name="phone"
            defaultValue={visitor.phone ?? ""}
            inputMode="numeric"
          />
        </Field>
        <Field
          label="Visit date"
          name={`visitDate-${visitor.id}`}
          hint="As written: 8 Sep 2026."
        >
          <Input
            id={`visitDate-${visitor.id}`}
            name="visitDate"
            defaultValue={visitor.visitDateRaw}
          />
        </Field>
        <Field
          label="Preferred time"
          name={`preferredTime-${visitor.id}`}
          hint="Morning, Afternoon, 3PM, 1800 hrs — a clock time wins over the word."
        >
          <Input
            id={`preferredTime-${visitor.id}`}
            name="preferredTime"
            defaultValue={visitor.preferredTimeRaw}
          />
        </Field>
        <Field label="Remarks" name={`notes-${visitor.id}`}>
          <Input
            id={`notes-${visitor.id}`}
            name="notes"
            defaultValue={visitor.notes ?? ""}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
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
