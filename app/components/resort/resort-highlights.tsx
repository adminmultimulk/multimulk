"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useI18n } from "@/app/lib/i18n/context";

/** One group of the slider, already localised by the page. */
export type HighlightGroup = {
  eyebrow: string;
  heading: string;
  body: string;
  illustration?: string;
  points: string[];
  images: string[];
};

/**
 * The resort's highlights — amenities, rooms, the island — as a slider.
 *
 * Each group is a heading, a paragraph, three numbered points and a set of
 * photographs. The arrows step through the photographs, and when the next
 * photograph belongs to the next group the copy beside it changes with it —
 * so one control walks the whole set, and a reader who only ever presses
 * "next" still reads all three. The dots under the copy jump straight to a
 * group for anyone who wants to.
 *
 * The photograph is what moves; the copy crossfades. A slide-in on a column
 * of text is a lot of motion for three lines, and the eye is on the picture.
 */
export function ResortHighlights({
  groups,
  name,
}: {
  groups: HighlightGroup[];
  name: string;
}) {
  const { t, fill, num, dir } = useI18n();
  const reduced = useReducedMotion();

  // The flat list of frames the arrows walk: every photograph of every group,
  // each remembering which group it belongs to.
  const frames = groups.flatMap((group, groupIndex) =>
    group.images.map((image) => ({ image, groupIndex })),
  );
  const [frame, setFrame] = useState(0);
  // +1 forward, -1 back, for the direction the photograph enters from.
  const [direction, setDirection] = useState(1);

  if (!frames.length) return null;

  const current = frames[frame];
  const group = groups[current.groupIndex];

  const step = (delta: number) => {
    setDirection(delta);
    setFrame((frame + delta + frames.length) % frames.length);
  };
  const jump = (groupIndex: number) => {
    const first = frames.findIndex((f) => f.groupIndex === groupIndex);
    if (first < 0 || first === frame) return;
    setDirection(first > frame ? 1 : -1);
    setFrame(first);
  };

  // The photograph enters from the side the arrow pointed at. In a
  // right-to-left page "next" points left, so the offset is mirrored.
  const enter = (dir === "rtl" ? -1 : 1) * direction * 48;

  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        {/* The copy column keeps the site gutter; the photograph runs to the
            edge of the viewport, which is where a photograph this size wants
            to be. */}
        <div className="flex flex-col justify-between px-6 py-14 sm:px-10 lg:px-[72px] lg:py-20">
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.groupIndex}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
                  {group.eyebrow}
                </p>
                <h2 className="mt-5 max-w-[480px] font-display text-[32px] leading-[1.2] text-ink sm:text-[42px]">
                  {group.heading}
                </h2>
                <p
                  dir="auto"
                  className="mt-6 max-w-[520px] text-[13.5px] leading-[23px] text-ink/85"
                >
                  {group.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-14 lg:mt-20">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-stretch">
              {group.illustration ? (
                <div className="relative h-[96px] w-[128px] shrink-0 self-start text-forest">
                  <Image
                    src={group.illustration}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain object-left rtl:object-right"
                  />
                </div>
              ) : null}

              <ol className="grid flex-1 grid-cols-3 divide-x divide-ink/15 rtl:divide-x-reverse">
                {group.points.map((point, index) => (
                  <li
                    key={point}
                    className="flex flex-col justify-between gap-6 px-4 first:ps-0 last:pe-0 sm:px-5"
                  >
                    <span className="font-display text-[30px] leading-none text-ink">
                      {num(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12.5px] leading-[19px] text-ink/85">
                      {point}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* One dot a group. The frame counter beside them says where in
                the photographs the reader is, since the dots cannot. */}
            <div className="mt-10 flex items-center gap-5">
              <ol className="flex items-center gap-2">
                {groups.map((g, index) => (
                  <li key={g.heading}>
                    <button
                      type="button"
                      onClick={() => jump(index)}
                      aria-label={g.heading}
                      aria-current={index === current.groupIndex}
                      className={`block h-1.5 rounded-full transition-all ${
                        index === current.groupIndex
                          ? "w-7 bg-forest"
                          : "w-1.5 bg-ink/25 hover:bg-ink/50"
                      }`}
                    />
                  </li>
                ))}
              </ol>
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink/50">
                {fill(t.resort.slide, {
                  index: num(frame + 1),
                  count: num(frames.length),
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-forest lg:aspect-auto lg:min-h-[720px]">
          <AnimatePresence initial={false} custom={enter}>
            <motion.div
              key={frame}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, x: enter }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -enter }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current.image}
                alt={`${name} — ${group.heading}`}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <Arrow
            side="previous"
            label={t.listing.galleryPrevious}
            onClick={() => step(-1)}
          />
          <Arrow
            side="next"
            label={t.listing.galleryNext}
            onClick={() => step(1)}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * A round arrow floating over the photograph. Placed with logical insets and
 * drawn as a chevron that flips with the writing direction, so "previous" is
 * on the leading edge and points the way the reader came from.
 */
function Arrow({
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
      className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-colors hover:bg-white ${
        side === "previous" ? "start-5" : "end-5"
      }`}
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
