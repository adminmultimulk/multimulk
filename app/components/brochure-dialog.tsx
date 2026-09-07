"use client";

/**
 * The brochure request as a modal, opened from any "Download Brochure".
 *
 * Three fields, because that is the whole trade being offered: a name, a phone
 * number and an email for a PDF. Everything the sales team reads beside it —
 * which development, which page it was asked from, what kind of enquiry it is
 * — is composed by the Server Action from the slug, so none of it is typed
 * here and none of it can be forged there.
 *
 * Loaded on demand by `./brochure.tsx`; see the note there.
 */

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackEvent } from "@/app/lib/analytics";
import { interpolate } from "@/app/lib/i18n/format";
import {
  issueFormToken,
  requestBrochure,
  type BrochureState,
} from "@/app/lib/leads/actions";
import type { BrochureContext } from "./brochure";
import { Download } from "./icons";
import { Link } from "./link";
import { Modal } from "./modal";

const initialState: BrochureState = { status: "idle" };

export default function BrochureDialog({
  context,
  onClose,
}: {
  context: BrochureContext;
  onClose: () => void;
}) {
  const headingId = useId();

  // The form cannot render against a token it does not have yet; `null` is
  // "still asking", `""` is the legitimate value when no `LEAD_SECRET` is set.
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    issueFormToken().then(
      (value) => live && setToken(value),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, []);

  return (
    <Modal
      onClose={onClose}
      labelledBy={headingId}
      className="max-w-[520px] p-6 sm:p-10"
    >
      <Body
        context={context}
        headingId={headingId}
        token={token}
        failed={failed}
      />
    </Modal>
  );
}

/**
 * The form, or an honest account of why it is not there yet. Nothing is
 * rendered with a token we are not sure of: a submission carrying a bad one is
 * treated as a bot and thanked without being delivered.
 */
function Body({
  context,
  headingId,
  token,
  failed,
}: {
  context: BrochureContext;
  headingId: string;
  token: string | null;
  failed: boolean;
}) {
  const { t, locale } = useI18n();
  const copy = t.brochure;
  const form = t.contact.form;
  const path = usePathname();
  const [state, action, pending] = useActionState(
    requestBrochure,
    initialState,
  );
  const started = useRef(false);

  const errors = state.status === "invalid" ? state.errors : undefined;

  useEffect(() => {
    if (state.status === "sent") {
      trackEvent("brochure_request", { project: context.project, locale });
    } else if (state.status === "invalid") {
      trackEvent("form_error", { fields: Object.keys(state.errors).join(",") });
    }
    // `context` and `locale` only describe the request that just settled;
    // re-running when the reader edits the form would double-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /** Fires once per mount, the first time the reader touches the form. */
  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { locale });
  };

  if (state.status === "sent") {
    return (
      <div className="py-6 text-center">
        <h2 id={headingId} className="font-display text-[26px] text-ink">
          {copy.sentHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-[340px] text-[13px] leading-[21px] text-ink/70">
          {withProject(copy.sentBody, context.project)}
        </p>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
        <h2 id={headingId} className="sr-only">
          {interpolate(copy.heading, { project: context.project })}
        </h2>
        <p
          role="alert"
          className="max-w-[320px] text-[13px] leading-[21px] text-ink/80"
        >
          {form.errors.load}
        </p>
        <Link
          href="/contact-us"
          className="mt-6 rounded-full border border-ink/25 px-7 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
        >
          {t.common.getInTouch}
        </Link>
      </div>
    );
  }

  return (
    <>
      {context.eyebrow ? (
        <p className="mb-3 pe-10 text-[10.5px] uppercase tracking-[0.12em] text-gold">
          <bdi>{context.eyebrow}</bdi>
        </p>
      ) : null}

      <h2
        id={headingId}
        className="pe-10 font-display text-[26px] leading-[1.22] text-ink sm:text-[30px]"
      >
        {withProject(copy.heading, context.project)}
      </h2>

      <p className="mt-4 text-[13px] leading-[22px] text-ink/80">{copy.body}</p>

      {token === null ? (
        <div
          aria-hidden
          className="mt-7 min-h-[300px] animate-pulse border border-ink/10 bg-white"
        />
      ) : (
        <form
          action={action}
          onInput={onFirstInput}
          className="mt-7 grid gap-5"
          noValidate
        >
          {/* Context the action cannot work out for itself. The slug is what
              it resolves the file from, so a request can only ever name a
              brochure the site publishes. */}
          <input type="hidden" name="project" value={context.slug} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="path" value={path} />
          <input type="hidden" name="t" value={token} />

          {/* Invisible to readers and to screen readers; only bots fill it in. */}
          <div aria-hidden className="hidden">
            <label>
              Company
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <Field
            label={form.name}
            name="name"
            autoComplete="name"
            placeholder={form.namePlaceholder}
            error={errors?.name && form.errors[errors.name]}
          />
          <Field
            label={form.email}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.emailPlaceholder}
            error={errors?.email && form.errors[errors.email]}
          />
          <Field
            label={form.phone}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={form.phonePlaceholder}
            error={errors?.phone && form.errors[errors.phone]}
          />

          <p className="text-[11px] leading-[17px] text-ink/60">
            {copy.consent}
          </p>

          {state.status === "failed" ? (
            <p
              role="alert"
              className="rounded-sm border border-red-800/30 bg-red-50 px-4 py-3 text-[12.5px] leading-[19px] text-red-900"
            >
              {state.reason === "rate" ? form.errors.rate : form.errors.server}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              copy.submitting
            ) : (
              <>
                <Download className="w-4" />
                {copy.submit}
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}

/**
 * A sentence with the development's name in the middle of it.
 *
 * The name is the same in every language — Latin, in an Arabic or Urdu
 * sentence as often as not — so it is isolated on its own rather than left to
 * inherit the paragraph's direction, which would drag the punctuation around
 * it to the wrong end.
 */
function withProject(template: string, project: string) {
  const [before, after] = interpolate(template, {
    project: "\u0000",
  }).split("\u0000");

  return (
    <>
      {before}
      <bdi>{project}</bdi>
      {after}
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-[12.5px] text-ink/70">
        {label} <span className="text-gold">*</span>
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={error ? true : undefined}
        className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold aria-invalid:border-red-700"
      />
      {error ? (
        <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
          {error}
        </span>
      ) : null}
    </label>
  );
}
