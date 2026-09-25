"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackEvent } from "@/app/lib/analytics";
import { registerPartner, type PartnerState } from "@/app/lib/leads/actions";
import { partnerTracks, type PartnerTrack } from "@/app/lib/partners";
import { PhoneField } from "./phone-field";
import { SelectMenu } from "./select-menu";

const initialState: PartnerState = { status: "idle" };

const inputStyle =
  "w-full border-b border-ink/30 bg-transparent px-0 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink/40 focus:border-ink aria-invalid:border-red-700";
const labelStyle = "block text-[13px] text-ink";

/**
 * The /partner-with-us registration form: partnership type, first and last
 * name, phone, email, message and a consent box, each an underlined field on
 * the tinted panel.
 *
 * Name, phone, email and error wording are the contact form's, so the two read
 * alike. The track and the split name are folded into an ordinary lead by
 * `registerPartner`.
 *
 * `token` is minted by the Server Component that renders this form; see
 * `app/lib/leads/token.ts`.
 */
export function PartnerForm({ token }: { token: string }) {
  const { t, locale } = useI18n();
  const form = t.contact.form;
  const copy = t.partners;
  const path = usePathname();
  const [state, action, pending] = useActionState(registerPartner, initialState);
  const [track, setTrack] = useState<PartnerTrack>(partnerTracks[0]);
  const started = useRef(false);

  const errors = state.status === "invalid" ? state.errors : undefined;

  useEffect(() => {
    if (state.status === "sent") {
      trackEvent("generate_lead", { enquiry_type: "partnership", locale });
    } else if (state.status === "invalid") {
      trackEvent("form_error", { fields: Object.keys(state.errors).join(",") });
    }
    // `locale` only describes the submission that just settled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { locale });
  };

  if (state.status === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
        <h3 className="font-display text-[28px] text-ink">
          {copy.form.sentHeading}
        </h3>
        <p className="mt-3 max-w-[360px] text-[13.5px] leading-[22px] text-ink/70">
          {copy.form.sentBody}
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onInput={onFirstInput}
      className="grid w-full content-start gap-x-4 gap-y-7 sm:grid-cols-2"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="t" value={token} />

      {/* Invisible to readers and to screen readers; only bots fill it in. */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <span className={labelStyle}>{copy.form.track} *</span>
        <SelectMenu
          label={copy.form.track}
          name="track"
          required
          value={track}
          onChange={(v) => setTrack(v as PartnerTrack)}
          options={[...partnerTracks]}
          format={(v) => copy.tracks[v as PartnerTrack].option}
          triggerClassName="border-b border-ink/30 bg-transparent py-2.5 text-[13.5px] text-ink focus-visible:border-ink"
        />
      </div>

      <Field
        label={copy.form.firstName}
        name="firstName"
        autoComplete="given-name"
        placeholder={copy.form.firstNamePlaceholder}
        error={errors?.firstName && form.errors[errors.firstName]}
      />
      <Field
        label={copy.form.lastName}
        name="lastName"
        autoComplete="family-name"
        placeholder={copy.form.lastNamePlaceholder}
        error={errors?.lastName && form.errors[errors.lastName]}
      />

      <PhoneField
        variant="underline"
        label={form.phone}
        codeLabel={form.countryCode}
        placeholder={form.phonePlaceholder}
        error={errors?.phone && form.errors[errors.phone]}
      />
      <Field
        label={form.email}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={form.emailPlaceholder}
        error={errors?.email && form.errors[errors.email]}
      />

      <label className="sm:col-span-2">
        <span className={labelStyle}>{form.message} *</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={copy.form.messagePlaceholder}
          aria-invalid={errors?.message ? true : undefined}
          className={`resize-y ${inputStyle}`}
        />
        {errors?.message ? (
          <FieldError>{form.errors[errors.message]}</FieldError>
        ) : null}
      </label>

      <label className="flex items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={errors?.consent ? true : undefined}
          className="mt-[3px] size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-ink/50 bg-transparent checked:border-[5px] checked:border-forest aria-invalid:border-red-700"
        />
        <span className="text-[13px] leading-[21px] text-ink">
          {form.consent}
          {errors?.consent ? (
            <FieldError>{copy.form.consentRequired}</FieldError>
          ) : null}
        </span>
      </label>

      {state.status === "failed" ? (
        <p
          role="alert"
          className="rounded-sm border border-red-800/30 bg-red-50 px-4 py-3 text-[12.5px] leading-[19px] text-red-900 sm:col-span-2"
        >
          {state.reason === "rate" ? form.errors.rate : form.errors.server}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-ink/70 px-8 py-3 font-display text-[15px] text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? form.submitting : copy.form.submit}
        </button>
      </div>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label>
      <span className={labelStyle}>{label} *</span>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={inputStyle}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}
