import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import { WhatsAppButton } from "./components/whatsapp-button";
import "./globals.css";

/**
 * The Seasons — the display face, used by every title on the site through the
 * `font-display` class. Self-hosted from app/fonts.
 *
 * Every title renders at weight 300, so Light is the only cut that actually
 * paints; Regular and Bold are here as headroom. The italics are omitted
 * because nothing sets them — add a src entry if that changes.
 *
 * The family has no Cyrillic, so the one Russian headline in media.ts falls
 * through to Georgia below. Turkish diacritics, curly quotes and dashes are
 * all covered.
 */
const theSeasons = localFont({
  variable: "--font-the-seasons",
  display: "swap",
  // Georgia carries the Cyrillic The Seasons lacks, and is a serif — so the
  // one headline that needs it stays in the same voice.
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
  src: [
    { path: "./fonts/TheSeasons-Light.woff2", weight: "300", style: "normal" },
    {
      path: "./fonts/TheSeasons-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "./fonts/TheSeasons-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Multi Mulk | Global Solutions for Global Citizens",
  description:
    "Multi Mulk connects global citizens with luxury residences and citizenship-by-investment opportunities across the UAE, Türkiye and the Caribbean.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${theSeasons.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
