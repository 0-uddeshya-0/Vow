import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Navigation } from "lucide-react";
import { useI18n } from "../../i18n";
import { GlassCard } from "../../components/ui/GlassCard";
import { entrance } from "../../animations/variants";
import { ANIM_OFF } from "../../animations/motionSafe";
import { formatDuration, liveState } from "../../lib/liveEvent";
import { mapLinks } from "../../lib/maps";
import { visibleTo, type EventDoc, type Guest, type ScheduleItem } from "../../types";

/** Live pulse on the "now" dot — the only looping animation on this screen. */
function NowDot() {
  return (
    <span className="relative flex size-2.5">
      {!ANIM_OFF ? (
        <motion.span
          className="absolute inline-flex size-full rounded-full bg-sage"
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      <span className="relative inline-flex size-2.5 rounded-full bg-sage-deep" />
    </span>
  );
}

function NavigateButton({ item }: { item: ScheduleItem }) {
  const { t } = useI18n();
  const links = mapLinks(item.location);
  if (!links) return null;
  return (
    <a
      href={links.google}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--btn-primary)] px-5 font-medium text-on-accent shadow-[0_10px_24px_-12px_var(--btn-primary)]"
    >
      <Navigation size={15} aria-hidden /> {t.schedule.navigate}
    </a>
  );
}

/**
 * Day-of view: what is happening now, what is next, how to get there.
 * Recomputed every 30s so the page advances through the day on its own.
 */
export function LiveEventMode({
  event,
  items,
  guest,
}: {
  event: EventDoc;
  items: ScheduleItem[];
  guest: Guest | null;
}) {
  const { t, lt, lang } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(
    () => items.filter((i) => visibleTo(i.visibility, guest)),
    [items, guest],
  );
  const state = useMemo(() => liveState(event, visible, now), [event, visible, now]);

  const { current, next } = state;

  return (
    <div className="flex flex-col gap-4">
      <GlassCard strong className="p-6" {...entrance()}>
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sage-deep">
          <NowDot /> {t.live.now}
        </p>

        {current ? (
          <>
            <h2 className="mt-3 font-display text-3xl text-ink">{lt(current.title)}</h2>
            <p className="tnum mt-1 text-gold-ink">
              {current.start}
              {current.end ? ` – ${current.end}` : ""}
              <span className="text-ink-soft">
                {" · "}
                {t.live.remaining} {formatDuration(state.msRemaining, lang)}
              </span>
            </p>
            {current.location.name ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-ink">
                <MapPin size={15} className="text-sage-deep" aria-hidden />
                {current.location.name}
              </p>
            ) : null}
            <div className="mt-4">
              <NavigateButton item={current} />
            </div>
          </>
        ) : (
          <p className="mt-3 font-display text-2xl text-ink">
            {next ? t.live.betweenEvents : t.live.allDone}
          </p>
        )}
      </GlassCard>

      {next ? (
        <GlassCard className="p-5" {...entrance(0.08)}>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
            {t.live.next} · {t.live.in} {formatDuration(state.msToNext, lang)}
          </p>
          <h3 className="mt-2 font-display text-2xl text-ink">{lt(next.title)}</h3>
          <p className="tnum mt-0.5 text-sm text-gold-ink">
            {next.start}
            {next.location.name ? <span className="text-ink-soft"> · {next.location.name}</span> : null}
          </p>
          <div className="mt-3">
            <NavigateButton item={next} />
          </div>
        </GlassCard>
      ) : null}

      {state.past.length ? (
        <ul className="mt-1 flex list-none flex-col gap-1.5 px-1">
          {state.past.map((p) => (
            <li key={p.id} className="tnum flex items-center gap-2 text-sm text-ink-soft/70">
              <span className="text-sage-deep">✓</span> {p.start} {lt(p.title)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
