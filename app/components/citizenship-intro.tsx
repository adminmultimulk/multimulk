import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import type { Programme } from "@/app/lib/citizenship";
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

        <dl className="grid grid-cols-2 bg-forest text-cream sm:grid-cols-4">
          {programme.stats.map((stat) => (
            <div
              key={stat.key}
              className="border-b border-cream/12 px-7 py-8 last:border-b-0 sm:border-b-0 sm:border-e sm:last:border-e-0 lg:px-9 lg:py-10"
            >
              <dt className="num font-display text-[34px] leading-none sm:text-[42px]">
                {stat.value}
              </dt>
              <dd className="mt-3 text-[10.5px] uppercase leading-[16px] tracking-[0.1em] text-cream/70">
                {copy.stats[stat.key]}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
