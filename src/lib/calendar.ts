import type { EventDoc, ScheduleItem } from "../types";
import { eventStartMs } from "./datetime";

/** UTC stamp in iCal basic format. */
function stamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function bounds(event: EventDoc, schedule: ScheduleItem[] | undefined) {
  const sorted = [...(schedule ?? [])].sort((a, b) => a.start.localeCompare(b.start));
  const first = sorted[0]?.start ?? "10:00";
  const last = sorted.at(-1)?.end ?? sorted.at(-1)?.start ?? "22:00";
  return { start: eventStartMs(event, first), end: eventStartMs(event, last) };
}

function icsBody(event: EventDoc, title: string, where: string, startMs: number, endMs: number) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vow//Event//EN",
    "BEGIN:VEVENT",
    `UID:vow-${event.id}-${startMs}@vow`,
    `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART:${stamp(startMs)}`,
    `DTEND:${stamp(endMs)}`,
    `SUMMARY:${title}`,
    where ? `LOCATION:${where.replace(/,/g, "\\,")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcs(event: EventDoc, schedule: ScheduleItem[] | undefined, title: string) {
  const { start, end } = bounds(event, schedule);
  const blob = new Blob([icsBody(event, title, "", start, end)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Google and Outlook take the same UTC window as query params. */
export function calendarUrls(
  event: EventDoc,
  schedule: ScheduleItem[] | undefined,
  title: string,
): { google: string; outlook: string } {
  const { start, end } = bounds(event, schedule);
  const g = `${stamp(start)}/${stamp(end)}`;
  return {
    google:
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}&dates=${g}`,
    outlook:
      "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose" +
      `&subject=${encodeURIComponent(title)}` +
      `&startdt=${new Date(start).toISOString()}&enddt=${new Date(end).toISOString()}`,
  };
}
