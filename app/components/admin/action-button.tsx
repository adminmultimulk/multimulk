"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui";

/**
 * A button that runs a bound server action.
 *
 * Destructive ones ask first, and ask in place: a second click on the same
 * button, relabelled. `window.confirm` would do the same job and would also be
 * the one piece of this dashboard that blocks the whole tab, so it is not used
 * anywhere here.
 */
export function ActionButton({
  action,
  label,
  busyLabel,
  confirmLabel,
  variant = "secondary",
}: {
  action: () => Promise<void>;
  label: string;
  busyLabel?: string;
  /** Set to require a second click before the action runs. */
  confirmLabel?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const [pending, start] = useTransition();
  const [armed, setArmed] = useState(false);

  if (confirmLabel && armed)
    return (
      <span className="inline-flex items-center gap-1.5">
        <Button
          type="button"
          variant="danger"
          disabled={pending}
          onClick={() => start(async () => { await action(); })}
        >
          {pending ? (busyLabel ?? "Working…") : confirmLabel}
        </Button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          className="text-[12px] text-ink/55 underline underline-offset-2 hover:text-ink"
        >
          Keep
        </button>
      </span>
    );

  return (
    <Button
      type="button"
      variant={variant}
      disabled={pending}
      onClick={() =>
        confirmLabel
          ? setArmed(true)
          : start(async () => { await action(); })
      }
    >
      {pending ? (busyLabel ?? "Working…") : label}
    </Button>
  );
}
