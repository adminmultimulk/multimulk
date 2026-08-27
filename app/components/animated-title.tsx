"use client";

import { SlideUpText } from "@/components/ui/slide-up-text";
import { cn } from "@/lib/utils";

type Align = "left" | "center";

/**
 * Site-wide title treatment built on SlideUpText.
 *
 * Two things it normalises for every caller:
 *
 * 1. SlideUpText renders a `flex flex-wrap` container, so `text-center` on the
 *    heading has no effect — alignment has to come from `justify-*`.
 * 2. Each word sits in an `overflow-hidden` box to mask the slide, which clips
 *    descenders (g, y, p) once the text settles. The negative-margin padding
 *    below gives them room without changing layout height.
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
  const isBanner = variant === "banner";

  return (
    <SlideUpText
      split={isBanner ? "characters" : "words"}
      stagger={isBanner ? 0.018 : 0.045}
      delay={delay}
      inView={!isBanner}
      once
      className={cn(align === "center" ? "justify-center" : "justify-start", className)}
      wordClass="pb-[0.18em] -mb-[0.18em]"
    >
      {children}
    </SlideUpText>
  );
}
