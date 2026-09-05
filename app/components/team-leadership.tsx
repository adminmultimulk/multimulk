import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { TeamCard } from "./team-card";
import { getDictionary } from "@/app/lib/i18n";
import { teamLeadership } from "@/app/lib/team";

/**
 * The two executives, at the larger card size.
 *
 * Centred heading and standfirst over a centred row — the roster is two people
 * long here, so the row is flex rather than a grid, which would sit them off
 * to one side.
 */
export async function TeamLeadership() {
  const t = await getDictionary();
  const copy = t.team.leadership;

  return (
    <section className="bg-white py-[72px] lg:py-[104px]">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[30px] leading-[1.25] text-ink sm:text-[42px]">
            <AnimatedTitle align="center" variant="section">
              {copy.heading}
            </AnimatedTitle>
          </h2>
          <p className="mt-5 max-w-[640px] text-[13.5px] leading-[23px] text-ink/75">
            {copy.body}
          </p>
        </div>

        <ul className="mx-auto mt-12 flex max-w-[700px] flex-wrap justify-center gap-7">
          {teamLeadership.map((person) => (
            <TeamCard
              key={person.slug}
              person={person}
              t={t}
              size="lg"
              frame="portrait"
              className="w-full max-w-[330px] shrink-0 grow-0 basis-[330px]"
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
