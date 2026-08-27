import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "../components/animated-title";
import { Container } from "../components/container";
import { ContactForm } from "../components/contact-form";
import { Mail, MapPin, Phone } from "../components/icons";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { footer } from "../lib/content";

export const metadata: Metadata = {
  title: "Contact Us | Multi Mulk",
  description:
    "Speak to the Multi Mulk team about Turkish citizenship by investment, Türkiye property, and Caribbean CBI programmes.",
};

export default function ContactPage() {
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
            <h1 className="font-display text-[46px] leading-[1.1] text-white sm:text-[68px] lg:text-right">
              <AnimatedTitle align="center" className="lg:justify-end">
                Contact Us
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
                  A new level of luxury living awaits make it yours today.
                </h2>
                <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                  Whether you are exploring Turkish citizenship by investment,
                  looking for a property in İstanbul or on the coast, or
                  considering a Caribbean programme, our team is here to guide
                  you with discretion, clarity, and expertise.
                </p>

                <dl className="mt-10 space-y-7">
                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      Email
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <Mail className="mt-0.5 w-4 shrink-0 text-ink/50" />
                      <a
                        href={`mailto:${footer.contact.email}`}
                        className="text-[13.5px] text-ink transition-colors hover:text-gold"
                      >
                        {footer.contact.email}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      Phone
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <Phone className="mt-0.5 w-4 shrink-0 text-ink/50" />
                      <span className="flex flex-col gap-1.5">
                        {footer.contact.phones.map((phone) => (
                          <a
                            key={phone.number}
                            href={`tel:${phone.number.replace(/\s/g, "")}`}
                            className="text-[13.5px] text-ink transition-colors hover:text-gold"
                          >
                            <span className="text-ink/50">{phone.label}</span>{" "}
                            {phone.number}
                          </a>
                        ))}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      Address
                    </dt>
                    <dd className="mt-2 flex items-start gap-2.5">
                      <MapPin className="mt-0.5 w-3.5 shrink-0 text-ink/50" />
                      <span className="max-w-[300px] text-[13.5px] leading-[21px] text-ink">
                        {footer.contact.address}
                      </span>
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
