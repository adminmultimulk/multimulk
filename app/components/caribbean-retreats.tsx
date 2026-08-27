"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container, SectionIntro } from "./container";
import {
  caribbeanResorts,
  caribbeanSection,
  type Resort,
} from "@/app/lib/content";
import { Diamond } from "./icons";

/**
 * Slots the resort photography drops into, placed out at the section's margins
 * so it frames the centred text rather than sitting in a row with it.
 */
const SLOT = {
  left: "left-0 top-1/2 w-[128px] -translate-y-1/2 aspect-[3/4]",
  rightTop: "right-0 -top-[70px] w-[150px] aspect-[4/3]",
  rightBottom: "right-[5%] -bottom-[80px] w-[130px] aspect-[3/4]",
};

/** Balance whatever imagery a resort has: a lone photo alternates sides. */
function slotsFor(count: number, index: number) {
  if (count >= 3) return [SLOT.left, SLOT.rightTop, SLOT.rightBottom];
  if (count === 2) return [SLOT.left, SLOT.rightTop];
  return [index % 2 === 0 ? SLOT.rightTop : SLOT.left];
}

/**
 * A row must beat the current one by this many pixels to take over. Expanding a
 * row reflows the list, which nudges every measurement — without the margin
 * that reflow can hand the band straight back and the two rows trade places
 * forever.
 */
const SWITCH_MARGIN_PX = 28;

/**
 * Where the panel's edges start, as percentages of the stage. Desktop opens
 * from a tall centred card; a phone has no room for that, so it starts nearly
 * open. Both finish at the full 0 → 100 rectangle.
 */
const CLOSED = {
  desktop: { start: 31, end: 69, top: 8, bottom: 92 },
  mobile: { start: 9, end: 91, top: 4, bottom: 96 },
};

