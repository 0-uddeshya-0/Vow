import { motion } from "motion/react";
import { BedDouble, Car, Footprints, Globe, Phone, Star } from "lucide-react";
import { useI18n } from "../../i18n";
import { fadeUp, reveal } from "../../animations/variants";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { MapsButton } from "../../components/ui/MapsButton";
import type { Hotel } from "../../types";

const linkCls =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-3.5 " +
  "text-sm text-ink-soft transition-colors hover:border-hairline hover:text-gold-ink";

function HotelCard({ hotel }: { hotel: Hotel }) {
  const { t, lt } = useI18n();

  return (
    <motion.li variants={fadeUp} className="glass overflow-hidden rounded-[var(--radius-card)]">
      {hotel.images[0] ? (
        <img
          src={hotel.images[0]}
          alt=""
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      ) : null}

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-display text-2xl text-ink">{hotel.name}</h3>
          {hotel.recommended ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-gold-ink">
              <Star size={11} aria-hidden /> {t.stay.recommended}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 max-w-[52ch] text-ink-soft">{lt(hotel.description)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="tnum text-gold-ink">{hotel.priceCategory}</span>
          {hotel.walkingMinutes != null ? (
            <span className="tnum inline-flex items-center gap-1.5">
              <Footprints size={14} aria-hidden /> {hotel.walkingMinutes} {t.stay.min}
            </span>
          ) : null}
          {hotel.drivingMinutes != null ? (
            <span className="tnum inline-flex items-center gap-1.5">
              <Car size={14} aria-hidden /> {hotel.drivingMinutes} {t.stay.min}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.phone ? (
            <a className={linkCls} href={`tel:${hotel.phone}`}>
              <Phone size={13} aria-hidden /> {t.stay.call}
            </a>
          ) : null}
          {hotel.bookingUrl ? (
            <a className={linkCls} href={hotel.bookingUrl} target="_blank" rel="noreferrer noopener">
              <BedDouble size={13} aria-hidden /> {t.stay.book}
            </a>
          ) : null}
          {hotel.websiteUrl ? (
            <a className={linkCls} href={hotel.websiteUrl} target="_blank" rel="noreferrer noopener">
              <Globe size={13} aria-hidden /> {t.stay.website}
            </a>
          ) : null}
          {hotel.location.name || hotel.location.address ? (
            <MapsButton location={hotel.location} />
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}

export function HotelsSection({ hotels, loading }: { hotels: Hotel[] | undefined; loading: boolean }) {
  if (loading || !hotels) return <CardSkeleton />;
  if (hotels.length === 0) return null;
  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-col gap-4 p-0">
      {hotels.map((h) => (
        <HotelCard key={h.id} hotel={h} />
      ))}
    </motion.ul>
  );
}
