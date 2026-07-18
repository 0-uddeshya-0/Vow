import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n";
import {
  useEvent,
  useFaq,
  useForecast,
  useGuest,
  useHotels,
  useMessages,
  useSchedule,
  useSettings,
  useWeatherSettings,
} from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { ScheduleSection } from "../features/schedule/ScheduleSection";
import { HotelsSection } from "../features/hotels/HotelsSection";
import { WeatherCard } from "../features/weather/WeatherCard";
import { MessagesSection } from "../features/messages/MessagesSection";
import {
  ContactSection,
  EmergencySection,
  FaqSection,
  ParkingSection,
} from "../features/info/InfoSections";
import { AddToCalendar } from "../features/calendar/AddToCalendar";
import { Section, DemoRibbon } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/Skeleton";
import { withinDaysBefore } from "../lib/datetime";

export default function EventPage() {
  const { t } = useI18n();
  const { data: event, isLoading: eventLoading } = useEvent();
  const { session, signOut } = useGuestSession();
  const guestQuery = useGuest(event?.id, session?.guestId);
  const scheduleQuery = useSchedule(event?.id);
  const hotelsQuery = useHotels(event?.id);
  const messagesQuery = useMessages(event?.id);
  const settingsQuery = useSettings(event?.id);
  const faqQuery = useFaq(event?.id);
  const weatherSettings = useWeatherSettings(event?.id).data;

  // Forecast only inside the CMS-configured window (default: final week).
  const weatherWindow =
    !!event &&
    !!weatherSettings?.enabled &&
    withinDaysBefore(event.date, event.timezone, weatherSettings.daysBefore);
  const forecast = useForecast(
    weatherWindow,
    weatherSettings?.lat,
    weatherSettings?.lng,
    event?.timezone,
    event?.date,
  );

  if (eventLoading || !event) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32">
        <CardSkeleton />
      </div>
    );
  }

  const guest = guestQuery.data ?? null;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-[var(--dock-space)] pt-24">
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

          <MessagesSection
            messages={messagesQuery.data}
            guest={guest}
            loading={messagesQuery.isLoading}
          />

          <Section id="schedule" title={t.schedule.title} lead={t.schedule.lead}>
            <ScheduleSection
              items={scheduleQuery.data}
              guest={guest}
              loading={scheduleQuery.isLoading || guestQuery.isLoading}
            />
            <div className="mt-5">
              <AddToCalendar event={event} schedule={scheduleQuery.data} />
            </div>
          </Section>

          {weatherWindow ? (
            <Section id="weather" title={t.weather.title} lead={t.weather.lead}>
              <WeatherCard
                forecast={forecast.data}
                loading={forecast.isLoading}
                failed={forecast.isError}
              />
            </Section>
          ) : null}

          <Section id="stay" title={t.stay.title} lead={t.stay.lead}>
            <HotelsSection hotels={hotelsQuery.data} loading={hotelsQuery.isLoading} />
          </Section>

          <Section id="parking" title={t.parking.title} lead={t.parking.lead}>
            <ParkingSection settings={settingsQuery.data} />
          </Section>

          <Section id="contact" title={t.contact.title} lead={t.contact.lead}>
            <ContactSection settings={settingsQuery.data} />
          </Section>

          <Section id="emergency" title={t.emergency.title} lead={t.emergency.lead}>
            <EmergencySection settings={settingsQuery.data} />
          </Section>

          <Section id="faq" title={t.faq.title}>
            <FaqSection items={faqQuery.data} />
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
