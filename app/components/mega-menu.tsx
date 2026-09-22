"use client";

import Image from "next/image";
import { Link } from "./link";
import type { MegaMenu, MenuCard, ResidencyCard } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { lookup, selectPlural } from "@/app/lib/i18n/format";
import { placeLine } from "@/app/lib/i18n/units";
import { getFigure } from "@/app/lib/figures";
import { figureValue, formatMoney } from "@/app/lib/format-figure";
import type { Dictionary } from "@/app/lib/i18n";
import type { Locale } from "@/app/lib/i18n/config";

/** Children enter one after another rather than all at once. */
const stagger = (i: number) => ({ animationDelay: `${60 + i * 55}ms` });

/** A figure the programme record does not carry. See `ResidencyTile`. */
const DASH = "—";

export function MegaMenuPanel({ menu }: { menu: MegaMenu }) {
  const { t, locale, fill } = useI18n();

  switch (menu.kind) {
    case "feature": {
      const copy = t.menus.about;
      return (
        <div className="grid grid-cols-[300px_1fr] gap-12">
          <Intro heading={copy.heading} body={copy.body} />
          <div className="grid grid-cols-2 gap-2">
            {menu.cards.map((card, i) => (
              <Link
                key={card.key}
                href={card.href ?? "#"}
                style={stagger(i)}
                className="group animate-menu-rise relative block aspect-[660/362] overflow-hidden"
              >
                <CardImage src={card.image} sizes="480px" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep/85 to-transparent" />
                <span className="absolute inset-x-0 bottom-7 text-center font-display text-[26px] text-cream">
                  {copy[card.key]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    case "portfolio": {
      // Only Real Estate carries a portfolio menu now; the Caribbean resorts
      // had no pages behind their cards and are reached through the programme
      // hub instead.
      const copy = t.menus.realEstate;
      return (
        <div className="grid grid-cols-[220px_1fr] gap-7">
          <Intro heading={copy.heading} body={copy.body}>
            <Link
              href={menu.viewAllHref}
              style={stagger(1)}
              className="animate-menu-rise mt-7 inline-block rounded-full border border-cream/70 px-8 py-3 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              {t.common.viewAll}
            </Link>
          </Intro>
          <div className="grid grid-cols-6 gap-2">
            {menu.cards.map((card, i) => (
              <PortfolioCard
                key={card.title}
                card={card}
                index={i}
                t={t}
                locale={locale}
              />
            ))}
          </div>
        </div>
      );
    }

    case "sections": {
      // News & Insights: four sections of one corpus, so the cards are read as
      // a list and carry a line each rather than a photograph each with a name
      // dropped over it. The strip sits at the same aspect as the About cards.
      const copy = t.insights;
      return (
        <div className="grid grid-cols-[260px_1fr] gap-10">
          <Intro heading={copy.menuHeading} body={copy.menuBody} />
          <div className="grid grid-cols-4 gap-2">
            {menu.cards.map((card, i) => (
              <Link
                key={card.key}
                href={card.href}
                style={stagger(i)}
                className="group animate-menu-rise relative block aspect-[330/300] overflow-hidden"
              >
                <CardImage src={card.image} sizes="320px" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/85 via-40% to-transparent to-72%" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-[22px] leading-tight text-cream">
                    {copy.sections[card.key].label}
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-[17px] text-cream/75">
                    {copy.sections[card.key].menuLine}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    case "programmes": {
      // Two programmes read best side by side in a wider frame; three or more
      // fall back to the compact three-up row.
      const wide = menu.cards.length < 3;
      return (
        <div className={`grid gap-3 ${wide ? "grid-cols-2" : "grid-cols-3"}`}>
          {menu.cards.map((card, i) => {
            // Türkiye lists the programme's terms, which are translated and
            // whose figures come from the registry rather than the copy; the
            // Caribbean lists development names, which are not translated.
            const lines =
              card.projects ??
              t.menus.citizenship.turkiyeRoutes.map((line) =>
                fill(line, {
                  investment: figureValue(
                    locale,
                    getFigure("tr.cbi.minimum-property"),
                  ),
                  holding: `${figureValue(
                    locale,
                    getFigure("tr.cbi.holding-period"),
                  )} ${t.figures.units.years}`,
                }),
              );
            return (
              <Link
                key={card.key}
                href={card.href}
                style={stagger(i)}
                className={`group animate-menu-rise relative block overflow-hidden ${
                  wide ? "aspect-[660/300]" : "aspect-[430/300]"
                }`}
              >
                <CardImage src={card.image} sizes="660px" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/85 via-40% to-transparent to-72%" />
                <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                  <p className="text-[10px] text-cream/70">{t.menus.citizenship.label}</p>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <span className="font-display text-[26px] leading-tight text-cream">
                      {lookup(t.places, card.key === "turkiye" ? "Türkiye" : "Caribbean")}
                    </span>
                    <ul className="text-end text-[11px] leading-[18px] text-cream/85">
                      {lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      );
    }
    case "residency": {
      // Four programmes, so a four-up row. Each card stacks its facts under
      // the country name rather than setting them beside it the way the two
      // wide Citizenship cards do — at a quarter of the row there is no room
      // for a name and a list shoulder to shoulder.
      return (
        <div className="grid grid-cols-4 gap-3">
          {menu.cards.map((card, i) => (
            <ResidencyTile
              key={card.key}
              card={card}
              index={i}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      );
    }
  }
}

/**
 * One Residence card: the country photograph, its name, and the three
 * figures a reader weighs a residency programme on.
 *
 * Every figure is read from the programme record and every label is one the
 * comparison table already uses, so the menu cannot state a threshold the
 * comparison contradicts — which is the whole reason `programmes.ts` keeps
 * these as structured fields rather than as written lines.
 */
function ResidencyTile({
  card,
  index,
  t,
  locale,
}: {
  card: ResidencyCard;
  index: number;
  t: Dictionary;
  locale: Locale;
}) {
  const months = card.processing;
  /*
   * Always three rows, with an em dash where the record has no figure.
   *
   * Both halves of that matter. A card that dropped its empty rows would sit
   * a line or two taller than the one beside it — the block is anchored to
   * the foot of the card — and a row of four would come out ragged for no
   * reason a reader could see. And the dash is what `programmes.ts` asks for
   * anyway: an omitted fact reads as "none", which for the UAE's processing
   * time would be a claim, while a dash says we have not published one. The
   * UAE's blank "citizenship after" is the honest answer rather than a gap —
   * the Golden Residence is a permit, and it never becomes a passport.
   */
  const facts = [
    {
      label: t.compare.rows.minimumInvestment,
      value: card.from ? formatMoney(locale, card.from) : DASH,
    },
    {
      label: t.compare.rows.processingTime,
      // An en dash inside the range, matching `figureValue`.
      value: months
        ? `${months.max ? `${months.min}–${months.max}` : months.min} ${t.figures.units.months}`
        : DASH,
    },
    {
      label: t.compare.rows.citizenshipAfter,
      value:
        card.citizenshipAfter === undefined
          ? DASH
          : `${card.citizenshipAfter} ${t.figures.units.years}`,
    },
  ];

  return (
    <Link
      href={card.href}
      style={stagger(index)}
      className="group animate-menu-rise relative block aspect-[330/300] overflow-hidden"
    >
      <CardImage src={card.image} sizes="330px" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/85 via-40% to-transparent to-72%" />
      <div className="absolute inset-x-0 bottom-0 px-5 py-4">
        <p className="text-[10px] text-cream/70">{t.menus.goldenVisa.label}</p>
        <p className="mt-1 font-display text-[22px] leading-tight text-cream">
          {lookup(t.places, card.place)}
        </p>
        <dl className="mt-2.5 border-t border-cream/20 pt-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex justify-between gap-3 py-[3px]">
              <dt className="text-[10.5px] leading-[15px] text-cream/60">
                {fact.label}
              </dt>
              <dd className="num shrink-0 text-[10.5px] leading-[15px] text-cream/90">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
}

function Intro({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2
        style={stagger(0)}
        className="animate-menu-rise font-display text-[34px] leading-[1.15] text-cream"
      >
        {heading}
      </h2>
      <p
        style={stagger(0)}
        className="animate-menu-rise mt-5 text-[13px] leading-[21px] text-cream/80"
      >
        {body}
      </p>
      {children}
    </div>
  );
}

function PortfolioCard({
  card,
  index,
  t,
  locale,
}: {
  card: MenuCard;
  index: number;
  t: Dictionary;
  locale: Locale;
}) {
  /*
   * The written line where the dictionary has one, and the unit count
   * otherwise. `lookup` is not used here on purpose: it falls back to the key
   * itself, and a card for a development entered last week would print its
   * slug under the name.
   */
  const detail =
    (card.detailKey
      ? (t.menus.detail as Record<string, string | undefined>)[card.detailKey]
      : undefined) ??
    (card.units
      ? selectPlural(locale, t.property.residencesCount, card.units)
      : undefined);

  return (
    <Link
      href={card.href ?? "#"}
      style={stagger(index)}
      className="group animate-menu-rise relative block aspect-[11/20] overflow-hidden"
    >
      <CardImage src={card.image} sizes="200px" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/65 via-45% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        {card.eyebrow?.map((line, i) => (
          <p
            key={i}
            className="text-[8px] uppercase leading-[12px] tracking-[0.08em] text-cream/75"
          >
            {placeLine(t, line)}
          </p>
        ))}
        <p className="mt-2 font-display text-[14.5px] leading-[19px] text-cream">
          {card.title}
        </p>
        {detail ? (
          <p className="mt-2 text-[9.5px] leading-[14px] text-cream/70">
            {detail}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function CardImage({ src, sizes }: { src: string; sizes: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  );
}
