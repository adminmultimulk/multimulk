"use client";

/**
 * The enquiry form as a modal, opened from any "Enquire Now".
 *
 * Same two columns as `/contact-us` — who to talk to on one side, the form on
 * the other — at the size a dialog can carry. Loaded on demand by
 * `./enquiry.tsx`; see the note there.
 */

import { useEffect, useId, useRef, useState } from "react";
import { contact } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { issueFormToken } from "@/app/lib/leads/actions";
import { ContactForm } from "./contact-form";
import type { EnquiryContext } from "./enquiry";
import { Close, Mail, MapPin, Phone } from "./icons";
import { Link } from "./link";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function EnquiryDialog({
  context,
  onClose,
}: {
  context: EnquiryContext;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const pressedBackdrop = useRef(false);
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

  // The page behind must not scroll while the dialog is over it, and whatever
  // was focused before — the "Enquire Now" that opened this — gets it back.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    return () => {
      document.body.style.overflow = scroll;
      opener?.focus();
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // A select menu inside the form handles Escape itself, closing its own
    // panel and calling `preventDefault`. Without this check that keystroke
    // would carry on and take the whole dialog with it.
    if (event.key === "Escape" && !event.defaultPrevented) {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;

    // `offsetParent` filters out anything the layout is currently hiding —
    // the form's honeypot, and every field once it says "Thank You".
    const stops = [
      ...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ].filter((el) => el.offsetParent !== null);
    if (stops.length === 0) return;

    const first = stops[0];
    const last = stops[stops.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panel.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      onKeyDown={onKeyDown}
      // The press has to have started on the backdrop as well as ended there.
      // Selecting text in the message field and releasing past the panel's
      // edge is a click on the backdrop by every other measure, and it would
      // otherwise throw away a form somebody had just filled in.
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedBackdrop.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain bg-forest-deep/75 p-4 py-8 sm:p-8"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="animate-select-open relative my-auto w-full max-w-[1020px] bg-mist p-6 shadow-[0_40px_90px_-24px_rgba(7,31,19,0.65)] outline-none sm:p-10 lg:p-14"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="absolute end-4 top-4 p-2 text-ink/50 transition-colors hover:text-ink sm:end-6 sm:top-6"
        >
          <Close className="w-4" />
        </button>

        {/*
         * Three blocks, in the order a phone should read them: what this is
         * about, then the form they came for, then who to talk to instead.
         * The explicit placement folds the first and third back into one
         * column beside the form once there is room for two.
         */}
        {/* `auto_1fr`: the form is taller than the two blocks beside it, and
            the slack has to land in the second row. Left to distribute itself,
            grid pads the heading's row and opens a hole under it. */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-7">
          <div className="lg:col-start-1 lg:row-start-1">
            {context.eyebrow ? (
              <p className="mb-4 pe-10 text-[10.5px] uppercase tracking-[0.12em] text-gold sm:pe-0">
                <bdi>{context.eyebrow}</bdi>
              </p>
            ) : null}

            <h2
              id={headingId}
              className="max-w-[420px] pe-10 font-display text-[26px] leading-[1.22] text-ink sm:pe-0 sm:text-[34px]"
            >
              {t.contact.leadHeading}
            </h2>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Body context={context} token={token} failed={failed} />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="max-w-[430px] text-[13px] leading-[22px] text-ink/80">
              {t.contact.leadBody}
            </p>

            <dl className="mt-8 space-y-5">
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                  {t.contact.emailLabel}
                </dt>
                <dd className="mt-2 flex items-start gap-2.5">
                  <Mail className="mt-0.5 w-4 shrink-0 text-ink/50" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="num text-[13px] text-ink transition-colors hover:text-gold"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                  {t.contact.phoneLabel}
                </dt>
                <dd className="mt-2 flex items-start gap-2.5">
                  <Phone className="mt-0.5 w-4 shrink-0 text-ink/50" />
                  <span className="flex flex-col gap-1.5">
                    {contact.phones.map((phone) => (
                      <a
                        key={phone.number}
                        href={`tel:${phone.number.replace(/\s/g, "")}`}
                        className="text-[13px] text-ink transition-colors hover:text-gold"
                      >
                        <span className="text-ink/50">
                          {t.footer.offices[phone.key]}
                        </span>{" "}
                        <span className="num">{phone.number}</span>
                      </a>
                    ))}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                  {t.contact.addressLabel}
                </dt>
                <dd className="mt-2 flex items-start gap-2.5">
                  <MapPin className="mt-0.5 w-3.5 shrink-0 text-ink/50" />
                  <span className="max-w-[290px] text-[13px] leading-[20px] text-ink">
                    {t.footer.address}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The form, or an honest account of why it is not there yet. Nothing is
 * rendered with a token we are not sure of: a submission carrying a bad one is
 * treated as a bot and thanked without being delivered.
 */
function Body({
  context,
  token,
  failed,
}: {
  context: EnquiryContext;
  token: string | null;
  failed: boolean;
}) {
  const { t } = useI18n();
  const form = t.contact.form;

  if (failed) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center border border-ink/10 bg-white px-8 text-center">
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

  if (token === null) {
    return (
      <div
        aria-hidden
        className="min-h-[280px] animate-pulse border border-ink/10 bg-white"
      />
    );
  }

  return (
    <ContactForm
      token={token}
      defaultEnquiry={context.enquiryType}
      defaultSubject={context.subject}
      programme={context.programme}
    />
  );
}
