import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from "./app/lib/i18n/config";

/** Remembers the reader's choice from the language switcher, for a year. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Picks a locale from an `Accept-Language` header without pulling in a
 * negotiator: entries are sorted by their q-value, then the first one whose
 * language subtag we publish wins. `ar-SA` matches `ar`, `en-US` matches `en`.
 */
function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localised — nothing to do.
  const first = pathname.split("/")[1];
  if (first && isLocale(first)) return;

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    (cookie && isLocale(cookie) && cookie) ||
    fromAcceptLanguage(request.headers.get("accept-language")) ||
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  // 307, not 308: the language a visitor is sent to depends on their headers
  // and their cookie, so this redirect must never be cached as permanent.
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  /**
   * Everything except Next's internals, the files under `public/`, and the
   * well-known metadata routes — none of which should ever gain a locale
   * prefix. The trailing clause skips any path with a file extension.
   */
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml|images/|logos/|.*\\.[\\w]+$).*)",
  ],
};

export { locales };
