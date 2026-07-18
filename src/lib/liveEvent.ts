import type { EventDoc, ScheduleItem } from "../types";
import { eventStartMs } from "./datetime";

export type LiveState = {
  current: ScheduleItem | null;
  next: ScheduleItem | null;
  /** ms until `next` starts (0 when unknown) */
  msToNext: number;
  /** ms until `current` ends (0 when unknown) */
  msRemaining: number;
  past: ScheduleItem[];
};

/** Absolute ms for an item's start/end, resolved in the event timezone. */
export function itemWindow(event: EventDoc, item: ScheduleItem): { start: number; end: number } {
  const dated = { ...event, date: item.date };
  const start = eventStartMs(dated, item.start);
  // No end time → treat as a 45-minute marker so "now" doesn't stick forever.
  const end = item.end ? eventStartMs(dated, item.end) : start + 45 * 60_000;
  return { start, end };
}

/**
 * Derives now/next from the schedule. Pure function of (items, now) so the UI
 * can advance on a timer and so it is testable without faking the clock.
 */
export function liveState(
  event: EventDoc,
  items: ScheduleItem[],
  now = Date.now(),
): LiveState {
  const sorted = [...items]
    .map((i) => ({ item: i, ...itemWindow(event, i) }))
    .sort((a, b) => a.start - b.start);

  const current = sorted.find((s) => now >= s.start && now < s.end) ?? null;
  const next = sorted.find((s) => s.start > now) ?? null;
  const past = sorted.filter((s) => s.end <= now).map((s) => s.item);

  return {
    current: current?.item ?? null,
    next: next?.item ?? null,
    msToNext: next ? next.start - now : 0,
    msRemaining: current ? current.end - now : 0,
    past,
  };
}

export function formatDuration(ms: number, lang: "en" | "de"): string {
  const mins = Math.max(0, Math.round(ms / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (lang === "de") return h ? `${h} Std. ${m} Min.` : `${m} Min.`;
  return h ? `${h} h ${m} min` : `${m} min`;
}
