"use client";

import Image from "next/image";
import { Link } from "./link";
import type { MegaMenu, MenuCard } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { lookup } from "@/app/lib/i18n/format";
import { placeLine } from "@/app/lib/i18n/units";
import { getFigure } from "@/app/lib/figures";
import { figureValue } from "@/app/lib/format-figure";
import type { Dictionary } from "@/app/lib/i18n";

/** Children enter one after another rather than all at once. */
const stagger = (i: number) => ({ animationDelay: `${60 + i * 55}ms` });

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
              <PortfolioCard key={card.title} card={card} index={i} t={t} />
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
                <FlagStrip flags={card.flags} />
                <div className="absolute inset-x-0 bottom-0 bg-forest-deep/90 px-5 py-4">
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
  }
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
}: {
  card: MenuCard;
  index: number;
  t: Dictionary;
}) {
  const detail = card.detailKey
    ? lookup(t.menus.detail, card.detailKey)
    : undefined;

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

/**
 * The flags of a programme's countries, side by side and filling the card.
 *
 * Each flag is cropped to its column rather than letterboxed, so the strip
 * reads as one continuous field the way the photograph it replaced did. Every
 * one of these five carries its device in the centre, which is what survives
 * the crop.
 */
function FlagStrip({ flags }: { flags: string[] }) {
  return (
    <div className="absolute inset-0 flex bg-forest-deep transition-transform duration-700 ease-out group-hover:scale-105">
      {flags.map((flag) => (
        <div key={flag} className="relative flex-1">
          <Image
            src={flag}
            alt=""
            fill
            // The optimizer refuses SVG unless it is told to trust it.
            unoptimized={flag.endsWith(".svg")}
            sizes={`${Math.ceil(660 / flags.length)}px`}
            className="object-cover"
          />
        </div>
      ))}
    </div>
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
