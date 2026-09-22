/**
 * The story of a development: the long-form sections a developer's project
 * sheet carries and a unit's specs do not.
 *
 * A listing's page opens with what a buyer asks first — the price, the
 * layout, the view — and the sections here are what they ask next: what the
 * building is like, what it stands on, how far the airport is, what the
 * district is and where its prices are going. A lister writes them once, on
 * whichever unit they fill in first, and both the unit's page and the
 * development assembled around it read them from there.
 *
 * Every field is optional and every section is omitted rather than shown
 * empty, which is the same deal the rest of the listing's page makes. The
 * prose is in the article grammar of `rich-text.ts`, so a heading, a list, a
 * table and a figure all mean here what they mean in an article.
 */

/** One row of the distances table, under the group it was listed in. */
export type Distance = {
  /** "Cultural Hubs", "Airports" — translated where the site knows the name. */
  group: string;
  name: string;
  /** "4 km". May be blank where only a time was given. */
  distance: string;
  /** "10–15 min", "7 min walk". May be blank where only a distance was given. */
  time: string;
};

/**
 * The group names the site knows: translated on the page and given an icon.
 * Offered as suggestions in the dashboard; any other name is allowed and shown
 * as written.
 */
export const distanceGroups: readonly string[] = [
  "Cultural Hubs",
  "Airports",
  "Hospitals",
  "Business Hubs",
  "Transportation",
  "Universities",
  "Schools",
  "Shopping Centres",
];

export type Story = {
  architecture: string | null;
  earthquake: string | null;
  distances: Distance[];
  areaOverview: string | null;
  areaGallery: string[];
  marketPerformance: string | null;
  marketChart: string | null;
};

/**
 * The distances, regrouped for the page: one entry per group, in the order
 * the groups were first named, each with its rows in the order they were
 * written.
 */
export function groupDistances(
  distances: readonly Distance[],
): { group: string; rows: Distance[] }[] {
  const groups = new Map<string, Distance[]>();
  for (const row of distances) {
    const bucket = groups.get(row.group);
    if (bucket) bucket.push(row);
    else groups.set(row.group, [row]);
  }
  return [...groups].map(([group, rows]) => ({ group, rows }));
}

// --- The dashboard's textarea grammar ----------------------------------------
//
// Distances are typed into one box, the way the developer's sheet lists them:
//
//     ## Cultural Hubs
//     Taksim Square | 4 km | 10–15 min
//     Grand Bazaar | 9 km | 20–25 min
//     ## Transport
//     Metro station, M2 line | | 7 min walk
//
// A `## ` line names the group the rows under it belong to; a row is a name,
// a distance and a time, separated by `|`, with either of the last two
// allowed blank. The same shape the highlights box uses, so a lister who has
// filled one in can fill in the other.

const SPLIT = "|";

/** The rows in the box, ignoring anything that is not one. */
export function parseDistances(value: string): Distance[] {
  const rows: Distance[] = [];
  let group = "";
  for (const raw of value.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      group = line.slice(3).trim();
      continue;
    }
    const [name = "", distance = "", time = ""] = line
      .split(SPLIT)
      .map((part) => part.trim());
    if (!group || !name || (!distance && !time)) continue;
    rows.push({ group, name, distance, time });
  }
  return rows;
}

/**
 * What is wrong with the box, if anything — a row before any group has been
 * named, or one with neither a distance nor a time. `parseDistances` drops
 * these quietly, and quiet is exactly wrong at the moment of saving.
 */
export function checkDistances(value: string): string | null {
  let group = "";
  for (const raw of value.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      group = line.slice(3).trim();
      if (!group) return 'A "## " line needs a group name after it — "## Airports".';
      continue;
    }
    if (!group)
      return 'Start with a group line — "## Cultural Hubs" — before listing places under it.';
    const [name = "", distance = "", time = ""] = line
      .split(SPLIT)
      .map((part) => part.trim());
    if (!name || (!distance && !time))
      return `Each place is one line, written as "Name | 4 km | 10–15 min" — either the distance or the time may be left blank, not both. Check "${line}".`;
  }
  return null;
}

/** The box's text, back from the rows — for the edit form. */
export function formatDistances(distances: readonly Distance[]): string {
  return groupDistances(distances)
    .map(({ group, rows }) =>
      [
        `## ${group}`,
        ...rows.map((row) => `${row.name} | ${row.distance} | ${row.time}`),
      ].join("\n"),
    )
    .join("\n\n");
}
