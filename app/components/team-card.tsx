import Image from "next/image";
import type { Dictionary } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";
import type { TeamPerson } from "@/app/lib/team";

/**
 * One person.
 *
 * Two framings, because the portraits come in two shapes. Most are circles on
 * the house green with transparent corners, so `circle` gives them a light
 * ground and lets them stay circles rather than cropping them into a
 * rectangle. The executives have rectangular studio frames, so `portrait`
 * fills the card edge to edge and lays the name over the foot of the
 * photograph — the same treatment the About page gives the same two files.
 *
 * Department above, name, then one or two role lines — the order the previous
 * site used, kept because it reads top-down as context, who, what.
 */
export function TeamCard({
  person,
  t,
  size = "sm",
  frame = "circle",
  className = "",
}: {
  person: TeamPerson;
  t: Dictionary;
  size?: "sm" | "lg";
  /** Matches the shape of the file: masked circle, or full-bleed studio frame. */
  frame?: "circle" | "portrait";
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
      {frame === "portrait" ? (
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
      ) : (
        <div className="flex justify-center bg-mist px-6 pb-5 pt-7">
          <div
            className={`group/portrait relative ${large ? "w-[224px]" : "w-[184px]"} aspect-square`}
          >
            <Image
              src={person.image}
              alt={alt}
              fill
              sizes={large ? "224px" : "184px"}
              className="object-contain"
            />
            {/*
             * The white ring around the face is painted into the file rather
             * than drawn by CSS — it is the outermost 15px of a 440px frame,
             * so there is no border here to recolour. This lays a ring of the
             * same thickness exactly over it (3.4% of the width, hence 6px at
             * 184 and 8px at 224) and fades it in on hover. Transparent at
             * rest, so the white underneath shows through untouched.
             */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 rounded-full border-transparent transition-colors duration-300 ease-out group-hover/portrait:border-gold ${large ? "border-[8px]" : "border-[6px]"}`}
            />
          </div>
        </div>
      )}

      {frame === "portrait" ? (
        <div className="px-6 pb-6 pt-5 text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-gold">
            {department}
          </p>
        </div>
      ) : (
        <div className="px-6 pb-7 pt-6">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-gold">
            {department}
          </p>
          {/* Names are never translated. */}
          <h3
            className={`mt-2.5 font-display ${large ? "text-[26px] leading-[34px]" : "text-[21px] leading-[29px]"} text-ink`}
          >
            {person.name}
          </h3>
          <div className="mt-2 flex flex-col gap-0.5">
            {roles.map((line) => (
              <p key={line} className="text-[12px] leading-[18px] text-ink/65">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
