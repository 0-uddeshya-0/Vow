import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ANIM_OFF } from "../../animations/motionSafe";
import { countdownTo } from "../../lib/datetime";
import { useI18n } from "../../i18n";

/** One rolling digit — free odometer pattern (Motion's AnimateNumber is paid). */
function Digit({ value }: { value: string }) {
  const reduce = useReducedMotion() || ANIM_OFF;
  if (reduce) return <span className="inline-block w-[1ch]">{value}</span>;
  return (
    <span className="relative inline-block h-[1.15em] w-[1ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ n, label }: { n: number; label: string }) {
  const s = String(n).padStart(2, "0");
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border border-hairline-soft bg-surface/25 px-1 py-3 sm:py-4">
      {/* clamp() sizes to the viewport so four tiles always fit — never wraps,
          never overflows, from the narrowest phone to desktop. */}
      <div
        className="tnum font-display leading-none text-ink"
        style={{ fontSize: "clamp(1.35rem, 6.5vw, 2.75rem)" }}
        aria-hidden="true"
      >
        <Digit value={s[0]} />
        <Digit value={s[1]} />
      </div>
      <span className="text-[0.6rem] uppercase leading-none tracking-[0.08em] text-ink-soft sm:text-[0.68rem] sm:tracking-[0.14em]">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetMs }: { targetMs: number }) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const c = useMemo(() => countdownTo(targetMs, now), [targetMs, now]);
  const sr = `${c.days} ${t.landing.days}, ${c.hours} ${t.landing.hours}, ${c.minutes} ${t.landing.minutes}`;

  return (
    <div role="timer" aria-label={`${sr} ${t.landing.until}`}>
      {/* grid-cols-4: equal fractions that shrink together, so it is impossible
          to overflow or drop a unit to a new line on any device. */}
      <div className="mx-auto grid max-w-sm grid-cols-4 gap-2 sm:gap-3" aria-hidden="true">
        <Unit n={c.days} label={t.landing.days} />
        <Unit n={c.hours} label={t.landing.hours} />
        <Unit n={c.minutes} label={t.landing.minutes} />
        <Unit n={c.seconds} label={t.landing.seconds} />
      </div>
      <p className="mt-3 text-center text-sm tracking-wide text-ink-soft">{t.landing.until}</p>
    </div>
  );
}
