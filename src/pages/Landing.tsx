import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useEvent, useGuest, useSchedule } from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { Countdown } from "../features/countdown/Countdown";
import { LiveEventMode } from "../features/live/LiveEventMode";
import { CharacterStage } from "../features/character/CharacterStage";
import { GlassCard } from "../components/ui/GlassCard";
import { DemoRibbon } from "../components/ui/Section";
import { Skeleton } from "../components/ui/Skeleton";
import { entrance } from "../animations/variants";
import { eventStartMs, formatEventDate, isEventDay } from "../lib/datetime";

function HeroSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl px-5" aria-busy="true">
      <div className="glass rounded-[var(--radius-panel)] p-10 text-center">
        <Skeleton className="mx-auto size-36 rounded-full" />
        <Skeleton className="mx-auto mt-8 h-5 w-40" />
        <Skeleton className="mx-auto mt-4 h-12 w-72" />
        <Skeleton className="mx-auto mt-4 h-5 w-56" />
        <Skeleton className="mx-auto mt-8 h-16 w-80" />
        <Skeleton className="mx-auto mt-8 h-12 w-44 rounded-full" />
      </div>
    </div>
  );
}

export default function Landing() {
  const { t, lt, lang } = useI18n();
  const { data: event, isLoading } = useEvent();
  const { session } = useGuestSession();
  const guest = useGuest(event?.id, session?.guestId).data ?? null;
  const schedule = useSchedule(event?.id).data;
  const live = !!event && isEventDay(event);

  return (
    // min-h-dvh minus the fixed chrome, so centring never hides content behind
    // the dock on short phone viewports.
    <div className="wash-garden flex min-h-svh flex-col justify-center px-4 pb-[var(--dock-space)] pt-24 sm:pt-28">
      {isLoading || !event ? (
        <HeroSkeleton />
      ) : (
        <div className="mx-auto w-full max-w-xl">
          {event.placeholder ? (
            <div className="mb-4">
              <DemoRibbon text={t.common.demoRibbon} />
            </div>
          ) : null}

          <GlassCard strong className="px-6 py-10 text-center sm:px-10" {...entrance()}>
            <CharacterStage
              illustrationUrl={event.heroIllustrationUrl}
              coupleNames={event.coupleNames}
            />

            {event.mark ? (
              <motion.p {...entrance(0.1)} className="script mt-7 text-3xl sm:text-4xl">
                {event.mark}
              </motion.p>
            ) : null}

            <motion.h1
              {...entrance(0.18)}
              className="mt-2 font-display text-5xl leading-[1.02] text-ink sm:text-6xl"
            >
              {event.coupleNames}
            </motion.h1>

            <motion.p {...entrance(0.26)} className="tnum mt-3 font-display text-xl text-sage-deep">
              {formatEventDate(event, lang)}
            </motion.p>

            <motion.p {...entrance(0.34)} className="mx-auto mt-4 max-w-[38ch] text-ink-soft">
              {lt(event.welcome)}
            </motion.p>

            <motion.div {...entrance(0.42)} className="mt-8">
              {live ? (
                <p className="font-display text-2xl text-gold-ink">{t.landing.eventDayTitle}</p>
              ) : (
                <Countdown targetMs={eventStartMs(event)} />
              )}
            </motion.div>

            <motion.div {...entrance(0.5)} className="mt-9">
              <Link
                to="/event"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--btn-primary)] px-7 py-3 font-medium tracking-wide text-on-accent shadow-[0_10px_24px_-10px_var(--btn-primary)] transition-transform hover:-translate-y-0.5"
              >
                {t.landing.viewEvent} <ArrowRight size={16} aria-hidden />
              </Link>
            </motion.div>
          </GlassCard>

          {live && schedule ? (
            <div className="mt-5">
              <LiveEventMode event={event} items={schedule} guest={guest} />
            </div>
          ) : (
            <motion.p {...entrance(0.6)} className="mt-6 text-center text-sm text-ink-soft">
              {lt(event.intro)}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
