import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import { protectionImages } from "@/app/lib/due-diligence";
import { getDictionary } from "@/app/lib/i18n";
import { buildPath } from "@/app/lib/routes";

/**
 * The closing band, inset rather than full-bleed so the page does not run two
 * dark sections into one another.
 *
 * The copy is `citizenship.cta` — the same block the pillar hubs close on. One
 * closing line, worded once, is the point of it; a second set of strings
 * saying the same thing is a set that drifts.
 */
export async function ProtectionCta() {
  const t = await getDictionary();
  const copy = t.citizenship.cta;

  return (
    <section className="bg-white py-[72px] lg:py-[110px]">
      <Container>
        <div className="relative isolate overflow-hidden px-6 py-[86px] lg:px-10 lg:py-[110px]">
          <Image
            src={protectionImages.cta}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-forest-deep/80" />

          <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
            <h2 className="font-display text-[32px] leading-[1.2] text-cream sm:text-[42px]">
              <AnimatedTitle align="center" variant="section">
                {copy.heading}
              </AnimatedTitle>
            </h2>
            <span className="mt-6 block h-px w-9 bg-cream/60" />
            <p className="mt-6 text-[13.5px] leading-[23px] text-cream/85">
              {copy.body}
            </p>
            <Link
              href={buildPath("contact")}
              className="mt-9 rounded-full bg-cream px-9 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
            >
              {copy.button}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
