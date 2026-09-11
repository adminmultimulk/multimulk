import Image from "next/image";
import type { Dictionary } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";
import type { TeamPerson } from "@/app/lib/team";

/**
 * One person.
 *
 * One framing for everybody: the photograph fills the card edge to edge and
 * the name sits over its foot, with the department on a white strip beneath.
 * The executives are the same card at `lg` — the roster reads as one set of
 * people at two sizes rather than as two different kinds of person, which is
 * what the circular cut-outs on the house green used to make it look like.
 *
 * Portraits are therefore all rectangular studio frames at 186:287. A square
 * or pre-masked circle dropped in here will be cropped to that ratio.
 */
export function TeamCard({
  person,
  t,
  size = "sm",
  className = "",
}: {
  person: TeamPerson;
  t: Dictionary;
  size?: "sm" | "lg";
  /** Lets the caller size the card; the card itself only lays its insides out. */
  className?: string;
}) {
  const copy = t.team;
  const roles = copy.people[person.slug] ?? [];
  const department = copy.departments[person.department];
  const large = size === "lg";
  const alt = interpolate(copy.portraitAlt, {
    name: person.name,
    title: roles[0] ?? department,
  });

  return (
    <li
      className={`flex flex-col overflow-hidden border border-ink/10 bg-white ${className}`}
    >
      <div className="relative aspect-[186/287] bg-forest">
        <Image
          src={person.image}
          alt={alt}
          fill
          sizes={
            large
              ? "(max-width: 640px) 90vw, 330px"
              : "(max-width: 640px) 90vw, 260px"
          }
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-center">
          {/* Names are never translated. */}
          <h3
            className={`font-display ${large ? "text-[22px] leading-[30px]" : "text-[18px] leading-[25px]"} text-white`}
          >
            {person.name}
          </h3>
          <div className="mt-1 flex flex-col gap-0.5">
            {roles.map((line) => (
              <p key={line} className="text-[11px] leading-[16px] text-sand">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5 text-center">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-gold">
          {department}
        </p>
      </div>
    </li>
  );
}
