import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { ContactForm } from "@/app/components/contact-form";
import { Mail, MapPin, Phone } from "@/app/components/icons";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { contact, officeMap } from "@/app/lib/content";
import { alternatesFor, getDictionary, getI18n } from "@/app/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.contact, alternates: await alternatesFor("/contact-us") };
}

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const map = officeMap(locale);

  return (
    <>
      <div className="relative">
        <SiteNav />
        <section className="relative flex h-[560px] items-center overflow-hidden bg-forest">
          <Image
            src="/images/listing-hero.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-forest-deep/80 via-forest-deep/40 to-forest-deep/60" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-forest-deep/70 to-transparent" />

          <Container className="relative">
            <h1 className="font-display text-[46px] leading-[1.1] text-white sm:text-[68px] lg:text-end">
              <AnimatedTitle align="center" className="lg:justify-end">
                {t.contact.heading}
              </AnimatedTitle>
            </h1>
          </Container>
        </section>
      </div>

      <main className="flex-1 py-16 lg:py-20">
        <Container>
          <div className="bg-mist p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
              <div>
                <h2 className="max-w-[420px] font-display text-[30px] leading-[1.24] text-ink sm:text-[38px]">
                  {t.contact.leadHeading}
                </h2>
                <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                  {t.contact.leadBody}
                </p>

                <dl className="mt-10 space-y-7">
                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      {t.contact.emailLabel}
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <Mail className="mt-0.5 w-4 shrink-0 text-ink/50" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="num text-[13.5px] text-ink transition-colors hover:text-gold"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      {t.contact.phoneLabel}
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <Phone className="mt-0.5 w-4 shrink-0 text-ink/50" />
                      <span className="flex flex-col gap-1.5">
                        {contact.phones.map((phone) => (
                          <a
                            key={phone.number}
                            href={`tel:${phone.number.replace(/\s/g, "")}`}
                            className="text-[13.5px] text-ink transition-colors hover:text-gold"
                          >
                            <span className="text-ink/50">
                              {t.footer.offices[phone.key]}
                            </span>{" "}
                            <span className="num">{phone.number}</span>
                          </a>
                        ))}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      {t.contact.addressLabel}
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <MapPin className="mt-0.5 w-3.5 shrink-0 text-ink/50" />
                      <span className="max-w-[300px] text-[13.5px] leading-[21px] text-ink">
                        {t.footer.address}
                      </span>
                    </dd>
                    {/* The same address, shown rather than described. */}
                    <dd className="mt-5">
                      <div className="aspect-[16/10] w-full max-w-[440px] overflow-hidden border border-ink/10 bg-white">
                        <iframe
                          src={map.embed}
                          title={t.contact.mapTitle}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="h-full w-full border-0"
                        />
                      </div>
                      <a
                        href={map.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-[11.5px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-gold"
                      >
                        {t.contact.mapLink}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <ContactForm />
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
