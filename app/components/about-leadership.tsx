import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import { aboutLeadership } from "@/app/lib/about";
import { getDictionary } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";

export async function AboutLeadership() {
  const t = await getDictionary();
  const copy = t.about.leadership;

  return (
    <section className="bg-white pb-[72px] lg:pb-[100px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[415px_1fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[32px] leading-[1.2] text-ink sm:text-[44px]">
              <AnimatedTitle variant="section">{copy.heading}</AnimatedTitle>
            </h2>
            <hr className="mt-8 border-ink/15" />
            <p className="mt-8 max-w-[400px] text-[13px] leading-[22px] text-ink/80">
              {copy.body}
            </p>
            <Link
              href={aboutLeadership.href}
              className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-[12.5px] text-white transition-colors hover:bg-forest"
            >
              {t.common.getInTouch}
            </Link>
          </div>

          {/* Two portraits, so the pair is held to card width and sits right. */}
          <ul className="flex flex-wrap gap-5 lg:justify-end lg:gap-6">
            {aboutLeadership.people.map((person) => {
              const role = copy.roles[person.slug];
              return (
                <li
                  key={person.slug}
                  className="relative aspect-[186/287] w-[calc(50%-10px)] max-w-[262px] overflow-hidden bg-forest"
                >
                  <Image
                    src={person.image}
                    alt={interpolate(copy.portraitAlt, {
                      name: person.name,
                      title: role,
                    })}
                    fill
                    sizes="(max-width: 1024px) 45vw, 262px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                    <h3 className="font-display text-[17px] leading-[24px] text-white">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-[10.5px] leading-[15px] text-sand">
                      {role}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
