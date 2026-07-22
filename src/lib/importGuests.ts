/**
 * Parse a pasted or uploaded guest list into draft rows. Accepts CSV or
 * tab-separated text, with or without a header row. Recognised columns:
 * name, email, phone, role(s), language — matched by header name when a header
 * is present, otherwise positional in that order. Pure: no ids, no writes.
 */

export type ParsedGuest = {
  fullName: string;
  email: string;
  phone: string;
  roles: string[];
  language: "en" | "de";
};

export type ImportRow = { data: ParsedGuest; issues: string[]; duplicate: boolean };

const HEADER_ALIASES: Record<keyof ColumnMap, string[]> = {
  name: ["name", "fullname", "full name", "guest"],
  email: ["email", "e-mail", "mail"],
  phone: ["phone", "mobile", "tel", "number"],
  role: ["role", "roles", "group"],
  language: ["language", "lang", "sprache"],
};

type ColumnMap = { name: number; email: number; phone: number; role: number; language: number };

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuote = !inQuote;
    } else if ((c === "," || c === "\t" || c === ";") && !inQuote) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const emailOk = (s: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
const normPhone = (s: string) => s.replace(/[^\d+]/g, "");

function detectHeader(cells: string[]): ColumnMap | null {
  const lower = cells.map((c) => c.toLowerCase());
  const isHeader = (Object.values(HEADER_ALIASES) as string[][]).some((aliases) =>
    lower.some((c) => aliases.includes(c)),
  );
  if (!isHeader) return null;
  const find = (aliases: string[]) => lower.findIndex((c) => aliases.includes(c));
  return {
    name: find(HEADER_ALIASES.name),
    email: find(HEADER_ALIASES.email),
    phone: find(HEADER_ALIASES.phone),
    role: find(HEADER_ALIASES.role),
    language: find(HEADER_ALIASES.language),
  };
}

export function parseGuestList(
  text: string,
  existing: { email: string; phone: string }[] = [],
): ImportRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const header = detectHeader(splitLine(lines[0]));
  const map: ColumnMap = header ?? { name: 0, email: 1, phone: 2, role: 3, language: 4 };
  const startIdx = header ? 1 : 0;

  const existingKeys = new Set(
    existing.flatMap((e) => [e.email.toLowerCase(), normPhone(e.phone)].filter(Boolean)),
  );
  const seen = new Set<string>();
  const rows: ImportRow[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const at = (idx: number) => (idx >= 0 ? (cells[idx] ?? "").trim() : "");
    const fullName = at(map.name);
    const email = at(map.email);
    const phone = at(map.phone);
    const roleStr = at(map.role);
    const langRaw = at(map.language).toLowerCase();

    const roles = roleStr
      ? roleStr.split(/[;/|]/).map((r) => r.trim()).filter(Boolean)
      : ["Guest"];
    const language: "en" | "de" = langRaw.startsWith("de") ? "de" : "en";

    const issues: string[] = [];
    if (!fullName) issues.push("missing name");
    if (email && !emailOk(email)) issues.push("invalid email");

    const key = email.toLowerCase() || normPhone(phone);
    const duplicate = !!key && (existingKeys.has(key) || seen.has(key));
    if (key) seen.add(key);

    rows.push({
      data: { fullName, email, phone, roles: roles.length ? roles : ["Guest"], language },
      issues,
      duplicate,
    });
  }
  return rows;
}

/** A ready-to-download CSV template with the recognised header + one example. */
export const GUEST_CSV_TEMPLATE =
  "name,email,phone,role,language\n" +
  "Anna Beispiel,anna@example.com,+49 170 1234567,Guest,de\n" +
  "John Example,john@example.com,+49 171 7654321,Witness,en\n";
