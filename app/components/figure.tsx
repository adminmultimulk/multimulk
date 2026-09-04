"use client";

import { getFigure, type FigureId } from "@/app/lib/figures";
import { figureValue } from "@/app/lib/format-figure";
import { useI18n } from "@/app/lib/i18n/context";
import { getAuthor } from "@/app/lib/authors";
import type { LegalReview } from "@/app/lib/review";

/**
 * A stated figure, with what kind of claim it is.
 *
 * The qualifier is not decoration and it is not optional. "3–6" under the
 * label "Months to Passport" reads as a promise about a government's
 * timetable; "3–6 months — estimated, subject to government processing" reads
 * as what it actually is. Binding the two together in one component is what
 * stops the second half being dropped by a layout that wanted a tidier number.
 *
 * A Client Component because the stat rows that use it already are, and the
 * dictionary it needs is serialised to the browser regardless. The registry it
 * reads is a plain module with no server dependencies.
 */
export function Figure({
  id,
  label,
  tone = "light",
  size = "md",
}: {
  id: FigureId;
  /** What the number measures, in the reader's language. */
  label: string;
  tone?: "light" | "dark";
  /** `sm` fits a three-up stat row inside a narrow fixed-width column. */
  size?: "sm" | "md" | "lg";
}) {
  const { locale, t } = useI18n();
  const figure = getFigure(id);
  const unit =
    figure.unit in t.figures.units
      ? t.figures.units[figure.unit as keyof typeof t.figures.units]
      : "";

  const muted = tone === "dark" ? "text-cream/60" : "text-ink/55";
  const valueSize = {
    sm: "text-[22px] leading-none",
    md: "text-[30px] leading-none sm:text-[40px]",
    lg: "text-[34px] leading-none sm:text-[42px]",
  }[size];

  return (
    <>
      <dt className={`num whitespace-nowrap font-display ${valueSize}`}>
        {figureValue(locale, figure)}
        {unit ? (
          <span className={`ms-1.5 align-baseline text-[13px] ${muted}`}>
            {unit}
          </span>
        ) : null}
      </dt>
      <dd className="mt-3 text-[11.5px] leading-[17px]">
        {label}
        {/* The qualifier travels with the number, never separately. */}
        <span className={`mt-1.5 block text-[10.5px] leading-[15px] ${muted}`}>
          {t.figures.qualifiers[figure.qualifier]}
        </span>
      </dd>
    </>
  );
}

/**
 * When the figures on a page were last checked, who by, and against what.
 *
 * Rendered by every route the registry marks `regulated`. The date shown is
 * the same one that goes into `dateModified` in the structured data, so a
 * reader and a crawler are told the same thing.
 */
export function LastReviewed({
  review,
  className = "",
}: {
  review: LegalReview;
  className?: string;
}) {
  const { t, fill, date } = useI18n();
  const author = getAuthor(review.reviewedBy);

  return (
    <div className={`text-[11.5px] leading-[18px] text-ink/60 ${className}`}>
      <p>
        {fill(t.review.line, { date: date(review.reviewedOn) })}
        {" · "}
        {fill(t.review.by, { name: author.name })}
      </p>
      {review.sources.length > 0 ? (
        <p className="mt-1">
          {t.review.sources}:{" "}
          {review.sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 ? ", " : ""}
              <a
                href={source.url}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="underline underline-offset-2 hover:text-ink"
              >
                {source.label}
              </a>{" "}
              <span className="text-ink/45">
                ({fill(t.review.retrieved, {
                  date: date(source.retrievedOn, "short"),
                })})
              </span>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
