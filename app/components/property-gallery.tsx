"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ListingImage } from "./listing-image";
import { Chevron, Close } from "./icons";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * A listing's photographs.
 *
 * What stood here was a plain grid: the first image given two columns and two
 * rows while still carrying its own aspect ratio, everything else at 4:3, and
 * no way to see any of it larger than the column it sat in. Three photographs
 * came out as one enormous stretched frame beside two small ones, which is
 * roughly the opposite of what a gallery is for.
 *
 * So: a mosaic that closes up around however many photographs there are — the
 * grid is given the shape, and each tile fills its cell rather than asserting
 * a ratio of its own — and a lightbox, because the reason somebody scrolls to
 * this section is to look at a room properly.
 *
 * Three arrangements over the one lightbox. `photos` is the mosaic a listing's
 * gallery gets; `collage` is the three frames a development page shows beside
 * its overview, which are an accent rather than a gallery and are sized to sit
 * in half a column; `plans` is floor plans, shown whole on white.
 */

/** Tiles shown before the rest are folded into the "+N" overlay. */
const SHOWN = 5;

/**
 * The collage's tile count: three photographs of the development, then a
 * fourth carrying the "+N" into the rest of the set. It was three all told,
 * which meant the third was always spent on the overlay and only two of a
 * twenty-photograph gallery were ever actually seen.
 */
const COLLAGE = 4;

/**
 * How a tile sits in the desktop mosaic — four columns, two rows, the lead
 * photograph taking the left half.
 *
 * The point is that the grid never has a hole in it. With two photographs the
 * pair splits the frame; with four, the first of the three beside the lead
 * runs the width of its half. Only the lead's placement is fixed.
 */
function tileClass(index: number, shown: number): string {
  if (index === 0)
    return shown === 1 ? "lg:col-span-4 lg:row-span-2" : "lg:col-span-2 lg:row-span-2";

  const beside = shown - 1;
  if (beside === 1) return "lg:col-span-2 lg:row-span-2";
  if (beside === 2) return "lg:col-span-2";
  if (beside === 3 && index === 1) return "lg:col-span-2";
  return "";
}

