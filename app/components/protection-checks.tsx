import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { dueDiligence, protectionImages } from "@/app/lib/due-diligence";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The twenty checks.
 *
 * Laid out the way the map on /about is: the heading, what it is for and a
 * photograph hold one column, the list runs down the other. Twenty questions
 * in a single stack read as a wall of text; two columns beside a fixed left
 * rail let a reader scan them, which is the only reason to publish them.
 */
export async function ProtectionChecks() {
  const t = await getDictionary();
  const copy = t.protection;

  return (
    <section className="bg-white py-[72px] lg:py-[110px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[420px_1fr] lg:gap-[90px]">
          <div>
            <h2 className="font-display text-[28px] leading-[1.28] text-ink sm:text-[38px] sm:leading-[50px]">
              <AnimatedTitle variant="section">{copy.checksHeading}</AnimatedTitle>
            </h2>
            <hr className="mt-8 border-ink/15" />
            <p className="mt-8 text-[12.5px] leading-[21px] text-ink/80">
              {copy.checksIntro}
            </p>

            <div className="relative mt-10 aspect-[420/280] w-full overflow-hidden lg:aspect-[420/420]">
              <Image
                src={protectionImages.checks}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>

          <ol className="grid content-start gap-x-12 sm:grid-cols-2">
            {dueDiligence.map((check) => (
              <li
                key={check.key}
                className="flex gap-3 border-b border-ink/10 py-[15px]"
              >
                {/* Fixed width, so the questions start on one line however
                    wide the two digits happen to be. */}
                <span className="num w-6 shrink-0 pt-px text-[11px] tracking-[0.06em] text-gold">
                  {check.number}
                </span>
                <span className="text-[13px] leading-[21px] text-ink/85">
                  {copy.checks[check.key]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
