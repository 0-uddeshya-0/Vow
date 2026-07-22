import { useI18n } from "../i18n";
import {
  useEmbeds,
  useEvent,
  useFaq,
  useGifts,
  useGuest,
  useMessages,
  usePromos,
  useSettings,
} from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { GuestHeader } from "../features/guest/GuestHeader";
import { MessagesSection } from "../features/messages/MessagesSection";
import { GiftsSection } from "../features/gifts/GiftsSection";
import { PromosSection } from "../features/promos/PromosSection";
import { EmbedsSection } from "../features/embeds/EmbedsSection";
import {
  ContactSection,
  EmergencySection,
  FaqSection,
} from "../features/info/InfoSections";
import { Section, DemoRibbon } from "../components/ui/Section";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useSectionLabels } from "../hooks/useSectionLabels";

/**
 * Login-gated "everything else" tab — split off the Event page so that page can
 * stay focused on the day itself. Sections still render only when they have
 * content, so this page is never a wall of empty headers.
 */
export default function InfoPage() {
  const { t } = useI18n();
  const { data: event, isLoading } = useEvent();
  const { session, signOut } = useGuestSession();
  const guestQuery = useGuest(event?.id, session?.guestId);
  const messagesQuery = useMessages(event?.id);
  const settingsQuery = useSettings(event?.id);
  const faqQuery = useFaq(event?.id);
  const giftsQuery = useGifts(event?.id);
  const promosQuery = usePromos(event?.id);
  const embedsQuery = useEmbeds(event?.id);

  if (isLoading || !event) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32">
        <CardSkeleton />
      </div>
    );
  }

  const guest = guestQuery.data ?? null;
  const label = useSectionLabels(settingsQuery.data);

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
        <div className="flex flex-col gap-10">
          {guest ? <GuestHeader guest={guest} onSwitch={signOut} /> : null}

          <MessagesSection
            messages={messagesQuery.data}
            guest={guest}
            loading={messagesQuery.isLoading}
          />

          {faqQuery.data?.length ? (
            <Section id="faq" {...label("faq", t.faq.title)}>
              <FaqSection items={faqQuery.data} />
            </Section>
          ) : null}

          {promosQuery.data?.length ? (
            <Section id="recommendations" {...label("recommendations", t.recommendations.title, t.recommendations.lead)}>
              <PromosSection promos={promosQuery.data} loading={promosQuery.isLoading} />
            </Section>
          ) : null}

          {giftsQuery.data?.length ? (
            <Section id="gifts" {...label("gifts", t.gifts.title, t.gifts.lead)}>
              <GiftsSection gifts={giftsQuery.data} loading={giftsQuery.isLoading} />
            </Section>
          ) : null}

          <EmbedsSection embeds={embedsQuery.data} />

          {settingsQuery.data?.contact.length ? (
            <Section id="contact" {...label("contact", t.contact.title, t.contact.lead)}>
              <ContactSection settings={settingsQuery.data} />
            </Section>
          ) : null}

          {settingsQuery.data?.emergency.length ? (
            <Section id="emergency" {...label("emergency", t.emergency.title, t.emergency.lead)}>
              <EmergencySection settings={settingsQuery.data} />
            </Section>
          ) : null}
        </div>
      )}
    </div>
  );
}
