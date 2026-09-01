"use client";

import { SlideUpText } from "@/components/ui/slide-up-text";
import { useI18n } from "@/app/lib/i18n/context";
import { cn } from "@/lib/utils";

type Align = "left" | "center";

/**
 * Site-wide title treatment built on SlideUpText.
 *
 * Three things it normalises for every caller:
 *
 * 1. SlideUpText renders a `flex flex-wrap` container, so `text-center` on the
 *    heading has no effect — alignment has to come from `justify-*`.
 * 2. Each word sits in an `overflow-hidden` box to mask the slide, which clips
 *    descenders (g, y, p) once the text settles. The negative-margin padding
 *    below gives them room without changing layout height.
 * 3. Arabic and Urdu are cursive: splitting a word into per-character boxes
 *    breaks the joins and every letter falls back to its isolated form. Those
 *    two animate by word instead, which leaves shaping intact.
 *
 * The `dir="auto"` matters more than it looks. Words are flex items, so on an
 * Arabic page a flex container would lay them out right to left — correct for
 * Arabic, and backwards for the Latin headlines that sit among them, since
 * development names and any copy still awaiting translation stay in English.
 * Letting the browser infer direction from the text keeps both in order.
 */
export function AnimatedTitle({
  children,
  className,
  align = "left",
  variant = "banner",
  delay = 0,
}: {
  children: string;
  className?: string;
  align?: Align;
  /** `banner` plays immediately (above the fold); `section` waits for scroll. */
  variant?: "banner" | "section";
  delay?: number;
}) {
  const { locale } = useI18n();
  const cursive = locale === "ar" || locale === "ur";
  const isBanner = variant === "banner";
  const byCharacter = isBanner && !cursive;

  return (
    <SlideUpText
      split={byCharacter ? "characters" : "words"}
      stagger={byCharacter ? 0.018 : 0.045}
      delay={delay}
      inView={!isBanner}
      once
      dir="auto"
      className={cn(
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
      /*
       * The mask that hides each word until it slides up is an
       * `overflow-hidden` box one line high, so whatever the script draws
       * outside that box is sheared off once the text settles.
       *
       * There are two nested boxes and both clip: `wordClass` lands on the
       * outer one, `charClass` on the inner — and it is the inner one that is
       * sized to the line, so that is where the room has to go. The outer then
       * carries the matching negative margins, which keep the line's layout
       * height exactly where it was.
       *
       * Latin only overshoots downward, on its descenders, and its line box
       * already allows for them. Arabic and Urdu overshoot both ways — dots
       * and hamzas ride high above the letters, tails drop well below — so
       * those two need the allowance at the top as well.
       */
      charClass={cursive ? "pt-[0.3em] pb-[0.34em]" : undefined}
      wordClass={
        cursive
          ? "-mt-[0.3em] -mb-[0.34em]"
          : "pb-[0.18em] -mb-[0.18em]"
      }
    >
      {children}
    </SlideUpText>
  );
}
