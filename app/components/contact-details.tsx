import { contact } from "@/app/lib/content";
import { getDictionary } from "@/app/lib/i18n";
import { Mail, MapPin, Phone } from "./icons";

/**
 * Who to talk to instead of filling the form in: the address enquiries reach,
 * the three offices' numbers, and where those offices are.
 *
 * The block that sits beside every copy of the enquiry form. It reads at two
 * sizes — `compact` is the one a dialog has room for — because the difference
 * between them was never more than a point of type and a little less air.
 */
export async function ContactDetails({
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = await getDictionary();
  const text = compact ? "text-[13px]" : "text-[13.5px]";

  return (
    <dl className={compact ? "mt-8 space-y-5" : "mt-10 space-y-7"}>
      <div>
        <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
          {t.contact.emailLabel}
        </dt>
        <dd className="mt-2 flex items-start gap-2.5">
          <Mail className="mt-0.5 w-4 shrink-0 text-ink/50" />
          <a
            href={`mailto:${contact.email}`}
            className={`num ${text} text-ink transition-colors hover:text-gold`}
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
                className={`${text} text-ink transition-colors hover:text-gold`}
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
          <dd key={office.key} className="mt-2 flex items-start gap-2.5">
            <MapPin className="mt-0.5 w-3.5 shrink-0 text-ink/50" />
            <span
              className={`max-w-[300px] ${text} leading-[21px] text-ink`}
            >
              <span className="text-ink/50">
                {t.footer.offices[office.key]}
              </span>{" "}
              {t.footer.addresses[office.key]}
            </span>
          </dd>
        ))}
      </div>
    </dl>
  );
}
