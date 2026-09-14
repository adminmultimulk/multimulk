"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { Link } from "../link";
import { useI18n } from "@/app/lib/i18n/context";

export type OtherResort = {
  name: string;
  description: string;
  image: string;
  /** Unset for a resort with no page yet; the card is then not a link. */
  href?: string;
};

/** Cards shown before "Load More" — one row of three. */
const FIRST = 3;

/**
 * The rest of the Caribbean portfolio, three at a time.
 *
 * A card with a page behind it is a link; the rest are plain cards rather
 * than dead links, which is how the programme page and the menus treat them
 * too. "Load More" reveals the remainder in place — there are six resorts,
 * so it is pressed at most once, and a page would be a lot of machinery for
 * three more cards.
 */
export function ResortOthers({
  heading,
  resorts,
  viewLabel,
}: {
  heading: string;
  resorts: OtherResort[];
  /** The accessible name of a linked card; "View the Resort" by default. */
  viewLabel?: string;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  if (!resorts.length) return null;
  const shown = expanded ? resorts : resorts.slice(0, FIRST);

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <h2 className="font-display text-[32px] leading-[1.2] text-ink sm:text-[44px]">
          <AnimatedTitle variant="section">{heading}</AnimatedTitle>
        </h2>
        <span className="mt-8 block h-px w-full bg-ink/10" />

        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((resort) => (
            <li key={resort.name}>
              <Card resort={resort} viewLabel={viewLabel ?? t.resort.viewResort} />
            </li>
          ))}
        </ul>

        {resorts.length > FIRST && !expanded ? (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full bg-ink px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest"
            >
              {t.common.loadMore}
            </button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function Card({
  resort,
  viewLabel,
}: {
  resort: OtherResort;
  viewLabel: string;
}) {
  const body = (
    <>
      <div className="relative aspect-[430/310] overflow-hidden bg-mist">
        <Image
          src={resort.image}
          alt={resort.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <h3 className="mt-6 text-center font-display text-[24px] leading-[1.25] text-ink">
        <bdi>{resort.name}</bdi>
      </h3>
      <p
        dir="auto"
        className="mx-auto mt-3 max-w-[400px] text-center text-[13px] leading-[21px] text-ink/75"
      >
        {resort.description}
      </p>
    </>
  );

  return resort.href ? (
    <Link href={resort.href} className="group block" aria-label={`${viewLabel}: ${resort.name}`}>
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  );
}
