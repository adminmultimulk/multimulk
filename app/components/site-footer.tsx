import Image from "next/image";
import { FooterReveal } from "@/components/ui/motion-footer";
import {
  contact,
  entities,
  footerAboutItems,
  footerColumns,
  footerLinks,
  socialLinks,
} from "@/app/lib/content";
import { developments } from "@/app/lib/cms/developments";
import { buildPath } from "@/app/lib/routes";
import { getDictionary } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";
import { Link } from "./link";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Mail,
  MapPin,
  Phone,
  TikTok,
  X,
  YouTube,
} from "./icons";

const socialIcons = {
  linkedin: LinkedIn,
  instagram: Instagram,
  facebook: Facebook,
  youtube: YouTube,
  x: X,
  tiktok: TikTok,
};

export async function SiteFooter() {
  const t = await getDictionary();

  /*
   * The portfolio columns, filled from what is actually published. A
   * development belongs to the column its country names; a column with nothing
   * in it is not rendered, which is the whole reason these are built here
   * rather than written out in `content.ts`.
   */
  const schemes = await developments();
  const columns = footerColumns
    .map((column) => ({
      key: column.key,
      items: [
        ...column.names.map((name) => ({ name, href: footerLinks[name] })),
        ...schemes
          .filter((scheme) =>
            column.key === "caribbean"
              ? scheme.country.includes("Caribbean")
              : !scheme.country.includes("Caribbean"),
          )
          .map((scheme) => ({
            name: scheme.name,
            href: buildPath("development", { slug: scheme.slug }),
          })),
      ],
    }))
    .filter((column) => column.items.length);
  const itemStyle =
    "text-[13.5px] leading-[21px] text-cream/90 transition-colors hover:text-white lg:text-[11.5px] lg:leading-[17px]";
  const headingStyle =
    "text-[13px] font-medium uppercase tracking-[0.08em] text-cream lg:text-[12px]";
  // Rendered under the social rows on a wide screen and at the very bottom on
  // a phone, where the link columns run between the two.
  const copyright = (
    <p className="text-[12px] text-cream/80 lg:text-[10.5px]">
      {t.footer.copyright}
    </p>
  );

  return (
    // The footer is uncovered by the page rather than scrolled to; see
    // FooterReveal. Everything inside it is unchanged by that.
    <FooterReveal>
      <footer className="relative overflow-hidden bg-forest-deep lg:min-h-[1120px]">
        {/* On a phone the aerial is a band above the footer rather than a
            ground beneath it. Stacked into one column the links run far past
            the 600px scrim, and everything below it was being read off a
            sunlit photograph. From lg there is height enough for the scrim to
            cover the copy, so the photograph fills the footer as designed. */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
          <Image
            src="/images/footer-aerial.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* The band settles into the ground below it rather than ending on a
              seam. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] bg-gradient-to-t from-forest-deep to-transparent lg:hidden" />
        </div>

        {/* The desktop scrim. Sized to the copy, not to a round number:
            the contact column runs 423px tall and starts 477px down, so
            a 600px gradient left the column headings on bare sand. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[820px] bg-gradient-to-t from-forest-deep/95 via-forest-deep/85 to-transparent lg:block" />

        <div className="relative flex flex-col justify-end lg:min-h-[1120px]">
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-8 sm:px-10 lg:px-[60px] lg:pb-[60px] lg:pt-0">
            <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
              <div>
                <Link href="/" aria-label="Multi Mulk">
                  <Image
                    src="/logos/multi-mulk-light.png"
                    alt={t.common.logoAlt}
                    width={400}
                    height={113}
                    className="h-auto w-[230px] lg:w-[280px]"
                  />
                </Link>

                <div className="mt-6 flex flex-col gap-2.5">
                  {entities.map((entity) => (
                    <div key={entity} className="flex items-center gap-2.5">
                      <span className="text-[13.5px] text-cream/90 lg:text-[11.5px]">
                        {entity}
                      </span>
                      <div className="flex items-center gap-[7px]">
                        {socialLinks.map((social) => {
                          const Icon = socialIcons[social.key];
                          return (
                            <a
                              key={social.key}
                              href={social.href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={interpolate(t.common.socialProfile, {
                                name: `${entity} ${social.name}`,
                              })}
                              className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-cream/70 text-cream/90 transition-colors hover:border-cream hover:text-cream"
                            >
                              <Icon className="w-2.5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 hidden lg:block">{copyright}</div>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Portfolio columns list development names, which read the same
                    in every language. */}
                {columns.map((column) => (
                  <div key={column.key} className="hidden lg:block">
                    <h2 className={headingStyle}>
                      {t.footer.columns[column.key]}
                    </h2>
                    <ul className="mt-[18px] flex flex-col gap-[11px]">
                      {column.items.map((item) => (
                        <li key={item.name}>
                          {item.href ? (
                            <Link href={item.href} className={itemStyle}>
                              {item.name}
                            </Link>
                          ) : (
                            <a href="#" className={itemStyle}>
                              {item.name}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h2 className={headingStyle}>
                    {t.footer.columns.about}
                  </h2>
                  <ul className="mt-[18px] flex flex-col gap-[11px]">
                    {footerAboutItems.map((item) => (
                      <li key={item.key}>
                        {item.href ? (
                          <Link href={item.href} className={itemStyle}>
                            {t.footer.aboutItems[item.key]}
                          </Link>
                        ) : (
                          <a href="#" className={itemStyle}>
                            {t.footer.aboutItems[item.key]}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className={headingStyle}>
                    {t.footer.contactTitle}
                  </h2>
                  {/* One block per office rather than the head office alone:
                      a reader in Lahore or Dubai should not have to guess
                      whether the firm is anywhere near them. Address and phone
                      sit together under the country, in `contact.offices`
                      order — head office first. */}
                  <ul className="mt-[18px] flex flex-col gap-[18px] text-[13.5px] leading-[21px] text-cream/90 lg:gap-[14px] lg:text-[11.5px] lg:leading-[17px]">
                    {contact.offices.map((office) => (
                      <li key={office.key} className="flex flex-col gap-[5px]">
                        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-cream/60 lg:text-[10px]">
                          {t.footer.offices[office.key]}
                        </span>
                        <span className="flex gap-2">
                          <MapPin className="mt-0.5 w-3 shrink-0" />
                          <span>{t.footer.addresses[office.key]}</span>
                        </span>
                        <a
                          href={`tel:${office.phone.replace(/\s/g, "")}`}
                          className="flex gap-2 transition-colors hover:text-white"
                        >
                          <Phone className="mt-0.5 w-3.5 shrink-0" />
                          <span className="num">{office.phone}</span>
                        </a>
                      </li>
                    ))}
                    <li className="flex gap-2">
                      <Mail className="mt-0.5 w-3.5 shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="num transition-colors hover:text-white"
                      >
                        {contact.email}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:hidden">{copyright}</div>
          </div>
        </div>
      </footer>
    </FooterReveal>
  );
}
