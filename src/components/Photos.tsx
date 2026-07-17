import { useI18n } from "../i18n";

/**
 * Post-event photo sharing. Stub on purpose: browser upload → Supabase
 * Storage (presigned), moderation queue, then scheduled sync to the couple's
 * OneDrive. See supabase/schema.sql and README "What's stubbed".
 */
export function Photos() {
  const { t } = useI18n();
  return (
    <section className="section section--tight" id="photos" aria-labelledby="photos-title">
      <div className="col">
        <div className="photos-panel glass">
          <h2 id="photos-title">{t.photos.title}</h2>
          <p className="lead">{t.photos.lead}</p>
          <p className="smallcaps photos-soon">{t.photos.soon}</p>
        </div>
      </div>
    </section>
  );
}
