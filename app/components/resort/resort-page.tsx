import { PropertyEnquire } from "../property-enquire";
import { SiteFooter } from "../site-footer";
import { SiteNav } from "../site-nav";
import { ResortAbout } from "./resort-about";
import { ResortCbi } from "./resort-cbi";
import { ResortCta } from "./resort-cta";
import { ResortDirections } from "./resort-directions";
import { ResortGallery } from "./resort-gallery";
import { ResortHero } from "./resort-hero";
import { ResortHighlights, type HighlightGroup } from "./resort-highlights";
import { ResortOthers, type OtherResort } from "./resort-others";
import { ResortPresence } from "./resort-presence";
import { ResortSetting } from "./resort-setting";
import { caribbeanResorts, contact, destinations } from "@/app/lib/content";
import { getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import { interpolate, lookup, pick, pickAll } from "@/app/lib/i18n/format";
import { placeLine } from "@/app/lib/i18n/units";
import { caribbeanPins, type Resort } from "@/app/lib/resorts";
import { buildPath } from "@/app/lib/routes";

/**
 * The strings of a resort page in the reader's language.
 *
 * Every long line falls back to the English in `resorts.ts` through `pick`,
 * so a resort entered before its translations exist still renders whole.
 * The stat labels and the highlight points are keyed by their English text.
 */
export function localise(t: Dictionary, resort: Resort) {
  const copy = t.resort.copy[resort.slug];
  const stat = (label: string) => lookup(copy?.stats, label);

  const highlights: HighlightGroup[] = resort.highlights.map((group) => {
    const staged = copy?.highlights?.[group.heading];
    return {
      eyebrow: group.eyebrow ?? t.resort.highlights,
      heading: pick(staged?.heading, group.heading),
      body: pick(staged?.body, group.body),
      illustration: group.illustration,
      points: group.points.map((point) => lookup(staged?.points, point)),
      images: group.images,
    };
  });

  return {
    tagline: pick(copy?.tagline, resort.hero.tagline),
    intro: pick(copy?.intro, resort.hero.intro),
    heroStats: resort.hero.stats.map((s) => ({ value: s.value, label: stat(s.label) })),
    aboutHeading: pick(copy?.aboutHeading, resort.about.heading),
    aboutParagraphs: pickAll(copy?.aboutParagraphs, resort.about.paragraphs),
    pressHeading: pick(copy?.pressHeading, resort.about.pressHeading),
    settingHeading: pick(copy?.settingHeading, resort.setting.heading),
    settingSubheading: pick(copy?.settingSubheading, resort.setting.subheading),
    settingParagraphs: pickAll(copy?.settingParagraphs, resort.setting.paragraphs),
    highlights,
    presenceHeading: pick(copy?.presenceHeading, resort.presence.heading),
    presenceBody: pick(copy?.presenceBody, resort.presence.body),
    cbiHeading: pick(copy?.cbiHeading, resort.cbi.heading),
    cbiBody: pick(copy?.cbiBody, resort.cbi.body),
    ctaBody: pick(copy?.ctaBody, resort.cta.body),
  };
}

/**
 * A resort's page, top to bottom — the design, kept after the Caribbean pages
 * it was drawn for were retired, to be given to the Türkiye developments.
 * Nothing routes to it at present.
 */
export async function ResortPage({ resort }: { resort: Resort }) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = localise(t, resort);

  const place = placeLine(t, [resort.town, resort.island]);
  const programmeHref = buildPath("citizenshipProgramme", {
    programme: resort.cbi.programme,
  });

  // Every resort the firm represents in the region. None has a page of its
  // own any more, so the list on the map and the cards at the foot of the
  // page name them without linking; the cards leave this one out.
  const links: Record<string, string | undefined> = {};
  const others: OtherResort[] = caribbeanResorts
    .filter((other) => other.key !== resort.key)
    .map((other) => ({
      name: other.name,
      description: lookup(
        t.caribbeanSection.descriptions as Record<string, string>,
        other.key,
      ),
      image: other.images?.[0] ?? resort.hero.image,
      href: links[other.name],
    }));

  const islandLabels = Object.fromEntries(
    ["St. Kitts", "Nevis", "Dominica", "Grenada"].map((island) => [
      island,
      // The two halves of the federation are drawn separately; the token the
      // dictionary carries is the pair, so each half falls back to itself.
      lookup(t.places, island),
    ]),
  );

  const stats = destinations.caribbean.stats.map((s) => ({
    value: s.value,
    label: t.destinations.caribbean.stats[s.key],
  }));

  // The head office's line: the number an investor rings.
  const phone =
    contact.offices.find((office) => office.headOffice)?.phone ??
    contact.phones[0].number;

  return (
    <>
      <div className="relative">
        <SiteNav />
        <ResortHero
          image={resort.hero.image}
          name={resort.name}
          place={place}
          tagline={copy.tagline}
          intro={copy.intro}
          stats={copy.heroStats}
          brandLogo={resort.brandLogo}
          brandName={resort.brandName}
        />
      </div>

      <main className="flex-1">
        <ResortAbout
          eyebrow={t.resort.about}
          heading={copy.aboutHeading}
          paragraphs={copy.aboutParagraphs}
          pressHeading={copy.pressHeading}
          press={resort.about.press}
          image={resort.about.image}
          name={resort.name}
        />

        <ResortSetting
          heading={copy.settingHeading}
          subheading={copy.settingSubheading}
          paragraphs={copy.settingParagraphs}
          image={resort.setting.image}
          name={resort.name}
        />

        <ResortHighlights groups={copy.highlights} name={resort.name} />

        <ResortPresence
          eyebrow={t.resort.location}
          heading={copy.presenceHeading}
          body={copy.presenceBody}
          pins={caribbeanPins}
          current={resort.name}
          links={links}
          stats={stats}
          seaLabel={t.resort.caribbeanSea}
          islandLabels={islandLabels}
        />

        <ResortGallery
          name={resort.name}
          place={place}
          exterior={resort.gallery.exterior}
          interior={resort.gallery.interior}
          video={resort.gallery.video}
        />

        <ResortDirections
          heading={interpolate(t.resort.findYourWay, { name: resort.name })}
          addressLabel={t.contact.addressLabel}
          address={resort.location.address}
          email={contact.email}
          phone={phone}
          mapQuery={resort.location.mapQuery}
          mapTitle={interpolate(t.listing.mapTitle, { title: resort.name })}
          mapLink={t.contact.mapLink}
          locale={locale}
        />

        <ResortCbi
          eyebrow={t.resort.cbiEyebrow}
          heading={copy.cbiHeading}
          body={copy.cbiBody}
          button={t.resort.cbiButton}
          href={programmeHref}
          image={resort.cbi.image}
        />

        <PropertyEnquire
          eyebrow={t.property.enquireEyebrow}
          heading={interpolate(t.property.enquireHeading, {
            project: resort.name,
          })}
          body={t.property.enquireBody}
          subject={interpolate(t.property.enquireSubject, {
            project: resort.name,
          })}
          enquiryType="caribbeanCbi"
          className="bg-mist py-16 lg:py-24"
        />

        <ResortOthers heading={t.resort.otherProperties} resorts={others} />

        <ResortCta
          heading={interpolate(t.resort.ctaHeading, { name: resort.name })}
          body={copy.ctaBody}
          image={resort.cta.image}
          primary={{ label: t.common.enquireNow, href: "#enquire" }}
          secondary={{ label: t.resort.cbiButton, href: programmeHref }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