export function CaribbeanRetreats() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const runway = useRef<HTMLDivElement | null>(null);
  // The picker reads the live value without re-subscribing the scroll listener.
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Scrolling drives the section twice over: it scrubs the panel open, then
  // opens whichever resort sits nearest the middle of the viewport. Hovering a
  // name still takes over until the next scroll.
  useEffect(() => {
    let queued = 0;

    const distanceTo = (index: number, middle: number) => {
      const el = rows.current[index];
      if (!el) return Number.POSITIVE_INFINITY;
      const box = el.getBoundingClientRect();
      return Math.abs(box.top + box.height / 2 - middle);
    };

    const pick = () => {
      queued = 0;
      const middle = window.innerHeight / 2;

      let nearest = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      rows.current.forEach((_, i) => {
        const distance = distanceTo(i, middle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      });

      if (nearest < 0 || nearest === activeRef.current) return;
      if (
        nearestDistance >
        distanceTo(activeRef.current, middle) - SWITCH_MARGIN_PX
      )
        return;
      setActive(nearest);
    };

    const schedule = () => {
      if (queued) return;
      queued = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section className="relative bg-forest">
      <OpeningStage ref={runway} />
      <div className="relative overflow-hidden pb-[72px] lg:pb-20">
        <Image
          src="/images/caribbean-backdrop.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/95 via-forest/70 to-forest/95" />

        <Container className="relative">
          {/*
           * Every row reserves its pair of rules (hidden until active) so the
           * list never jumps; the gap absorbs the 20px that reservation costs,
           * keeping the resting pitch between names where it was.
           */}
          <ul className="flex flex-col items-center gap-[10px] pt-[72px] lg:pt-20">
            {caribbeanResorts.map((resort, i) => (
              <ResortRow
                key={resort.name}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                resort={resort}
                index={i}
                isActive={i === active}
                onActivate={() => setActive(i)}
              />
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}

/**
 * The opening act, in the smooth-scroll-hero style: the stage pins for the
 * length of the runway while a clip-path rectangle opens from a centred card
 * out to full bleed, the island behind it easing back from its zoom. The intro
 * sits above the clip in its own layer, so its type never stretches.
 */
function OpeningStage({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Progress runs 0 → 1 across exactly the stretch the stage stays pinned.
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start start", "end end"],
  });

  const clipPath = useClipPath(scrollYProgress, CLOSED.desktop);
  const clipPathMobile = useClipPath(scrollYProgress, CLOSED.mobile);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <div ref={ref} className="retreat-runway relative">
      {/* Measures the runway for useScroll; the forwarded ref owns the outer box. */}
      <div ref={stage} className="pointer-events-none absolute inset-0" />

      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: zoom }}
        >
          <Image
            src="/images/caribbean-backdrop.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {reduced ? (
          <div className="absolute inset-0 bg-forest" />
        ) : (
          <>
            <motion.div
              className="absolute inset-0 hidden bg-forest lg:block"
              style={{ clipPath, willChange: "clip-path" }}
            />
            <motion.div
              className="absolute inset-0 bg-forest lg:hidden"
              style={{ clipPath: clipPathMobile, willChange: "clip-path" }}
            />
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center px-6">
          {/* Held to the closed panel's width so the copy never outruns it. */}
          <div className="w-full max-w-[520px]">
            <SectionIntro
              heading={caribbeanSection.heading}
              body={caribbeanSection.body}
              tone="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Builds the four corners of the opening rectangle from scroll progress. */
function useClipPath(
  progress: MotionValue<number>,
  closed: { start: number; end: number; top: number; bottom: number },
) {
  const left = useTransform(progress, [0, 1], [closed.start, 0]);
  const right = useTransform(progress, [0, 1], [closed.end, 100]);
  const top = useTransform(progress, [0, 1], [closed.top, 0]);
  const bottom = useTransform(progress, [0, 1], [closed.bottom, 100]);

  return useMotionTemplate`polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`;
}

function ResortRow({
  ref,
  resort,
  index,
  isActive,
  onActivate,
}: {
  ref: (el: HTMLLIElement | null) => void;
  resort: Resort;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <li ref={ref} className="relative w-full">
      {isActive ? (
        // Keyed on the resort so switching rows replays the wipe.
        <FloatingImages key={resort.name} resort={resort} index={index} />
      ) : null}

      <Rule show={isActive} />

      <div
        className={`flex flex-col items-center text-center transition-[padding] duration-500 ease-out ${
          isActive ? "py-[18px]" : "py-0"
        }`}
      >
        {/*
         * The logo and description live in a 0fr → 1fr grid row: the row's
         * height animates, so neighbouring resorts glide rather than jump.
         */}
        <div
          className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-out ${
            isActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {resort.logo ? (
              <Image
                src={resort.logo}
                alt=""
                width={84}
                height={40}
                unoptimized
                className="mx-auto mb-[18px] h-10 w-auto"
              />
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onMouseEnter={onActivate}
          onFocus={onActivate}
          onClick={onActivate}
          aria-expanded={isActive}
          className={`font-display leading-[33px] transition-all duration-500 ease-out ${
            isActive
              ? "text-[21px] text-cream sm:text-[27px]"
              : "text-[19px] text-cream/25 hover:text-cream/60 sm:text-[24px]"
          }`}
        >
          {resort.name}
        </button>

        <div
          className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-out ${
            isActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="mx-auto mt-[18px] max-w-[520px] text-[12px] leading-5 text-cream/80">
              {resort.description}
            </p>
          </div>
        </div>
      </div>

      <Rule show={isActive} />
    </li>
  );
}

function FloatingImages({ resort, index }: { resort: Resort; index: number }) {
  const images = resort.images ?? [];
  if (images.length === 0) return null;
  const slots = slotsFor(images.length, index);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {images.map((src, i) => (
        <div key={src} className={`absolute overflow-hidden ${slots[i]}`}>
          <div
            className="animate-image-wipe relative h-full w-full"
            style={{ animationDelay: `${80 + i * 90}ms` }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          {/* The bright bar that rides the leading edge of the reveal. */}
          <span
            className="animate-wipe-edge absolute inset-y-0 w-[3px] bg-cream"
            style={{ animationDelay: `${80 + i * 90}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

function Rule({ show }: { show: boolean }) {
  return (
    <div
      className={`relative mx-auto h-[10px] w-full max-w-[940px] transition-opacity duration-500 ease-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <span className="absolute inset-x-0 top-[4.5px] h-px bg-cream/30" />
      <Diamond className="absolute left-1/2 top-0 w-[10px] -translate-x-1/2 text-cream/50" />
    </div>
  );
}
