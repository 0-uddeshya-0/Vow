import { useI18n } from "../i18n";
import { useEvent, useGallery, useGuest } from "../hooks/queries";
import { useGuestSession } from "../features/guest/useGuestSession";
import { IdentifyCard } from "../features/guest/IdentifyCard";
import { GallerySection } from "../features/gallery/GallerySection";
import { PhotoUpload } from "../features/photos/PhotoUpload";
import { Section, DemoRibbon } from "../components/ui/Section";
import { CardSkeleton } from "../components/ui/Skeleton";

/** Gallery + guest photo upload — its own tab by decision (nav declutter). */
export default function GalleryPage() {
  const { t } = useI18n();
  const { data: event, isLoading } = useEvent();
  const { session } = useGuestSession();
  const guest = useGuest(event?.id, session?.guestId).data ?? null;
  const galleryQuery = useGallery(event?.id);

  if (isLoading || !event) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-[var(--dock-space)] pt-24">
      {event.placeholder ? (
        <div className="mb-8">
          <DemoRibbon text={t.common.demoRibbon} />
        </div>
      ) : null}

      {/* The whole gallery — viewing and uploading — is guests-only. */}
      {!guest ? (
        <IdentifyCard eventId={event.id} />
      ) : (
        <div className="flex flex-col gap-10">
          <Section id="gallery" title={t.gallery.title} lead={t.gallery.lead}>
            <GallerySection images={galleryQuery.data} loading={galleryQuery.isLoading} />
          </Section>

          <Section id="photos" title={t.photos.title} lead={t.photos.lead}>
            <PhotoUpload event={event} guest={guest} />
          </Section>
        </div>
      )}
    </div>
  );
}
