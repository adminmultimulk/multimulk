"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveBlogAgentSettings,
  writePostNow,
} from "@/app/lib/admin/blog-agent-actions";
import type { AgentSettings } from "@/app/lib/blog-agent/settings";
import { Alert, Button, Field, Input, Textarea } from "./ui";

/** The blog agent page's client-side pieces; the page itself reads the database. */

export function BlogAgentSettingsForm({
  settings,
  earliest,
  latest,
}: {
  settings: AgentSettings;
  earliest: string;
  latest: string;
}) {
  const [state, action, pending] = useActionState(saveBlogAgentSettings, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Publish time (Istanbul)"
          name="publishTime"
          error={errors.publishTime}
          hint={`When each day's post goes live. Between ${earliest} and ${latest}.`}
        >
          <Input
            id="publishTime"
            name="publishTime"
            type="time"
            min={earliest}
            max={latest}
            defaultValue={settings.publishTime}
            error={errors.publishTime}
            className="max-w-[160px]"
          />
        </Field>

        <Field
          label="Maximum cost per post (USD)"
          name="budgetUsd"
          error={errors.budgetUsd}
          hint="A post usually costs about $0.25. At half this the agent stops researching; at the full amount it gives up for the day."
        >
          <Input
            id="budgetUsd"
            name="budgetUsd"
            type="number"
            step="0.05"
            min="0.1"
            max="2"
            defaultValue={settings.budgetUsd.toFixed(2)}
            error={errors.budgetUsd}
            className="max-w-[160px]"
          />
        </Field>
      </div>

      <Field
        label="Topics to focus on"
        name="focus"
        error={errors.focus}
        hint="Optional. Leave empty and the agent rotates through citizenship, golden visas, Türkiye property, the economy and travel news by weekday. Fill it in and every post stays within it, e.g. “Istanbul and Antalya property prices for Gulf buyers”."
      >
        <Textarea
          id="focus"
          name="focus"
          rows={3}
          defaultValue={settings.focus ?? ""}
          placeholder="Empty: the agent picks the day's topic itself"
          error={errors.focus}
          className="min-h-[80px]"
        />
      </Field>

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

export function WritePostNowForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState(() => writePostNow(), {});

  return (
    <form action={action} className="grid gap-3">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <Button type="submit" disabled={pending || disabled} className="justify-self-start">
        {pending ? "Starting…" : disabled ? "Writing a post…" : "Write a post now"}
      </Button>
    </form>
  );
}

/** Re-reads the page every few seconds while a run is in progress. */
export function RefreshWhileRunning({ running }: { running: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => router.refresh(), 5_000);
    return () => clearInterval(timer);
  }, [running, router]);
  return null;
}
