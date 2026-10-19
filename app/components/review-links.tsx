"use client";

import { reviewLinks } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { GoogleLogo, TrustpilotLogo } from "./icons";

const logos = {
  trustpilot: TrustpilotLogo,
  google: GoogleLogo,
} as const;

type ReviewLinksProps = {
  /** Footer sits on dark forest; contact sits on mist. */
  variant: "footer" | "contact";
};

export function ReviewLinks({ variant }: ReviewLinksProps) {
  const { t } = useI18n();

  if (variant === "footer") {
    return (
      <ul className="mt-3 flex flex-wrap items-center gap-2.5">
        {reviewLinks.map((review) => {
          const Logo = logos[review.key];
          const label =
            review.key === "trustpilot"
              ? t.contact.reviewsTrustpilot
              : t.contact.reviewsGoogle;
          return (
            <li key={review.key}>
              <a
                href={review.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/70 bg-forest-deep/45 px-5 py-2.5 text-[12px] text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-forest"
              >
                <Logo className="h-[18px] w-[18px] shrink-0" />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="mt-8 flex flex-wrap gap-4">
      {reviewLinks.map((review) => {
        const Logo = logos[review.key];
        const label =
          review.key === "trustpilot"
            ? t.contact.reviewsTrustpilot
            : t.contact.reviewsGoogle;
        return (
          <li key={review.key}>
            <a
              href={review.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-ink/15 bg-white px-5 py-3.5 text-[11.5px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-gold"
            >
              <Logo className="h-6 w-6 shrink-0" />
              <span>{label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
