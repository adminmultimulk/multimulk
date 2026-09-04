import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

/**
 * The dashboard's root layout.
 *
 * A second root layout, sibling to `app/[lang]/layout.tsx`: the admin area is
 * not localised, not indexed and shares none of the site's chrome, so nesting
 * it under the public shell would mean carrying a language, a nav and a
 * WhatsApp button into a tool that wants none of them. Next allows more than
 * one root layout so long as no `app/layout.tsx` sits above them.
 */
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Multi Mulk Dashboard" },
  // Nothing here is for readers or for crawlers.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="min-h-full bg-cream font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
