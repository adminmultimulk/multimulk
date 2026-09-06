/**
 * The show itself: the facts that appear in every reminder.
 *
 * One module rather than strings in the template, because the same five
 * details are read by the email, the WhatsApp message and the report header,
 * and a stand number that is right in two of the three is worse than useless.
 *
 * Free of `server-only`: the report page renders these, and so does the
 * client-side WhatsApp preview.
 */

export const EVENT = {
  key: "ips-2026",
  name: "International Property Show 2026",
  shortName: "IPS 2026",
  venue: "Dubai World Trade Centre, Dubai",
  stand: "E52, Hall 7",
  /** The days the show runs, in Dubai time. */
  days: ["2026-09-07", "2026-09-08", "2026-09-09"] as const,
  daysLabel: "7–9 September 2026",
  hoursLabel: "10:00 AM–6:00 PM",
  company: "Multi Mulk Consultancy",
  tagline: "Global Solutions for Global Citizens",
} as const;

/**
 * Where an email's images and fonts are fetched from.
 *
 * The literal production origin rather than `siteUrl`, and that is deliberate:
 * an email is opened weeks after it was sent, long after the deploy that built
 * it has been replaced. Rendered against a preview URL it would carry a logo
 * that 404s forever. This is also why it is a constant here rather than an
 * import from `../site` — that module resolves to whichever deployment is
 * running, which is right for a page and wrong for a message.
 *
 * `www`, because the apex 308-redirects to it. Mail clients fetch images
 * through their own proxies, and a redirect is one more hop for something that
 * has to render before the reader loses interest.
 */
export const BRAND_ORIGIN = "https://www.multimulk.com";

/** The brand palette, as `app/globals.css` defines it. */
export const BRAND = {
  ink: "#222a2c",
  forest: "#12402a",
  forestDeep: "#071f13",
  gold: "#b38a1e",
  goldLight: "#cfa53c",
  sand: "#e3d9be",
  mist: "#edf2ee",
  cream: "#f5f4f2",
  white: "#ffffff",
  /** Body copy that is present but secondary — labels, the sign-off. */
  muted: "#6b7280",
} as const;

/**
 * The two type stacks, spelled out for email.
 *
 * Every element carries its `font-family` inline because Gmail and Outlook
 * strip or ignore a `<style>` block often enough that a stack declared only
 * once is a stack that is often not applied. The webfonts are an enhancement
 * on top: Apple Mail loads them, most others fall through — which is why the
 * fallbacks are the same ones `globals.css` names, Georgia behind The Seasons
 * and the system sans behind Manrope, so an unstyled read is still on-brand.
 */
export const BRAND_FONTS = {
  display: `'The Seasons', Georgia, 'Times New Roman', serif`,
  sans: `'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
} as const;

/**
 * Where a visitor's reply goes.
 *
 * Not the sending address. `enquiries@multimulk.com` is a verified *sender* —
 * Resend proved the domain can send from it — but no mailbox answers there, so
 * a reply to it bounces. The reminder explicitly invites a reply, which makes
 * that the difference between a visitor moving their slot and a visitor
 * silently not turning up.
 */
export const REPLY_TO = process.env.EVENT_REPLY_TO || "admin@multimulk.com";

/** Dubai is UTC+4 all year — no daylight saving, so a fixed offset is exact. */
export const DUBAI_OFFSET_HOURS = 4;

/**
 * When each half of the day starts, in Dubai time. The reminder is scheduled
 * against this, not against the show's opening hour, so somebody booked for
 * the afternoon is not woken at seven in the morning.
 */
export const SLOT_START_HOUR: Record<
  "MORNING" | "AFTERNOON" | "EVENING" | "UNSPECIFIED",
  number
> = {
  MORNING: 10,
  AFTERNOON: 14,
  EVENING: 17,
  // Treated as the start of the show day: the visitor never said, so the
  // reminder goes early rather than possibly after they have already been.
  UNSPECIFIED: 10,
};

export const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  UNSPECIFIED: "Not stated",
};

export const STATUS_LABELS: Record<string, string> = {
  AWAITING: "Response awaited",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  ATTENDED: "Attended",
  NO_SHOW: "Did not attend",
};

/**
 * How far ahead of the slot a reminder goes out. Twenty hours puts a morning
 * visit's reminder into the previous afternoon, which is when somebody can
 * still rearrange their day — an hour before is a notification, not a
 * reminder.
 */
export const LEAD_HOURS = Number(process.env.EVENT_REMINDER_LEAD_HOURS ?? 20);
