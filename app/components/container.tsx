import type { ReactNode } from "react";

import { AnimatedTitle } from "./animated-title";

/**
 * The site grid: 1440px canvas with 72px gutters, stepping down on
 * narrower viewports.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[72px] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  heading,
  body,
  tone = "light",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col items-center text-center">
      {eyebrow ? (
        <p
          className={`mb-5 text-[11.5px] font-bold uppercase tracking-[0.12em] ${
            dark ? "text-sand" : "text-gold"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-[32px] leading-[1.28] sm:text-[40px] ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        <AnimatedTitle align="center" variant="section">
          {heading}
        </AnimatedTitle>
      </h2>
      <span
        className={`mt-5 block h-px w-7 ${dark ? "bg-cream/60" : "bg-ink/50"}`}
      />
      {body ? (
        <p
          className={`mt-5 max-w-[640px] text-[13.5px] leading-[1.65] ${
            dark ? "text-cream/80" : "text-ink"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
