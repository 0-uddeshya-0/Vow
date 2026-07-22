import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n";
import {
  useEvent,
  useForecast,
  useGuest,
  useHotels,
  useSchedule,
  useSettings,
  useWeatherSettings,
} from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { GuestHeader } from "../features/guest/GuestHeader";
import { ScheduleSection } from "../features/schedule/ScheduleSection";
import { HotelsSection } from "../features/hotels/HotelsSection";
import { WeatherCard } from "../features/weather/WeatherCard";
import { RsvpBanner } from "../features/rsvp/RsvpBanner";
import { ParkingSection, hasParking } from "../features/info/InfoSections";
import { AddToCalendar } from "../features/calendar/AddToCalendar";
import { Section, DemoRibbon } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/Skeleton";
import { withinDaysBefore } from "../lib/datetime";

/**
 * The day itself: schedule, weather, where to stay, parking, and the RSVP
 * nudge. Everything else (messages, FAQ, gifts, recommendations, embeds,
 * contact) lives on the Info tab so this page stays focused.
 */
export default function EventPage() {
  const { t } = useI18n();
  const { data: event, isLoading: eventLoading } = useEvent();
  const { session, signOut } = useGuestSession();
  const guestQuery = useGuest(event?.id, session?.guestId);
  const scheduleQuery = useSchedule(event?.id);
  const hotelsQuery = useHotels(event?.id);
  const settingsQuery = useSettings(event?.id);
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
      {event.placeholder ? (
        <div className="mb-8">
          <DemoRibbon text={t.common.demoRibbon} />
        </div>
      ) : null}

      {!session ? (
        <IdentifyCard eventId={event.id} />
      ) : (
        // One uniform vertical rhythm for every block on the page.
        <div className="flex flex-col gap-10">
          {guest ? <GuestHeader guest={guest} onSwitch={signOut} /> : null}

          {guest ? <RsvpBanner event={event} guest={guest} /> : null}

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

          {hasParking(settingsQuery.data) ? (
            <Section id="parking" title={t.parking.title} lead={t.parking.lead}>
              <ParkingSection settings={settingsQuery.data} />
            </Section>
          ) : null}

          <div className="flex justify-center">
            <Link to="/rsvp">
              <Button variant="gold">
                {t.nav.rsvp} <ArrowRight size={15} aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
