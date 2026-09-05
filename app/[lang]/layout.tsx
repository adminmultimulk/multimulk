import type { Metadata } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { EnquiryProvider } from "@/app/components/enquiry";
import { WhatsAppButton } from "@/app/components/whatsapp-button";
import { analyticsEnabled, gaId } from "@/app/lib/analytics";
import {
  dirFor,
  hreflangFor,
  intlLocale,
  isLocale,
  isPublished,
  locales,
} from "@/app/lib/i18n/config";
import { I18nProvider } from "@/app/lib/i18n/context";
import { getDictionary } from "@/app/lib/i18n";
import { company, ogImage } from "@/app/lib/content";
import { JsonLd } from "@/app/components/json-ld";
import { organization, webSite } from "@/app/lib/seo/jsonld";
import { siteUrl } from "@/app/lib/site";
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
  //
  // `metadataBase` is what turns every page's relative image path and every
  // `alternates` entry into an absolute URL. Without it Next resolves them
  // against a fallback origin, and relative `hreflang` is simply ignored.
  return {
    metadataBase: siteUrl,
    title: {
      default: t.meta.home.title,
      // Pages set the bare page name; the suffix is added once, here.
      template: `%s | ${company.name}`,
    },
    description: t.meta.home.description,
    openGraph: {
      siteName: company.name,
      locale: intlLocale[lang],
      type: "website",
      // The default card for the whole site. A page that sets its own
      // `openGraph` replaces this block wholesale rather than merging into it
      // — Next shallow-merges metadata — so any page overriding it has to
      // carry its own `images`, and the ones that do are article and
      // residence pages with a photograph better than the brand card.
      images: [ogImage],
    },
    // X reads `og:image` when no `twitter:image` is given, so the card above
    // serves both; this only promotes it from a thumbnail to the wide format.
    twitter: { card: "summary_large_image" },
    // A language still being translated is reachable but must not be indexed;
    // `follow` keeps its outgoing links useful for discovery.
    robots: isPublished(lang) ? undefined : { index: false, follow: true },
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
      // The BCP 47 tag, not the URL segment: `/zh` announces itself as
      // `zh-Hans`, which is what a screen reader and a crawler need.
      lang={hreflangFor[lang]}
      dir={dirFor(lang)}
      className={`${theSeasons.variable} ${manrope.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Stated once for the whole site; every page's own nodes point back
            at these two by `@id` rather than repeating them. */}
        <JsonLd graph={[organization(lang), webSite(lang)]} />
        <I18nProvider locale={lang} dict={dict}>
          {/* Site-wide so that any "Enquire Now" — on a residence card, in a
              grid, anywhere — opens the form in place. Costs one small chunk;
              the form itself only arrives on the first click. */}
          <EnquiryProvider>
            {children}
            <WhatsAppButton />
          </EnquiryProvider>
        </I18nProvider>
      </body>
      {analyticsEnabled && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
