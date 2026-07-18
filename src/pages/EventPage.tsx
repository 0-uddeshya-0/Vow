import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useEvent, useGuest, useSchedule } from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { ScheduleSection } from "../features/schedule/ScheduleSection";
import { Section, DemoRibbon } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/Skeleton";

export default function EventPage() {
  const { t } = useI18n();
  const { data: event, isLoading: eventLoading } = useEvent();
  const { session, signOut } = useGuestSession();
  const guestQuery = useGuest(event?.id, session?.guestId);
  const scheduleQuery = useSchedule(event?.id);

  if (eventLoading || !event) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32">
        <CardSkeleton />
      </div>
    );
  }

  const guest = guestQuery.data ?? null;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-28">
      {event.placeholder ? <DemoRibbon text={t.common.demoRibbon} /> : null}

      {!session ? (
        <div className="mt-10">
          <IdentifyCard eventId={event.id} />
        </div>
      ) : (
        <>
          {guest ? (
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-2xl text-ink">
                {t.identify.welcome}, <span className="text-gold-ink">{guest.fullName}</span>
              </p>
              <button
                onClick={signOut}
                className="cursor-pointer text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-gold-ink"
              >
                {t.identify.switch}
              </button>
            </div>
          ) : null}

          <Section id="schedule" title={t.schedule.title} lead={t.schedule.lead}>
            <ScheduleSection
              items={scheduleQuery.data}
              guest={guest}
              loading={scheduleQuery.isLoading || guestQuery.isLoading}
            />
          </Section>

          <div className="mt-4 flex justify-center">
            <Link to="/rsvp">
              <Button variant="gold">
                {t.nav.rsvp} <ArrowRight size={15} aria-hidden />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
