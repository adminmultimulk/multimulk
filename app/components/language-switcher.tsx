"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  isOffered,
  locales,
  localeNames,
  stripLocale,
  type Locale,
} from "@/app/lib/i18n/config";
import { useI18n } from "@/app/lib/i18n/context";

/** Matches the cookie the proxy reads when deciding where to send `/`. */
const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Records the choice so a later visit to `/` lands in the same language rather
 * than being re-negotiated from `Accept-Language`. Defined outside the
 * component because it writes to `document`, which the React Compiler will not
 * allow a component body to touch.
 */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/**
 * The language list behind the `EN` control in the nav.
 *
 * Deliberately not a `SelectMenu`, even though it picks a value like one. The
 * site has two dropdown families: form controls, which are cream panels on a
 * white page, and nav chrome, which is dark glass. This one hangs off the nav
 * bar and opens alongside the mega-menus, so it belongs to the second — the
 * header reads as one surface rather than sprouting a light panel. Its skin is
 * set by the anchored container in `site-nav.tsx`.
 *
 * Switching keeps the reader on the page they are on: the current pathname is
 * stripped of its locale segment and re-prefixed with the chosen one.
 */
export function LanguageSwitcher({
  onSelect,
  /**
   * `compact` is the nav dropdown: a narrow stack of two-letter codes, divided
   * by hairlines, with the language already in use left out — it is the one
   * showing on the trigger. `full` is the mobile menu, which has the width to
   * name each language in its own script and lists them all.
   */
  variant = "compact",
}: {
  onSelect?: () => void;
  variant?: "compact" | "full";
}) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const compact = variant === "compact";

  const choose = (next: Locale) => {
    rememberLocale(next);
    onSelect?.();
    if (next === locale) return;
    const rest = stripLocale(pathname);
    router.push(rest === "/" ? `/${next}` : `/${next}${rest}`);
  };

  // Everything except a `preview` locale, which is reachable by URL only, for
  // whoever is translating it. The reader's current locale is always listed,
  // so someone testing one does not lose the control that got them there.
  const offered = locales.filter((code) => isOffered(code) || code === locale);
  const shown = compact ? offered.filter((code) => code !== locale) : offered;

  return (
    <ul
      aria-label={t.common.chooseLanguage}
      className={compact ? "divide-y divide-cream/15" : "flex flex-col gap-1"}
    >
      {shown.map((code, i) => {
        const isActive = code === locale;
        const name = localeNames[code];

        return (
          <li
            key={code}
            style={{ animationDelay: `${60 + i * 55}ms` }}
            className="animate-menu-rise"
          >
            <button
              type="button"
              lang={code}
              onClick={() => choose(code)}
              aria-current={isActive}
              /* The visible label is the code; the native name is what gets
                 announced, so the control is not read out as two letters. */
              aria-label={name.native}
              className={
                compact
                  ? "w-full cursor-pointer py-3 text-center text-[12px] tracking-[0.08em] text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
                  : `flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-start text-[13px] transition-colors ${
                      isActive ? "text-cream" : "text-cream/70 hover:text-cream"
                    }`
              }
            >
              {compact ? (
                name.short
              ) : (
                <>
                  <span>{name.native}</span>
                  <span className="text-[10px] tracking-[0.08em] text-cream/50">
                    {name.short}
                  </span>
                </>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
