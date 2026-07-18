import { motion } from "motion/react";
import { CircleParking, MapPin, Navigation, StickyNote } from "lucide-react";
import { useI18n } from "../../i18n";
import { mapLinks } from "../../lib/maps";
import { ScheduleIcon } from "../../lib/icons";
import { visibleTo, type Guest, type Location, type ScheduleItem } from "../../types";
import { fadeUp, reveal } from "../../animations/variants";
import { CardSkeleton } from "../../components/ui/Skeleton";

function MapButtons({ location }: { location: Location }) {
  const { t } = useI18n();
  const links = mapLinks(location);
  if (!links) return null;
  const cls =
    "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft " +
    "px-3.5 text-sm text-ink-soft transition-colors hover:border-hairline hover:text-gold-ink";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a className={cls} href={links.google} target="_blank" rel="noreferrer noopener">
        <Navigation size={13} aria-hidden /> {t.schedule.google}
      </a>
      <a className={cls} href={links.apple} target="_blank" rel="noreferrer noopener">
        {t.schedule.apple}
      </a>
      <a className={cls} href={links.osm} target="_blank" rel="noreferrer noopener">
        {t.schedule.osm}
      </a>
    </div>
  );
}

function MomentCard({ item, personal }: { item: ScheduleItem; personal: boolean }) {
  const { t, lt } = useI18n();
  return (
    <motion.li variants={fadeUp} className="glass overflow-hidden rounded-[var(--radius-card)]">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" loading="lazy" className="h-44 w-full object-cover" />
      ) : null}

      <div className="p-6">
        {/* Header mirrors the weather card: text left, one large icon right. */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="tnum font-display text-xl text-gold-ink">
                {item.start}
                {item.end ? <span className="text-ink-soft"> – {item.end}</span> : null}
              </span>
              {personal ? (
                <span className="rounded-full border border-hairline bg-surface/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.14em] text-gold-ink">
                  {t.schedule.onlyForYou}
                </span>
              ) : null}
            </div>
            <h3 className="mt-1.5 font-display text-2xl text-ink">{lt(item.title)}</h3>
          </div>
          <span className="shrink-0 text-gold-ink">
            <ScheduleIcon name={item.icon} size={38} />
          </span>
        </div>

        <p className="mt-2 max-w-[52ch] text-ink-soft">{lt(item.description)}</p>

        {item.location.name ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink">
            <MapPin size={14} className="text-sage-deep" aria-hidden />
            {item.location.name}
            {item.location.address ? (
              <span className="text-ink-soft"> · {item.location.address}</span>
            ) : null}
          </p>
        ) : null}

        {item.notes ? (
          <p className="mt-2 inline-flex items-start gap-1.5 text-sm text-ink-soft">
            <StickyNote size={14} className="mt-0.5 shrink-0" aria-hidden />
            {lt(item.notes)}
          </p>
        ) : null}

        <MapButtons location={item.location} />

        {item.parkingNote || item.parkingLocation?.name ? (
          <div className="mt-4 rounded-2xl border border-hairline-soft bg-surface/40 p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              <CircleParking size={15} className="text-gold-ink" aria-hidden />
              {t.schedule.parking}
              {item.parkingLocation?.name ? (
                <span className="text-ink-soft">· {item.parkingLocation.name}</span>
              ) : null}
            </p>
            {item.parkingNote ? (
              <p className="mt-1 max-w-[50ch] text-sm text-ink-soft">{lt(item.parkingNote)}</p>
            ) : null}
            {item.parkingLocation ? <MapButtons location={item.parkingLocation} /> : null}
          </div>
        ) : null}
      </div>
    </motion.li>
  );
}

export function ScheduleSection({
  items,
  guest,
  loading,
}: {
  items: ScheduleItem[] | undefined;
  guest: Guest | null;
  loading: boolean;
}) {
  if (loading || !items) {
    return (
      <div className="flex flex-col gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const visible = items.filter((i) => visibleTo(i.visibility, guest));
  const restricted = (i: ScheduleItem) =>
    i.visibility.allowedGuests.length > 0 || i.visibility.allowedRoles.length > 0;

  return (
    <motion.ol {...reveal(0.15)} className="flex list-none flex-col gap-4 p-0">
      {visible.map((item) => (
        <MomentCard key={item.id} item={item} personal={restricted(item)} />
      ))}
    </motion.ol>
  );
}
