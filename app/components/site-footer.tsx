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
  const itemStyle =
    "text-[11.5px] leading-[17px] text-cream/90 transition-colors hover:text-white";

  return (
    // The footer is uncovered by the page rather than scrolled to; see
    // FooterReveal. Everything inside it is unchanged by that.
    <FooterReveal>
      <footer className="relative min-h-[720px] overflow-hidden bg-forest lg:min-h-[900px]">
        <Image
          src="/images/footer-aerial.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-[600px] bg-gradient-to-t from-forest-deep/95 via-forest-deep/75 to-transparent" />

        <div className="relative flex min-h-[720px] flex-col justify-end lg:min-h-[900px]">
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 sm:px-10 lg:px-[60px] lg:pb-[60px]">
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
                      <span className="text-[11.5px] text-cream/90">{entity}</span>
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

                <p className="mt-6 text-[10.5px] text-cream/80">
                  {t.footer.copyright}
                </p>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Portfolio columns list development names, which read the same
                    in every language. */}
                {footerColumns.map((column) => (
                  <div key={column.key}>
                    <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream">
                      {t.footer.columns[column.key]}
                    </h2>
                    <ul className="mt-[18px] flex flex-col gap-[11px]">
                      {column.names.map((name) => {
                        const href = footerLinks[name];
                        return (
                          <li key={name}>
                            {href ? (
                              <Link href={href} className={itemStyle}>
                                {name}
                              </Link>
                            ) : (
                              <a href="#" className={itemStyle}>
                                {name}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <div>
                  <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream">
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
                  <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream">
                    {t.footer.contactTitle}
                  </h2>
                  <ul className="mt-[18px] flex flex-col gap-[11px] text-[11.5px] leading-[17px] text-cream/90">
                    <li className="flex gap-2">
                      <MapPin className="mt-0.5 w-3 shrink-0" />
                      <span>{t.footer.address}</span>
                    </li>
                    <li className="flex gap-2">
                      <Mail className="mt-0.5 w-3.5 shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="transition-colors hover:text-white num"
                      >
                        {contact.email}
                      </a>
                    </li>
                    <li className="flex gap-2">
                      <Phone className="mt-0.5 w-3.5 shrink-0" />
                      <span className="flex flex-col gap-1">
                        {contact.phones.map((phone) => (
                          <a
                            key={phone.number}
                            href={`tel:${phone.number.replace(/\s/g, "")}`}
                            className="transition-colors hover:text-white"
                          >
                            <span className="text-cream/60">
                              {t.footer.offices[phone.key]}
                            </span>{" "}
                            <span className="num">{phone.number}</span>
                          </a>
                        ))}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </FooterReveal>
  );
}
