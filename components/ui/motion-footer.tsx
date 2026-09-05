"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

// The measurement has to land before the browser paints, or a page that opens
// with the footer already part-way up the screen would show it at rest for a
// frame and then jerk into position. `useLayoutEffect` is the hook for that,
// and it is only ever reached in the browser — on the server the component
// still renders, which is what the warning it would otherwise log is about.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * The curtain reveal: the page slides away and the footer is uncovered
 * beneath it, as though it had been parked at the bottom of the viewport the
 * whole time.
 *
 * The usual way to do this is a `position: fixed` footer with the page content
 * laid over it, which only holds while every section above stays opaque and
 * above it in the stacking order. This does the same thing locally instead:
 * the wrapper keeps the footer's full height in the flow and clips it, and the
 * footer inside slides down into that frame at exactly scroll speed, so it
 * reads as stationary while the page moves past.
 *
 * The travel is capped at one viewport, so a footer taller than the screen is
 * still seen from the top down rather than having its head cut off, and the
 * uncovered strip is always below the fold while the reveal runs — there is no
 * moment where the clip shows through.
 */
export function FooterReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const frame = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // How far the footer starts lifted, in pixels. Zero until measured — and
  // zero for good under reduced motion — which is also what renders on the
  // server, so the footer's resting state is the one that ships in the HTML.
  const [travel, setTravel] = React.useState(0);

  // 0 as the frame's top edge reaches the bottom of the viewport, 1 once its
  // bottom edge does — the stretch over which the page uncovers it.
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, (p) => -travel * (1 - p));

  useIsomorphicLayoutEffect(() => {
    const el = frame.current;
    if (!el || reduced) {
      setTravel(0);
      return;
    }

    const measure = () =>
      setTravel(Math.min(el.offsetHeight, window.innerHeight));

    measure();
    // The footer's height moves with the breakpoint and with how the link
    // columns wrap, so the travel is re-read rather than fixed at mount.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  return (
    <div ref={frame} className={cn("relative overflow-clip", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
