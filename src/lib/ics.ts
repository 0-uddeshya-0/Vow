import { wedding } from "../config/wedding";

/** Builds a downloadable .ics so "save the date" is one tap, no service. */
export function downloadIcs(lang: "en" | "de"): void {
  const d = wedding.date.iso.replaceAll("-", "");
  const start = wedding.date.dayStart.replace(":", "") + "00";
  const end = wedding.date.dayEnd.replace(":", "") + "00";
  const title = lang === "de" ? "Hochzeit Michael & Dina" : "Michael & Dina's Wedding";
  const location = wedding.ceremonyVenue;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vow//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:vow-${wedding.date.iso}@vow`,
    `DTSTART;TZID=${wedding.date.timezone}:${d}T${start}`,
    `DTEND;TZID=${wedding.date.timezone}:${d}T${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "michael-dina-2026-09-18.ics";
  a.click();
  URL.revokeObjectURL(url);
}
