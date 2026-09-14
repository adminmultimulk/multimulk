import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { Diamond } from "../icons";
import type { PressMention } from "@/app/lib/resorts";

/**
 * What the resort is, in prose, beside a tall photograph of it — and under
 * the prose, the press it has had.
 *
 * The press cards are the reason this section exists as its own component
 * rather than being the development page's overview reused: a resort's
 * credibility with a buyer who will never stay in it is borrowed from the
 * people who have written it up, so the mentions are carried as cards with
 * the outlet's mark rather than as a line of text.
 */
export function ResortAbout({
  eyebrow,
  heading,
  paragraphs,
  pressHeading,
  press,
  image,
  name,
}: {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  pressHeading: string;
  press: PressMention[];
  image: string;
  /** The resort, for the photograph's alt text. */
  name: string;
}) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
              {eyebrow}
            </p>
            <h2 className="mt-5 max-w-[560px] font-display text-[32px] leading-[1.2] text-ink sm:text-[44px]">
              <AnimatedTitle variant="section">{heading}</AnimatedTitle>
            </h2>
            <div className="mt-8 flex max-w-[560px] flex-col gap-5">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  dir="auto"
                  className="text-[13.5px] leading-[23px] text-ink/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {press.length ? (
              <div className="mt-14">
                <h3 className="text-[19px] leading-[1.3] text-ink sm:text-[22px]">
                  {pressHeading}
                </h3>
                <ul className="mt-7 flex flex-wrap gap-4">
                  {press.map((mention) => (
                    <li key={mention.outlet + mention.title}>
                      <PressCard mention={mention} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Portrait, and taller than the column of prose on a wide screen:
              the photograph is the argument and the text is the caption. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist lg:aspect-auto lg:min-h-[640px]">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * One press mention: the outlet's mark, a rule with a diamond on it, and the
 * headline in small caps. An outlet with no mark gets its name set in the
 * display face instead, which is what a masthead is anyway.
 */
function PressCard({ mention }: { mention: PressMention }) {
  const body = (
    <>
      <div className="flex h-[52px] items-center justify-center">
        {mention.logo ? (
          <Image
            src={mention.logo}
            alt={mention.outlet}
            width={129}
            height={47}
            className="max-h-[48px] w-auto"
          />
        ) : (
          <span className="font-display text-[28px] font-bold leading-none text-ink">
            {mention.outlet}
          </span>
        )}
      </div>
      <span className="my-4 flex items-center gap-2 text-ink/30">
        <span className="h-px flex-1 bg-current" />
        <Diamond className="w-2.5" />
        <span className="h-px flex-1 bg-current" />
      </span>
      <p className="text-[10.5px] uppercase leading-[1.5] tracking-[0.08em] text-ink/70">
        {mention.title}
      </p>
    </>
  );

  const className =
    "flex w-[210px] flex-col border border-ink/10 bg-white px-5 py-6 text-center transition-colors";

  return mention.href ? (
    <a
      href={mention.href}
      target="_blank"
      rel="noreferrer"
      className={`${className} hover:border-ink/30`}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
