import { Container } from "./container";
import { ContactForm } from "./contact-form";
import { Mail, MapPin, Phone } from "./icons";
import type { Programme } from "@/app/lib/citizenship";
import { contact } from "@/app/lib/content";
import { mintFormToken } from "@/app/lib/leads/token";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The enquiry form, on the page rather than a click away on /contact-us.
 *
 * The `#enquire` id is what the hero and the mid-page band point at, so the
 * whole page has one destination for "I want to talk to someone" instead of
 * sending a reader who has just finished reading somewhere else to start again.
 */
export async function CitizenshipEnquire({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship[programme.key].enquire;

  return (
    <section
      id="enquire"
      className="scroll-mt-[72px] bg-white pb-[72px] lg:pb-[104px]"
    >
      <Container>
        <div className="bg-mist p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <h2 className="max-w-[420px] font-display text-[28px] leading-[1.24] text-ink sm:text-[36px]">
                {copy.heading}
              </h2>
              <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                {copy.body}
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
                  {contact.offices.map((office) => (
                    <dd
                      key={office.key}
                      className="mt-2 flex items-start gap-2.5"
                    >
                      <MapPin className="mt-0.5 w-3.5 shrink-0 text-ink/50" />
                      <span className="max-w-[300px] text-[13.5px] leading-[21px] text-ink">
                        <span className="text-ink/50">
                          {t.footer.offices[office.key]}
                        </span>{" "}
                        {t.footer.addresses[office.key]}
                      </span>
                    </dd>
                  ))}
                </div>
              </dl>
            </div>

            {/* The form defaults its enquiry type to the programme being read. */}
            <ContactForm
              token={mintFormToken()}
              programme={programme.key}
              defaultEnquiry={
                programme.key === "turkiye"
                  ? "turkishCitizenship"
                  : "caribbeanCbi"
              }
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
