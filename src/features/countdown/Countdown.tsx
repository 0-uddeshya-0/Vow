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
    <div className="flex flex-col items-center gap-1">
      <div className="tnum font-display text-4xl sm:text-5xl text-ink" aria-hidden="true">
        <Digit value={s[0]} />
        <Digit value={s[1]} />
      </div>
      <span className="text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</span>
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
      <div className="flex items-start justify-center gap-5 sm:gap-8" aria-hidden="true">
        <Unit n={c.days} label={t.landing.days} />
        <span className="pt-1 font-display text-3xl text-gold-ink">·</span>
        <Unit n={c.hours} label={t.landing.hours} />
        <span className="pt-1 font-display text-3xl text-gold-ink">·</span>
        <Unit n={c.minutes} label={t.landing.minutes} />
        <span className="pt-1 font-display text-3xl text-gold-ink">·</span>
        <Unit n={c.seconds} label={t.landing.seconds} />
      </div>
      <p className="mt-2 text-center text-sm tracking-wide text-ink-soft">{t.landing.until}</p>
    </div>
  );
}
