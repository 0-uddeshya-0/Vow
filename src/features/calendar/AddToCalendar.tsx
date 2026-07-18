import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus } from "lucide-react";
import { useI18n } from "../../i18n";
import { Button } from "../../components/ui/Button";
import { calendarUrls, downloadIcs } from "../../lib/calendar";
import { ANIM_OFF } from "../../animations/motionSafe";
import type { EventDoc, ScheduleItem } from "../../types";

const item =
  "block w-full rounded-xl px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface";

export function AddToCalendar({
  event,
  schedule,
}: {
  event: EventDoc;
  schedule: ScheduleItem[] | undefined;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const title = event.coupleNames;
  const urls = calendarUrls(event, schedule, title);

  return (
    <div className="relative">
      <Button variant="quiet" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <CalendarPlus size={15} aria-hidden /> {t.calendar.add}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={ANIM_OFF ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            // fixed-free: the trigger sits in normal flow, no overflow clipping
            className="glass absolute left-0 z-30 mt-2 w-56 rounded-2xl p-1.5"
          >
            <a className={item} href={urls.google} target="_blank" rel="noreferrer noopener">
              {t.calendar.google}
            </a>
            <a className={item} href={urls.outlook} target="_blank" rel="noreferrer noopener">
              {t.calendar.outlook}
            </a>
            <button className={item} onClick={() => downloadIcs(event, schedule, title)}>
              {t.calendar.apple}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
