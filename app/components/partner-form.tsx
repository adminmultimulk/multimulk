"use client";

import {
  Suspense,
  useActionState,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackEvent } from "@/app/lib/analytics";
import { registerPartner, type PartnerState } from "@/app/lib/leads/actions";
import { isPartnerType, partnerTypes, type PartnerType } from "@/app/lib/partners";
import { SelectMenu } from "./select-menu";

const initialState: PartnerState = { status: "idle" };

const inputStyle =
  "w-full border-b border-ink/30 bg-transparent px-0 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-ink/40 focus:border-ink aria-invalid:border-red-700";
const labelStyle = "block text-[13px] leading-[20px] text-ink";

/**
 * The /partner-with-us registration form: name and company, one contact field
 * that takes an email or a WhatsApp number, the partnership type, the markets
 * served and an optional message, each an underlined field on the tinted
 * panel.
 *
 * The type opens unchosen, unless the reader arrived from one of the
 * partnership cards, whose links carry `?type=` — see `TypeFromQuery`.
 * Error wording for the shared cases is the contact form's, so the two read
 * alike.
 *
 * `token` is minted by the Server Component that renders this form; see
 * `app/lib/leads/token.ts`. `privacy` is the line under the button, rendered
 * there because it links into the route table.
 */
export function PartnerForm({
  token,
  privacy,
}: {
  token: string;
  privacy: ReactNode;
}) {
  const { t, locale } = useI18n();
  const shared = t.contact.form;
  const copy = t.partners.form;
  const path = usePathname();
  const [state, action, pending] = useActionState(registerPartner, initialState);
  const [type, setType] = useState<PartnerType | "">("");
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
      <div
        role="status"
        className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center"
      >
        <h3 className="font-display text-[28px] text-ink">{copy.sentHeading}</h3>
        <p className="mt-3 max-w-[380px] text-[13.5px] leading-[22px] text-ink/70">
          {copy.sentBody}
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onInput={onFirstInput}
      className="grid w-full content-start gap-y-7"
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

      <Suspense fallback={null}>
        <TypeFromQuery onType={setType} />
      </Suspense>

      <Field
        label={copy.name}
        name="name"
        autoComplete="organization"
        placeholder={copy.namePlaceholder}
        error={errors?.name && shared.errors[errors.name]}
      />
      <Field
        label={copy.contact}
        name="contact"
        autoComplete="email"
        placeholder={copy.contactPlaceholder}
        error={
          errors?.contact &&
          (errors.contact === "contact"
            ? copy.errors.contact
            : shared.errors[errors.contact])
        }
      />

      <div>
        <span className={labelStyle}>{copy.type} *</span>
        <SelectMenu
          label={copy.type}
          name="type"
          required
          value={type}
          onChange={(v) => setType(v as PartnerType)}
          options={partnerTypes}
          format={(v) => copy.types[v as PartnerType]}
          placeholder={copy.typePlaceholder}
          triggerClassName={`border-b bg-transparent py-2.5 text-[13.5px] text-ink focus-visible:border-ink ${
            errors?.type ? "border-red-700" : "border-ink/30"
          }`}
        />
        {errors?.type ? <FieldError>{copy.errors.type}</FieldError> : null}
      </div>

      {/* Two lines rather than one: the placeholder's example list is the
          prompt, and a single line cuts it off. */}
      <label>
        <span className={labelStyle}>{copy.markets} *</span>
        <textarea
          name="markets"
          required
          rows={2}
          placeholder={copy.marketsPlaceholder}
          aria-invalid={errors?.markets ? true : undefined}
          className={`resize-none ${inputStyle}`}
        />
        {errors?.markets ? (
          <FieldError>{shared.errors[errors.markets]}</FieldError>
        ) : null}
      </label>

      <label>
        <span className={labelStyle}>{copy.message}</span>
        <textarea
          name="message"
          rows={4}
          placeholder={copy.messagePlaceholder}
          aria-invalid={errors?.message ? true : undefined}
          className={`resize-y ${inputStyle}`}
        />
        {errors?.message ? (
          <FieldError>{shared.errors[errors.message]}</FieldError>
        ) : null}
      </label>

      {state.status === "failed" ? (
        <p
          role="alert"
          className="rounded-sm border border-red-800/30 bg-red-50 px-4 py-3 text-[12.5px] leading-[19px] text-red-900"
        >
          {state.reason === "rate" ? shared.errors.rate : shared.errors.server}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-ink/70 px-8 py-3 font-display text-[15px] text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? shared.submitting : copy.submit}
        </button>
        <p className="mt-5 max-w-[520px] text-[12px] leading-[19px] text-ink/65">
          {privacy}
        </p>
      </div>
    </form>
  );
}

/**
 * Chooses the partnership type a card linked with, as `?type=real-estate`.
 *
 * Its own component behind a Suspense boundary because reading the query
 * string opts whatever sits above the nearest boundary out of prerendering;
 * kept this small, only this renders client-side and the form itself stays in
 * the HTML. Re-runs when a card on the same page is clicked, since that
 * changes the query without a reload.
 */
function TypeFromQuery({ onType }: { onType: (type: PartnerType) => void }) {
  const requested = useSearchParams().get("type");
  useEffect(() => {
    if (isPartnerType(requested)) onType(requested);
  }, [requested, onType]);
  return null;
}

function FieldError({ children }: { children: ReactNode }) {
  return (
    <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label>
      <span className={labelStyle}>{label} *</span>
      <input
        type="text"
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