export function PropertyGallery({
  images,
  label,
  variant = "photos",
}: {
  images: string[];
  /** What the set is, for the alt text and the dialog's own label. */
  label: string;
  /** See the note above: the mosaic, the development page's three frames, or
   *  floor plans, which are drawings and are shown whole rather than cropped. */
  variant?: "photos" | "collage" | "plans";
}) {
  const { t, dir, fill, plural, num } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  // Focus goes back where it came from when the lightbox closes; a reader who
  // opened the fourth photograph should not be returned to the top of the page.
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const count = images.length;
  // Plans are all shown; the collage holds four; the mosaic five.
  const shown = Math.min(
    count,
    variant === "plans" ? count : variant === "collage" ? COLLAGE : SHOWN,
  );
  const hidden = count - shown;

  const show = (index: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(index);
  };

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  const step = useCallback(
    (by: number) => setOpen((at) => (at === null ? at : (at + by + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open === null) return;

    dialog.current?.focus();

    // The page behind a full-screen dialog must not scroll under it.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      // The arrows are physical keys: in Arabic and Urdu the gallery runs the
      // other way, so left is forward.
      if (event.key === "ArrowLeft") step(dir === "rtl" ? 1 : -1);
      if (event.key === "ArrowRight") step(dir === "rtl" ? -1 : 1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close, step, dir]);

  // Keep the strip on the photograph being looked at. Twenty-three thumbnails
  // do not fit, and arrowing past the edge of the strip otherwise loses the
  // one place that says where in the set you are.
  useEffect(() => {
    if (open === null) return;
    strip.current?.children[open]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [open]);

  if (!count) return null;

  const viewAll = plural(t.listing.galleryViewAll, count, { count: num(count) });

  /**
   * One clickable frame. Everything that differs between the arrangements is
   * the class and the `sizes` hint; what they share — the zoom cursor, the
   * counter read out to a screen reader, the "+N" on the last tile shown — is
   * the same in all three and is written once here.
   */
  const frame = (
    src: string,
    index: number,
    options: { className: string; sizes: string; fit?: string },
  ) => (
    <button
      key={src}
      type="button"
      onClick={() => show(index)}
      aria-label={fill(t.listing.galleryCounter, {
        index: num(index + 1),
        count: num(count),
      })}
      className={`group relative cursor-zoom-in overflow-hidden ${options.className}`}
    >
      <ListingImage
        src={src}
        alt={label}
        sizes={options.sizes}
        className={
          options.fit ??
          "object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        }
      />
      {hidden > 0 && index === shown - 1 ? (
        <span className="absolute inset-0 flex items-center justify-center bg-forest-deep/55 font-display text-[22px] text-cream transition-colors group-hover:bg-forest-deep/65">
          {fill(t.listing.galleryMore, { count: num(hidden) })}
        </span>
      ) : null}
    </button>
  );

  return (
    <>
      {variant === "plans" ? (
        /* Uncropped, on white: a plan cut to fill a box is a plan with a room
           missing. Clickable all the same — a floor plan is the one image on
           the page nobody can read at this size. */
        <div className="grid gap-6 sm:grid-cols-2">
          {images.map((src, index) =>
            frame(src, index, {
              className:
                "aspect-[4/3] border border-ink/10 bg-white transition-colors hover:border-ink/30",
              sizes: "(max-width: 640px) 100vw, 500px",
              fit: "object-contain p-4",
            }),
          )}
        </div>
      ) : variant === "collage" ? (
        /* Half a column beside the overview: one wide frame over a row of
           three. The set behind it is the whole development's, so the last of
           the three carries the rest.
           `content-start` keeps the rows together wherever this is dropped. A
           grid stretched taller than its content distributes the spare height
           *between its rows*, and standing directly in the overview's column
           this one was stretched to the height of the prose beside it — a
           screen and a half of white between the lead photograph and the three
           under it. The caller now wraps it, which also settles the height;
           this makes the tiles hold together either way. */
        <div className="grid grid-cols-3 content-start gap-3">
          {images
            .slice(0, shown)
            .map((src, index) =>
              frame(src, index, {
                className:
                  index === 0
                    ? "col-span-3 aspect-[16/9] bg-ink/5"
                    : "aspect-[4/3] bg-ink/5",
                sizes:
                  index === 0
                    ? "(max-width: 1024px) 100vw, 600px"
                    : "(max-width: 1024px) 33vw, 200px",
              }),
            )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:aspect-[2/1] lg:grid-cols-4 lg:grid-rows-2">
            {images.slice(0, shown).map((src, index) =>
              frame(src, index, {
                className: `bg-ink/5 lg:aspect-auto ${
                  index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                } ${tileClass(index, shown)}`,
                sizes:
                  index === 0
                    ? "(max-width: 1024px) 100vw, 640px"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px",
              }),
            )}
          </div>

          {/* Under the mosaic rather than laid over it: the last tile already
              carries the "+N" overlay, and the two sat on top of each other.
              Left, not right — the WhatsApp button is fixed to the bottom
              right corner and lands on anything that sits there. */}
          <div className="mt-4 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => show(0)}
              className="w-full cursor-pointer rounded-full border border-ink/25 bg-white/70 px-7 py-3 text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-white sm:w-auto"
            >
              {viewAll}
            </button>
          </div>
        </div>
      )}

      {open !== null ? (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          onClick={close}
          onTouchStart={(event) => {
            touchX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const from = touchX.current;
            const to = event.changedTouches[0]?.clientX;
            touchX.current = null;
            if (from === null || to === undefined) return;
            const travelled = to - from;
            if (Math.abs(travelled) < 40) return;
            // Dragging the photograph to the left brings the next one in, in
            // either direction of reading.
            step(travelled < 0 ? 1 : -1);
          }}
          className="fixed inset-0 z-[100] flex flex-col bg-forest-deep/95 outline-none backdrop-blur-sm"
        >
          <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-[12px] tracking-[0.06em] text-cream/70">
              {fill(t.listing.galleryCounter, {
                index: num(open + 1),
                count: num(count),
              })}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={t.common.close}
              className="cursor-pointer rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <Close className="w-3.5" />
            </button>
          </div>

          {/* Stops a click on the photograph, the arrows or the thumbnails
              from reaching the backdrop, which closes. */}
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16"
          >
            {count > 1 ? (
              <Arrow
                onClick={() => step(-1)}
                label={t.listing.galleryPrevious}
                className="start-2 rotate-90 rtl:-rotate-90 sm:start-5"
              />
            ) : null}

            {/* The photograph either side is mounted with it, so stepping
                through the set does not blank the frame while the next one is
                fetched. Duplicates are dropped: with two photographs the
                neighbour on both sides is the same one. */}
            <div className="relative h-full w-full max-w-[1180px]">
              {[
                ...new Set([-1, 0, 1].map((by) => (open + by + count) % count)),
              ].map((index) => (
                <div
                  key={index}
                  aria-hidden={index !== open}
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    index === open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListingImage
                    src={images[index]}
                    alt={index === open ? label : ""}
                    sizes="100vw"
                    priority={index === open}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {count > 1 ? (
              <Arrow
                onClick={() => step(1)}
                label={t.listing.galleryNext}
                className="end-2 -rotate-90 rtl:rotate-90 sm:end-5"
              />
            ) : null}
          </div>

          {count > 1 ? (
            <div
              onClick={(event) => event.stopPropagation()}
              className="shrink-0 overflow-x-auto px-5 py-4 sm:px-8"
            >
              <div ref={strip} className="mx-auto flex w-max gap-2">
                {images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setOpen(index)}
                    aria-label={fill(t.listing.galleryCounter, {
                      index: num(index + 1),
                      count: num(count),
                    })}
                    aria-current={index === open}
                    className={`relative h-12 w-16 cursor-pointer overflow-hidden transition-opacity sm:h-14 sm:w-20 ${
                      index === open
                        ? "opacity-100 ring-1 ring-cream"
                        : "opacity-45 hover:opacity-80"
                    }`}
                  >
                    <ListingImage
                      src={src}
                      alt=""
                      sizes="80px"
                      className={variant === "plans" ? "object-contain bg-white" : "object-cover"}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

/** The two side controls, which differ only in which edge they sit on. */
function Arrow({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-forest-deep/70 p-3 text-cream/85 transition-colors hover:bg-forest-deep hover:text-cream ${className}`}
    >
      <Chevron className="w-2.5" />
    </button>
  );
}
