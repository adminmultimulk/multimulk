/**
 * Reading the visitor list out of a paste.
 *
 * The list lives in a spreadsheet that the sales team keeps editing, so the
 * import has to survive being run again — on a sheet with four new rows and one
 * corrected phone number — without creating duplicates or resetting a status
 * somebody set by hand in the dashboard. Copying a block of cells out of Excel
 * puts tab-separated text on the clipboard, which is why a paste box is the
 * import rather than a file upload: it is one keystroke from the sheet the
 * team is already looking at, and there is no file to go stale on a laptop.
 */

import {
  computeRemindAt,
  dedupeKey,
  normaliseEmail,
  normalisePhone,
  parseSlot,
  parseStatus,
  parseVisitDate,
  type Slot,
  type Status,
} from "./parse";

export type ParsedVisitor = {
  serial: number | null;
  name: string;
  email: string;
  phone: string;
  visitDateRaw: string;
  visitDate: Date | null;
  slot: Slot;
  preferredTimeRaw: string;
  status: Status;
  notes: string;
  remindAt: Date | null;
  dedupeKey: string;
};

export type ImportResult = {
  rows: ParsedVisitor[];
  /** Rows that could not be read at all, with the line number and why. */
  skipped: { line: number; text: string; reason: string }[];
};

/** One row, tab- or comma-separated. Quotes are honoured for the comma case. */
function splitRow(line: string): string[] {
  if (line.includes("\t")) return line.split("\t").map((cell) => cell.trim());

  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

const HEADER = /^(ser\.?|s\.?no|#|name)\b/i;

/**
 * Parses the pasted block.
 *
 * Column order is the sheet's — Ser., Name, Visit Date, Preferred Time, Phone,
 * Email, Remarks — and a leading serial number is optional, because somebody
 * pasting three late additions will not renumber them. Which of the first two
 * columns is the name is decided per row: a first cell that is only digits is a
 * serial, anything else is the name.
 */
export function parseVisitorPaste(
  text: string,
  options: { event: string; list: string; fallbackYear: number },
): ImportResult {
  const rows: ParsedVisitor[] = [];
  const skipped: ImportResult["skipped"] = [];
  const seen = new Set<string>();

  text.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    if (!line.trim()) return;

    const cells = splitRow(line);
    if (HEADER.test(cells[0] ?? "")) return;
    // The sheet's title row, and the empty numbered rows below the last entry.
    if (cells.filter(Boolean).length < 2) return;

    let serial: number | null = null;
    let offset = 0;
    const first = (cells[0] ?? "").replace(/\.0$/, "");
    if (/^\d+$/.test(first)) {
      serial = Number(first);
      offset = 1;
    }

    const name = (cells[offset] ?? "").replace(/\s+/g, " ").trim();
    if (!name) {
      skipped.push({ line: lineNumber, text: line, reason: "No name in the row." });
      return;
    }

    const visitDateRaw = cells[offset + 1] ?? "";
    const preferredTimeRaw = cells[offset + 2] ?? "";
    const phone = normalisePhone(cells[offset + 3] ?? "");
    const email = normaliseEmail(cells[offset + 4] ?? "");
    const notes = (cells[offset + 5] ?? "").trim();

    if (!email && !phone) {
      skipped.push({
        line: lineNumber,
        text: line,
        reason: `${name} has neither an email address nor a phone number, so there is no way to remind them.`,
      });
      return;
    }

    const visitDate = parseVisitDate(visitDateRaw, options.fallbackYear);
    const slot = parseSlot(preferredTimeRaw);
    const key = dedupeKey(options.event, { email, phone, name });

    // Two rows for the same person inside one paste: the later one wins, which
    // is how a corrected row appended to the bottom of the sheet behaves.
    if (seen.has(key)) {
      const previous = rows.findIndex((row) => row.dedupeKey === key);
      if (previous !== -1) rows.splice(previous, 1);
    }
    seen.add(key);

    rows.push({
      serial,
      name,
      email,
      phone,
      visitDateRaw: visitDateRaw.trim(),
      visitDate,
      slot,
      preferredTimeRaw: preferredTimeRaw.trim(),
      status: parseStatus(notes),
      notes,
      remindAt: computeRemindAt(visitDate, slot, preferredTimeRaw),
      dedupeKey: key,
    });
  });

  return { rows, skipped };
}
