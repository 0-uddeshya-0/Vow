import { CalendarPlus } from "lucide-react";
import { useI18n } from "../../i18n";
import { Popover, popoverItem } from "../../components/ui/Popover";
import { itemCalendarUrls, downloadItemIcs } from "../../lib/calendar";
import type { EventDoc, ScheduleItem } from "../../types";

/**
 * Compact per-schedule-item "add to calendar" — an icon-only trigger over the
 * shared Popover (which closes on outside tap / Escape and flips near the dock).
 */
export function ItemCalendarButton({ event, item }: { event: EventDoc; item: ScheduleItem }) {
  const { t, lt } = useI18n();
  const title = `${lt(item.title)} — ${event.coupleNames}`;
  const urls = itemCalendarUrls(event, item, title);

  return (
    <Popover
      align="right"
      trigger={(open) => (
        <span
          aria-label={t.calendar.add}
          className={
            "inline-flex size-10 items-center justify-center rounded-full border transition-colors " +
            (open
              ? "border-hairline text-gold-ink"
              : "border-hairline-soft text-ink-soft hover:border-hairline hover:text-gold-ink")
          }
        >
          <CalendarPlus size={16} aria-hidden />
        </span>
      )}
    >
      {(close) => (
        <>
          <a
            className={popoverItem}
            href={urls.google}
            target="_blank"
            rel="noreferrer noopener"
            role="menuitem"
            onClick={close}
          >
            {t.calendar.google}
          </a>
          <a
            className={popoverItem}
            href={urls.outlook}
            target="_blank"
            rel="noreferrer noopener"
            role="menuitem"
            onClick={close}
          >
            {t.calendar.outlook}
          </a>
          <button
            className={popoverItem}
            role="menuitem"
            onClick={() => {
              downloadItemIcs(event, item, title);
              close();
            }}
          >
            {t.calendar.apple}
          </button>
        </>
      )}
    </Popover>
  );
}
