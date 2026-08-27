import Image from "next/image";
import Link from "next/link";
import { footer, footerLinks } from "@/app/lib/content";
import { Facebook, Instagram, LinkedIn, Mail, MapPin, Phone } from "./icons";

const socials = [LinkedIn, Instagram, Facebook];

export function SiteFooter() {
  return (
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
                  alt="Multi Mulk — Global Solutions for Global Citizens"
                  width={400}
                  height={113}
                  className="h-auto w-[230px] lg:w-[280px]"
                />
              </Link>

              <div className="mt-6 flex flex-col gap-2.5">
                {footer.entities.map((entity) => (
                  <div key={entity} className="flex items-center gap-2.5">
                    <span className="text-[11.5px] text-cream/90">{entity}</span>
                    <div className="flex items-center gap-[7px]">
                      {socials.map((Icon, i) => (
                        <a
                          key={i}
                          href="#"
                          aria-label={`${entity} social profile`}
                          className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-cream/70 text-cream/90 transition-colors hover:border-cream hover:text-cream"
                        >
                          <Icon className="w-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[10.5px] text-cream/80">
                {footer.copyright}
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {footer.columns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-cream">
                    {column.title}
                  </h2>
                  <ul className="mt-[18px] flex flex-col gap-[11px]">
                    {column.items.map((item) => {
                      const href = footerLinks[item];
                      const style =
                        "text-[11.5px] leading-[17px] text-cream/90 transition-colors hover:text-white";
                      return (
                        <li key={item}>
                          {href ? (
                            <Link href={href} className={style}>
                              {item}
                            </Link>
                          ) : (
                            <a href="#" className={style}>
                              {item}
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
                  {footer.contact.title}
                </h2>
                <ul className="mt-[18px] flex flex-col gap-[11px] text-[11.5px] leading-[17px] text-cream/90">
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 w-3 shrink-0" />
                    <span>{footer.contact.address}</span>
                  </li>
                  <li className="flex gap-2">
                    <Mail className="mt-0.5 w-3.5 shrink-0" />
                    <a
                      href={`mailto:${footer.contact.email}`}
                      className="transition-colors hover:text-white"
                    >
                      {footer.contact.email}
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <Phone className="mt-0.5 w-3.5 shrink-0" />
                    <span className="flex flex-col gap-1">
                      {footer.contact.phones.map((phone) => (
                        <a
                          key={phone.number}
                          href={`tel:${phone.number.replace(/\s/g, "")}`}
                          className="transition-colors hover:text-white"
                        >
                          <span className="text-cream/60">{phone.label}</span>{" "}
                          {phone.number}
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
  );
}
