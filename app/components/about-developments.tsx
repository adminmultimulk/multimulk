import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import { aboutDevelopments } from "@/app/lib/about";
import { developments } from "@/app/lib/cms/developments";
import { getDictionary } from "@/app/lib/i18n";
import { buildPath } from "@/app/lib/routes";

/** The opening of a lister's own prose, where a language has nothing keyed. */
function opening(description: string): string {
  const sentence = description.split(/(?<=[.!?])\s/)[0] ?? "";
  return sentence.length > 190 ? `${sentence.slice(0, 187).trimEnd()}…` : sentence;
}

export async function AboutDevelopments() {
  const t = await getDictionary();
  const copy = t.about.developments;
  // The three most recently published developments, in place of the three that
  // were named in `about.ts` — a page about the portfolio should show the
  // portfolio.
  const cards = (await developments()).slice(0, 3).map((development) => ({
    key: development.slug,
    name: development.name,
    image: development.image,
    href: buildPath("development", { slug: development.slug }),
    body:
      (copy.cards as Record<string, string | undefined>)[development.slug] ??
      opening(development.description),
  }));

  // Nothing published yet: the section is dropped rather than shown empty.
  if (!cards.length) return null;

  return (
    <section className="bg-white py-[72px] lg:py-[115px]">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-[30px] leading-[1.25] text-ink sm:text-[40px]">
            <AnimatedTitle align="center" variant="section">
              {copy.heading}
            </AnimatedTitle>
          </h2>
          <p className="mt-5 max-w-[680px] text-[13px] leading-[22px] text-ink/80">
            {copy.body}
          </p>
        </div>

        <hr className="mt-12 border-ink/12" />

        <ul className="mt-12 grid gap-10 md:grid-cols-3 lg:gap-[45px]">
          {cards.map((card) => (
            <li key={card.key}>
              <Link href={card.href} className="group block text-center">
                <div className="relative aspect-[288/205] w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                {/* The development's name reads the same in every language. */}
                <h3 className="mt-6 font-display text-[19px] leading-[27px] text-ink transition-colors group-hover:text-gold">
                  {card.name}
                </h3>
                {card.body ? (
                  <p className="mx-auto mt-3 max-w-[380px] text-[12.5px] leading-[21px] text-ink/75">
                    {card.body}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {aboutDevelopments.actions.map((action) => (
            <Link
              key={action.key}
              href={action.href}
              className="rounded-full bg-ink px-7 py-3.5 text-[12.5px] text-white transition-colors hover:bg-forest"
            >
              {copy.actions[action.key]}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
