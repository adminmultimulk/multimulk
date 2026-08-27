"use client";

import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container, SectionIntro } from "./container";
import { turkiyeProperties, turkiyeSection } from "@/app/lib/content";
import { projects } from "@/app/lib/projects";

const projectHref = Object.fromEntries(
  projects.map((project) => [project.name, `/properties/${project.slug}`]),
);

function scrollDriven() {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function indexFromProgress(value: number, count: number) {
  if (value >= 0.999) return count - 1;
  return Math.min(count - 1, Math.max(0, Math.floor(value * count)));
}

export function TurkiyePortfolio() {
  const [active, setActive] = useState(0);
  const runway = useRef<HTMLDivElement>(null);
  const count = turkiyeProperties.length;
  const activeRef = useRef(active);
  const locked = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start start", "end end"],
  });

  // Scrolling pins the pair and pages through the list; a name still takes
  // over on hover until the next scroll, and a click jumps to that property.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (locked.current || !scrollDriven()) return;
    const index = indexFromProgress(value, count);
    if (index !== activeRef.current) setActive(index);
  });

  const activate = (index: number, scrollTo = false) => {
    setActive(index);
    if (!scrollTo || !scrollDriven()) return;
    const el = runway.current;
    if (!el) return;

    locked.current = true;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + ((index + 0.45) / count) * range,
      behavior: "smooth",
    });

    const unlock = () => {
      locked.current = false;
      window.removeEventListener("scrollend", unlock);
      if (unlockTimer.current) {
        clearTimeout(unlockTimer.current);
        unlockTimer.current = null;
      }
    };
    window.addEventListener("scrollend", unlock, { once: true });
    unlockTimer.current = setTimeout(unlock, 1400);
  };

  return (
    <section className="bg-white">
      <div
        ref={runway}
        className="turkiye-runway relative"
        style={{ "--turkiye-holds": count - 1 } as CSSProperties}
      >
        {/* The heading rides along with the pair, so the whole composition
            holds its place while scrolling pages through the list. */}
        <div className="turkiye-runway-pin sticky top-0 z-10 flex flex-col justify-center bg-white py-[72px] lg:min-h-svh lg:py-14">
          <Container>
            <SectionIntro
              heading={turkiyeSection.heading}
              body={turkiyeSection.body}
            />
          </Container>

          <Container className="mt-14 lg:mt-10">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-[72px]">
              <div className="relative aspect-[612/590] w-full overflow-hidden lg:max-h-[56svh]">
                {turkiyeProperties.map((property, i) => (
                  <Image
                    key={property.image}
                    src={property.image}
                    alt={property.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 612px"
                    className={`object-cover transition-opacity duration-700 ease-out ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              <div className="lg:pt-1">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
                  {turkiyeSection.eyebrow}
                </p>

                <ul className="mt-8 flex flex-col gap-[30px]">
                  {turkiyeProperties.map((property, i) => {
                    const isActive = i === active;
                    return (
                      <li key={property.name}>
                        <button
                          type="button"
                          onMouseEnter={() => activate(i)}
                          onFocus={() => activate(i)}
                          onClick={() => activate(i, true)}
                          aria-current={isActive}
                          className={`block text-left font-display text-[24px] leading-[40px] transition-colors sm:text-[30px] ${
                            isActive
                              ? "text-ink"
                              : "text-ink/25 hover:text-ink/50"
                          }`}
                        >
                          {property.name}
                        </button>

                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                            isActive
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div
                            className="overflow-hidden"
                            inert={!isActive}
                          >
                            <div className="mt-4 max-w-[520px]">
                              <p className="text-[13.5px] leading-[22px] text-ink">
                                {property.description}
                              </p>
                              <Link
                                href={
                                  projectHref[property.name] ??
                                  "/search-property?currency=USD"
                                }
                                className="mt-[18px] inline-block border-b border-ink pb-1 text-[12.5px] font-medium text-ink"
                              >
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
