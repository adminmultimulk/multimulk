import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Figure, LastReviewed } from "./figure";
import { Link } from "./link";
import { programmeReview, type Programme } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The opening section: what the programme is, in prose, with the four headline
 * figures set beneath the photography.
 *
 * The figures are butted directly against the foot of the image rather than
 * floated over it — they are the numbers a reader came for, and they stay
 * legible at any crop, which an overlay would not.
 */
export async function CitizenshipIntro({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship[programme.key];

  return (
    <section
      id="introduction"
      className="scroll-mt-[72px] bg-white py-[72px] lg:py-[110px]"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-[70px]">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
              {copy.intro.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-[34px] leading-[1.14] text-ink sm:text-[46px]">
              <AnimatedTitle variant="section">
                {copy.intro.heading}
              </AnimatedTitle>
            </h2>
            <span className="mt-7 block h-px w-9 bg-gold" />
          </div>

          <div>
            <div className="space-y-5 text-[13.5px] leading-[23px] text-ink/85">
              {copy.intro.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <Link
              href={programme.searchHref}
              className="mt-9 inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
            >
              {t.citizenship.browseAll}
            </Link>
          </div>
        </div>
      </Container>

      <Container className="mt-14 lg:mt-[74px]">
        <div className="relative aspect-[1296/520] w-full overflow-hidden">
          <Image
            src={programme.images.intro}
            alt=""
            fill
            sizes="(max-width: 1440px) 100vw, 1296px"
            className="object-cover"
          />
        </div>

        {/* One-up, then two-up, then four-up only once a quarter of the grid is
            wide enough for the threshold figure to sit on one line. The rules
            between the cells are the `gap-px` showing the panel behind them,
            so they land correctly at every one of those column counts — the
            panel is forest under a cream wash, which is the rule colour the
            cells used to carry as a border. */}
        <div className="bg-forest">
          <dl className="grid grid-cols-1 gap-px bg-cream/12 text-cream sm:grid-cols-2 xl:grid-cols-4">
            {programme.stats.map((stat) => (
              <div
                key={stat.key}
                className="bg-forest px-7 py-8 lg:px-9 lg:py-10 xl:px-7"
              >
                <Figure
                  id={stat.figure}
                  label={copy.stats[stat.key]}
                  tone="dark"
                  size="lg"
                />
              </div>
            ))}
          </dl>
        </div>

        {/* The figures above are legislation, so the page says when they were
            last checked and against what. `dateModified` in this page's
            structured data comes from the same date. */}
        <LastReviewed review={programmeReview(programme)} className="mt-5" />
      </Container>
    </section>
  );
}
