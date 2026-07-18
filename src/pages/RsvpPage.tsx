import { useI18n } from "../i18n";
import { useEvent, useGuest } from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { RsvpCard } from "../features/rsvp/RsvpCard";
import { CardSkeleton } from "../components/ui/Skeleton";

export default function RsvpPage() {
  const { t } = useI18n();
  const { data: event, isLoading } = useEvent();
  const { session } = useGuestSession();
  const guestQuery = useGuest(event?.id, session?.guestId);

  return (
    <div className="wash-garden min-h-svh px-5 pb-14 pt-28">
      <div className="mx-auto max-w-xl">
        {isLoading || !event ? (
          <CardSkeleton />
        ) : !session ? (
          <>
            <p className="mb-5 text-center text-ink-soft">{t.rsvp.identifyFirst}</p>
            <IdentifyCard eventId={event.id} />
          </>
        ) : guestQuery.isLoading ? (
          <CardSkeleton />
        ) : guestQuery.data ? (
          <RsvpCard event={event} guest={guestQuery.data} />
        ) : (
          <IdentifyCard eventId={event.id} />
        )}
      </div>
    </div>
  );
}
