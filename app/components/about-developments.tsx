import Image from "next/image";
import Link from "next/link";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { aboutDevelopments } from "@/app/lib/about";

export function AboutDevelopments() {
  return (
    <section className="bg-white py-[72px] lg:py-[115px]">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-[30px] leading-[1.25] text-ink sm:text-[40px]">
            <AnimatedTitle align="center" variant="section">
              {aboutDevelopments.heading}
            </AnimatedTitle>
          </h2>
          <p className="mt-5 max-w-[680px] text-[13px] leading-[22px] text-ink/80">
            {aboutDevelopments.body}
          </p>
        </div>

        <hr className="mt-12 border-ink/12" />

        <ul className="mt-12 grid gap-10 md:grid-cols-3 lg:gap-[45px]">
          {aboutDevelopments.cards.map((card) => (
            <li key={card.title}>
              <Link href={card.href} className="group block text-center">
                <div className="relative aspect-[288/205] w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-6 font-display text-[19px] leading-[27px] text-ink transition-colors group-hover:text-gold">
                  {card.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[380px] text-[12.5px] leading-[21px] text-ink/75">
                  {card.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {aboutDevelopments.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-full bg-ink px-7 py-3.5 text-[12.5px] text-white transition-colors hover:bg-forest"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
