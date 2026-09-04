import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { SiteNav } from "./site-nav";

/**
 * The standard page opening: nav over a deep-green band, eyebrow, headline,
 * standfirst.
 *
 * Every page below the homepage uses it. The pillar hubs, the programme pages
 * and the comparison pages had each grown their own copy of the same markup,
 * and three near-identical heroes drift apart the first time one is adjusted.
 */
export function PageHero({
  eyebrow,
  heading,
  body,
  children,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <SiteNav />
      <section className="bg-forest py-[104px] lg:py-[136px]">
        <Container>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[880px] font-display text-[36px] leading-[1.16] text-cream sm:text-[48px] lg:text-[56px]">
            <AnimatedTitle variant="banner">{heading}</AnimatedTitle>
          </h1>
          {body ? (
            <p className="mt-6 max-w-[640px] text-[15px] leading-[25px] text-cream/75">
              {body}
            </p>
          ) : null}
          {children}
        </Container>
      </section>
    </div>
  );
}
