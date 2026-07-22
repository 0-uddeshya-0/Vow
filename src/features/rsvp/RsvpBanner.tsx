import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import { useI18n } from "../../i18n";
import { entrance } from "../../animations/variants";
import { beforeDeadline, formatEventDate } from "../../lib/datetime";
import { useRsvp } from "../../hooks/queries";
import type { EventDoc, Guest } from "../../types";

/**
 * Shown to an identified guest who is browsing the info but has not answered
 * yet — a warm nudge to RSVP before the deadline. Hidden once they've replied
 * or the deadline has passed.
 */
export function RsvpBanner({ event, guest }: { event: EventDoc; guest: Guest }) {
  const { t, lang } = useI18n();
  const rsvp = useRsvp(event.id, guest.id);

  if (rsvp.isLoading || rsvp.data || !beforeDeadline(event)) return null;

  return (
    <motion.div {...entrance()} className="glass-strong rounded-[var(--radius-panel)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <PartyPopper size={22} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />
          <div>
            <p className="font-display text-xl text-ink">{t.rsvp.bannerTitle}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {t.rsvp.bannerLead}{" "}
              <span className="text-ink">{formatEventDate({ ...event, date: event.rsvpDeadline }, lang)}</span>
            </p>
          </div>
        </div>
        <Link
          to="/rsvp"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--btn-primary)] px-5 font-medium text-on-accent shadow-[0_10px_24px_-12px_var(--btn-primary)]"
        >
          {t.rsvp.bannerCta}
        </Link>
      </div>
    </motion.div>
  );
}
