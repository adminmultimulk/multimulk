import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import { getDictionary } from "@/app/lib/i18n";
import { routes } from "@/app/lib/routes";
import { teamImages } from "@/app/lib/team";

/**
 * The closing band.
 *
 * Inset rather than full-bleed — it reads as a card the page ends on rather
 * than another section — with a wash deep enough to hold centred white type
 * and two ways forward: talk to someone, or read what the firm is first.
 */
export async function TeamCta() {
  const t = await getDictionary();
  const copy = t.team.cta;

  return (
    <section className="bg-white pb-[72px] lg:pb-[110px]">
      <Container>
        <div className="relative isolate overflow-hidden px-6 py-[86px] lg:px-10 lg:py-[120px]">
          <Image
            src={teamImages.cta}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-forest-deep/80" />

          <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
            <h2 className="font-display text-[32px] leading-[1.2] text-cream sm:text-[44px]">
              <AnimatedTitle align="center" variant="section">
                {copy.heading}
              </AnimatedTitle>
            </h2>
            <p className="mt-6 text-[13.5px] leading-[23px] text-cream/85">
              {copy.body}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <Link
                href={routes.contact.pattern}
                className="rounded-full bg-cream px-9 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              >
                {t.common.enquireNow}
              </Link>
              <Link
                href={routes.about.pattern}
                className="rounded-full border border-cream/60 px-9 py-3.5 text-[13px] text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                {t.footer.aboutItems.ourStory}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
