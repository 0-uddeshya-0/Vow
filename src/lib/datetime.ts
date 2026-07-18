import type { EventDoc } from "../types";

export type CountdownParts = { days: number; hours: number; minutes: number; seconds: number; past: boolean };

/** Event start as a real instant in the event's timezone (DST-safe). */
export function eventStartMs(event: EventDoc, startTime = "10:00"): number {
  // Interpret date+time in the event TZ by round-tripping through Intl.
  const [y, m, d] = event.date.split("-").map(Number);
  const [hh, mm] = startTime.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(guess).map((p) => [p.type, p.value]));
  const asIf = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return guess - (asIf - guess);
}

export function countdownTo(targetMs: number, now = Date.now()): CountdownParts {
  const diff = targetMs - now;
  const past = diff <= 0;
  const abs = Math.max(diff, 0);
  return {
    past,
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor(abs / 3_600_000) % 24,
    minutes: Math.floor(abs / 60_000) % 60,
    seconds: Math.floor(abs / 1_000) % 60,
  };
}

export function formatEventDate(event: EventDoc, lang: "en" | "de"): string {
  const [y, m, d] = event.date.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: event.timezone,
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function isEventDay(event: EventDoc, now = new Date()): boolean {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: event.timezone }).format(now);
  return today === event.date;
}

/** True inside the final `days` before (and on) the event date. */
export function withinDaysBefore(
  date: string,
  timezone: string,
  days: number,
  now = new Date(),
): boolean {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now);
  const diffDays = (Date.parse(date) - Date.parse(today)) / 86_400_000;
  return diffDays >= 0 && diffDays <= days;
}

export function beforeDeadline(event: EventDoc, now = Date.now()): boolean {
  return now <= eventStartMs({ ...event, date: event.rsvpDeadline }, "23:59");
}
