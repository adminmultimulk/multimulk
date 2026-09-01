import type { Metadata } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "@/app/components/whatsapp-button";
import { dirFor, isLocale, locales } from "@/app/lib/i18n/config";
import { I18nProvider } from "@/app/lib/i18n/context";
import { getDictionary } from "@/app/lib/i18n";
import "../globals.css";

/**
 * The Seasons — the display face, used by every title on the site through the
 * `font-display` class. Self-hosted from app/fonts.
 *
 * Every title renders at weight 300, so Light is the only cut that actually
 * paints; Regular and Bold are here as headroom. The italics are omitted
 * because nothing sets them — add a src entry if that changes.
 *
 * The family covers Latin only. Cyrillic falls through to Georgia below, and
 * Arabic and Urdu fall through to Vazirmatn, loaded after it. Turkish
 * diacritics, curly quotes and dashes are all covered.
 */
const theSeasons = localFont({
  variable: "--font-the-seasons",
  display: "swap",
  // Both fallback options are off, and the Latin fallbacks live in the
  // `--font-display` stack in globals.css instead. `fallback` is folded into
  // `--font-the-seasons` itself, generic `serif` and all, which would end the
  // family list early; `adjustFontFallback` is worse — the metric-matched face
  // it synthesises is Times New Roman, which carries Arabic on macOS and so
  // swallowed every Arabic glyph before Vazirmatn was ever reached.
  adjustFontFallback: false,
  src: [
    { path: "../fonts/TheSeasons-Light.woff2", weight: "300", style: "normal" },
    {
      path: "../fonts/TheSeasons-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "../fonts/TheSeasons-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * Body copy.
 *
 * `next/font/google` ignores `adjustFontFallback: false`, so `--font-manrope`
 * always expands to `"Manrope", "Manrope Fallback"` — and that Arial-derived
 * fallback has Arabic coverage. The `--font-sans` stack in globals.css
 * therefore names the two halves separately and slots Vazirmatn between them;
 * see the note there.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

/**
 * Arabic and Urdu, for both the display and body roles. Neither The Seasons
 * nor Manrope carries a single Arabic glyph, so without this the page falls to
 * whatever the device happens to have.
 *
 * Vazirmatn is a variable face, so the whole 100–900 range comes down in one
 * file — which matters because the display role sets 300 and the body 400.
 */
const vazirmatn = Vazirmatn({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
  // It sits in every page's font stack — fallback resolves per glyph, so it
  // only ever paints Arabic — but three of the five languages never reach it.
  // Preloading is therefore left off: the face is still declared in the
  // critical CSS, so an Arabic page starts fetching it at first paint.
  preload: false,
});

/** Pre-renders all five languages at build time. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  // Defaults only. Each page sets its own title, description and — because a
  // layout cannot know which child is rendering — its own `hreflang` block.
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${theSeasons.variable} ${manrope.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={lang} dict={dict}>
          {children}
          <WhatsAppButton />
        </I18nProvider>
      </body>
    </html>
  );
}
