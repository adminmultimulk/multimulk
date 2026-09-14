"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { MapPin } from "../icons";
import { useI18n } from "@/app/lib/i18n/context";

type Tab = "exterior" | "interior" | "video";

/**
 * The resort's photography as a full-bleed showcase.
 *
 * One photograph fills the frame; a rail of thumbnails down the trailing
 * edge picks the next; and a strip of tabs along the bottom switches between
 * the outside, the inside and the film. The listing gallery's mosaic-and-
 * lightbox is the right shape for a flat of six photographs, and the wrong
 * one for a resort with thirty: a reader browsing a hotel wants to sit in
 * one big frame and move through it, which is what this is.
 *
 * The thumbnail rail scrolls in place rather than paginating — five are
 * visible at a time, and the rest are a wheel-turn away. It is hidden on a
 * phone, where the frame is the whole width and the arrows on it do the job.
 */
export function ResortGallery({
  name,
  place,
  exterior,
  interior,
  video,
}: {
  name: string;
  /** Localised "Portsmouth · Dominica", shown in the corner of the frame. */
  place: string;
  exterior: string[];
  interior: string[];
  video?: string;
}) {
  const { t, fill, num, dir } = useI18n();
  const reduced = useReducedMotion();
  const id = useId();

  const sets: Record<Tab, string[]> = { exterior, interior, video: [] };
  const tabs = (["exterior", "interior", "video"] as Tab[]).filter((tab) =>
    tab === "video" ? Boolean(video) : sets[tab].length > 0,
  );
  const [tab, setTab] = useState<Tab>(tabs[0] ?? "exterior");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!tabs.length) return null;

  const images = sets[tab];
  const current = images[Math.min(index, images.length - 1)];

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + images.length) % images.length);
  };
  const choose = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setIndex(0);
    setDirection(1);
  };

  const labels: Record<Tab, string> = {
    exterior: t.resort.exterior,
    interior: t.resort.interior,
    video: t.resort.video,
  };
  const enter = (dir === "rtl" ? -1 : 1) * direction * 40;

  return (
    <section
      aria-label={fill(t.resort.galleryLabel, { name })}
      className="relative aspect-[4/3] w-full overflow-hidden bg-forest-deep sm:aspect-[16/9] lg:aspect-[2.2/1]"
    >
      {tab === "video" && video ? (
        <iframe
          src={video}
          title={`${name} — ${t.resort.video}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          <AnimatePresence initial={false}>
            <motion.div
              key={`${tab}-${index}`}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, x: enter }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -enter }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current}
                alt={`${name} — ${labels[tab]}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Shade along the bottom for the tabs and the caption. */}
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/60 to-transparent" />

          {/* On a phone the thumbnail rail is gone, so the frame itself
              carries a pair of arrows. */}
          {images.length > 1 ? (
            <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between lg:hidden">
              <FrameArrow
                side="previous"
                label={t.listing.galleryPrevious}
                onClick={() => go(index - 1)}
              />
              <FrameArrow
                side="next"
                label={t.listing.galleryNext}
                onClick={() => go(index + 1)}
              />
            </div>
          ) : null}

          {/* The rail. */}
          {images.length > 1 ? (
            <div className="absolute end-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
              <RailArrow
                up
                label={t.listing.galleryPrevious}
                onClick={() => go(index - 1)}
              />
              <ol
                aria-label={labels[tab]}
                className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {images.map((image, i) => (
                  <li key={image}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={fill(t.listing.galleryCounter, {
                        index: num(i + 1),
                        count: num(images.length),
                      })}
                      aria-current={i === index}
                      className={`relative block h-[68px] w-[112px] overflow-hidden transition-all ${
                        i === index
                          ? "ring-2 ring-white ring-offset-2 ring-offset-black/40"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ol>
              <RailArrow
                label={t.listing.galleryNext}
                onClick={() => go(index + 1)}
              />
            </div>
          ) : null}
        </>
      )}

      {/* Where it is, in the corner. */}
      <p className="absolute bottom-7 start-6 hidden items-center gap-2 text-cream/90 sm:flex lg:start-[72px]">
        <MapPin className="w-3" />
        <span className="text-[11px] uppercase tracking-[0.11em]">
          <bdi>{name}</bdi> · {place}
        </span>
      </p>

      {/* The tabs, as a pill along the bottom edge. */}
      {tabs.length > 1 ? (
        <div
          role="tablist"
          aria-label={fill(t.resort.galleryLabel, { name })}
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 rounded-full border border-white/40 bg-black/25 p-1 backdrop-blur-sm sm:bottom-7"
        >
          {tabs.map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              id={`${id}-${option}`}
              aria-selected={option === tab}
              onClick={() => choose(option)}
              className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors sm:px-7 sm:py-2.5 ${
                option === tab
                  ? "bg-white text-ink"
                  : "text-cream hover:text-white"
              }`}
            >
              {labels[option]}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function RailArrow({
  up = false,
  label,
  onClick,
}: {
  up?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center text-white/90 transition-colors hover:text-white"
    >
      <svg
        viewBox="0 0 14 8"
        fill="none"
        aria-hidden
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-3.5 ${up ? "rotate-180" : ""}`}
      >
        <path d="M1 1l6 6 6-6" />
      </svg>
    </button>
  );
}

function FrameArrow({
  side,
  label,
  onClick,
}: {
  side: "previous" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md transition-colors hover:bg-white"
    >
      <svg
        viewBox="0 0 8 14"
        fill="none"
        aria-hidden
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-2 ${side === "previous" ? "rtl:rotate-180" : "rotate-180 rtl:rotate-0"}`}
      >
        <path d="M7 1L1 7l6 6" />
      </svg>
    </button>
  );
}
