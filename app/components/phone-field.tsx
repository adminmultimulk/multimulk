"use client";

/**
 * A phone number as two controls: the country, then the number as the reader
 * dials it at home.
 *
 * Asking for the country separately is what lets the Server Action stop
 * guessing. Enquiries arrive from the Gulf, Türkiye, Pakistan and Europe in
 * every local convention — a trunk zero, a `00` prefix, no prefix at all — and
 * `composePhone` in `app/lib/leads/phone.ts` turns the pair into one E.164
 * number the CRM can dial from any office.
 *
 * Shared by the contact form and the brochure dialog, which post the same two
 * fields — `phoneCountry` and `phone` — to the same validator.
 */

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/app/lib/i18n/context";
import {
  countryCodes,
  countryNameFor,
  defaultCountryFor,
  dialCodeFor,
  isCountryCode,
  type CountryCode,
} from "@/app/lib/leads/phone";
import { SelectMenu } from "./select-menu";

const inputClassName =
  "w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold aria-invalid:border-red-700";

/**
 * The region in the browser's own language tag — `en-AE` says more about
 * where the reader is than the page's language does. Only known on the
 * client, so it is read as an external store: undefined during the server
 * render and hydration, then whatever the browser says. It never changes
 * while the page is open, hence the subscription that does nothing.
 */
function browserRegion(): CountryCode | undefined {
  try {
    const region = new Intl.Locale(navigator.language).region;
    return isCountryCode(region) ? region : undefined;
  } catch {
    return undefined;
  }
}

const never = () => () => {};
const unknownOnServer = () => undefined;

export function PhoneField({
  label,
  codeLabel,
  placeholder,
  error,
  className = "",
}: {
  label: string;
  /** Accessible name for the country picker, which shows only a code. */
  codeLabel: string;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  const { locale } = useI18n();
  const id = useId();
  // The reader's own choice beats the browser's region, which beats the
  // guess made from the page's language.
  const [chosen, setChosen] = useState<CountryCode | null>(null);
  const region = useSyncExternalStore(never, browserRegion, unknownOnServer);
  const country = chosen ?? region ?? defaultCountryFor(locale);

  // Country names in the reader's language, with the English list as the
  // fallback for anything the runtime cannot name. Sorted by that name, so
  // the list reads — and type-ahead searches — the way the reader spells it.
  const { names, options } = useMemo(() => {
    let display: Intl.DisplayNames | undefined;
    try {
      display = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      display = undefined;
    }

    const names = new Map<CountryCode, string>();
    for (const code of countryCodes) {
      let name: string | undefined;
      try {
        name = display?.of(code);
      } catch {
        name = undefined;
      }
      names.set(code, name && name !== code ? name : countryNameFor(code));
    }

    const collator = new Intl.Collator(locale);
    const options = [...countryCodes].sort((a, b) =>
      collator.compare(names.get(a)!, names.get(b)!),
    );

    return { names, options };
  }, [locale]);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12.5px] text-ink/70"
      >
        {label} <span className="text-gold">*</span>
      </label>

      {/* A number reads left to right whatever the page does. */}
      <div dir="ltr" className="flex gap-2">
        <SelectMenu
          label={codeLabel}
          name="phoneCountry"
          required
          value={country}
          onChange={(value) => setChosen(value as CountryCode)}
          options={options}
          // The code is isolated (LRI … PDI) so that in an Arabic or Urdu
          // list it still reads "+90" and not "90+".
          format={(code) =>
            `${names.get(code as CountryCode)} \u2066${dialCodeFor(code as CountryCode)}\u2069`
          }
          formatSelected={(code) => dialCodeFor(code as CountryCode)}
          className="w-[108px] shrink-0"
          triggerClassName={`h-full rounded-sm border bg-white px-3 py-3 text-[13.5px] text-ink focus-visible:border-gold ${
            error ? "border-red-700" : "border-ink/15"
          }`}
          panelClassName="w-[280px] max-w-[calc(100vw-2rem)]"
        />
        <input
          id={id}
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          required
          aria-invalid={error ? true : undefined}
          className={inputClassName}
        />
      </div>

      {error ? (
        <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
          {error}
        </span>
      ) : null}
    </div>
  );
}
