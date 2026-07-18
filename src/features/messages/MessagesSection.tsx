import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { useI18n } from "../../i18n";
import { fadeUp, reveal } from "../../animations/variants";
import { Skeleton } from "../../components/ui/Skeleton";
import { visibleTo, type Guest, type Message } from "../../types";

/** Announcements, filtered to this guest's roles — the couple's inbox to them. */
export function MessagesSection({
  messages,
  guest,
  loading,
}: {
  messages: Message[] | undefined;
  guest: Guest | null;
  loading: boolean;
}) {
  const { t, lt } = useI18n();

  if (loading) return <Skeleton className="h-28" />;

  const visible = (messages ?? []).filter((m) => visibleTo(m.visibility, guest));
  if (visible.length === 0) return null;

  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-col gap-3 p-0">
      {visible.map((m) => {
        const targeted = m.visibility.allowedRoles.length > 0 || m.visibility.allowedGuests.length > 0;
        return (
          <motion.li key={m.id} variants={fadeUp} className="glass rounded-[var(--radius-card)] p-5">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-gold-ink" aria-hidden />
              <h3 className="font-display text-xl text-ink">{lt(m.title)}</h3>
              {targeted ? (
                <span className="ml-auto rounded-full border border-hairline bg-surface/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-gold-ink">
                  {t.schedule.onlyForYou}
                </span>
              ) : null}
            </div>
            <p className="mt-2 max-w-[56ch] text-ink-soft">{lt(m.body)}</p>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
