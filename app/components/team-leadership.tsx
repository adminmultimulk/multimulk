import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { TeamCard } from "./team-card";
import { getDictionary } from "@/app/lib/i18n";
import { teamLeadership, teamSeniorTeam } from "@/app/lib/team";

/**
 * The executives, and the senior row beneath them.
 *
 * Centred heading and standfirst over two centred rows. The executives sit at
 * the larger card size in a centred flex row — a grid would sit two people
 * off to one side. The senior four beneath them use the roster's own grid,
 * so they sit at its size and on its columns: one heading, two tiers, not a
 * grid that starts early.
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
              className="w-full max-w-[330px] shrink-0 grow-0 basis-[330px]"
            />
          ))}
        </ul>

        {/*
         * Same grid as the roster beneath, so the four columns line up with
         * it edge to edge. A fixed-width flex row was ~12px too wide for its
         * cap and wrapped the fourth card onto a row of its own.
         */}
        <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamSeniorTeam.map((person) => (
            <TeamCard key={person.slug} person={person} t={t} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
