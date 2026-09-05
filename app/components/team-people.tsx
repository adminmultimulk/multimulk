import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { TeamCard } from "./team-card";
import { getDictionary } from "@/app/lib/i18n";
import { teamPeople } from "@/app/lib/team";

/**
 * Everyone else, four to a row.
 *
 * The heading block sits left rather than centred, so the two people sections
 * do not read as the same section twice — leadership is the announcement, this
 * is the list.
 */
export async function TeamPeople() {
  const t = await getDictionary();
  const copy = t.team.people_section;

  return (
    <section className="bg-mist py-[72px] lg:py-[104px]">
      <Container>
        <div className="max-w-[680px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[30px] leading-[1.25] text-ink sm:text-[40px]">
            <AnimatedTitle variant="section">{copy.heading}</AnimatedTitle>
          </h2>
          <p className="mt-5 text-[13.5px] leading-[23px] text-ink/75">
            {copy.body}
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamPeople.map((person) => (
            <TeamCard key={person.slug} person={person} t={t} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
