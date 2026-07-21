import { motion } from "motion/react";
import { CircleParking, LifeBuoy, Mail, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "../../i18n";
import { mapLinks } from "../../lib/maps";
import { fadeUp, reveal } from "../../animations/variants";
import type { FaqItem, Settings } from "../../types";

const linkCls =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-3.5 " +
  "text-sm text-ink-soft transition-colors hover:border-hairline hover:text-gold-ink";

export function ContactSection({ settings }: { settings: Settings | null | undefined }) {
  const { t } = useI18n();
  if (!settings?.contact.length) return null;
  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-col gap-3 p-0">
      {settings.contact.map((c) => (
        <motion.li
          key={`${c.label}-${c.name}`}
          variants={fadeUp}
          className="glass flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] p-5"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{c.label}</p>
            <p className="font-display text-xl text-ink">{c.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {c.phone ? (
              <>
                <a className={linkCls} href={`tel:${c.phone}`}>
                  <Phone size={13} aria-hidden /> {t.contact.call}
                </a>
                <a
                  className={linkCls}
                  href={`https://wa.me/${c.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle size={13} aria-hidden /> WhatsApp
                </a>
              </>
            ) : null}
            {c.email ? (
              <a className={linkCls} href={`mailto:${c.email}`}>
                <Mail size={13} aria-hidden /> {t.contact.email}
              </a>
            ) : null}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** True when a general parking area has actually been filled in. */
export function hasParking(settings: Settings | null | undefined): boolean {
  const p = settings?.parking;
  return !!p && !!(p.text.en.trim() || p.text.de.trim() || p.location.name.trim());
}

export function ParkingSection({ settings }: { settings: Settings | null | undefined }) {
  const { t, lt } = useI18n();
  const parking = settings?.parking;
  // Big weddings often have one shared parking area, so the feature stays —
  // but an empty block must never appear on the guest page.
  if (!parking || !hasParking(settings)) return null;
  const links = mapLinks(parking.location);
  return (
    <motion.div {...reveal(0.15)} className="glass rounded-[var(--radius-card)] p-6">
      <motion.h3 variants={fadeUp} className="inline-flex items-center gap-2 font-display text-xl text-ink">
        <CircleParking size={17} className="text-gold-ink" aria-hidden /> {parking.location.name}
      </motion.h3>
      <motion.p variants={fadeUp} className="mt-2 max-w-[52ch] text-ink-soft">
        {lt(parking.text)}
      </motion.p>
      {links ? (
        <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-2">
          <a className={linkCls} href={links.google} target="_blank" rel="noreferrer noopener">
            {t.schedule.google}
          </a>
          <a className={linkCls} href={links.apple} target="_blank" rel="noreferrer noopener">
            {t.schedule.apple}
          </a>
          <a className={linkCls} href={links.osm} target="_blank" rel="noreferrer noopener">
            {t.schedule.osm}
          </a>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

export function EmergencySection({ settings }: { settings: Settings | null | undefined }) {
  const { lt } = useI18n();
  if (!settings?.emergency.length) return null;
  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-wrap gap-3 p-0">
      {settings.emergency.map((e) => (
        <motion.li key={e.phone} variants={fadeUp}>
          <a
            href={`tel:${e.phone}`}
            className="glass inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-ink"
          >
            <LifeBuoy size={15} className="text-gold-ink" aria-hidden />
            {lt(e.label)}
            <span className="tnum text-ink-soft">{e.phone}</span>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function FaqSection({ items }: { items: FaqItem[] | undefined }) {
  const { lt } = useI18n();
  if (!items?.length) return null;
  return (
    <motion.div {...reveal(0.1)} className="flex flex-col">
      {items.map((f) => (
        <motion.details
          key={f.id}
          variants={fadeUp}
          className="border-b border-hairline-soft first:border-t"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
            {lt(f.question)}
            <span className="text-gold-ink transition-transform">+</span>
          </summary>
          <p className="max-w-[56ch] pb-4 text-ink-soft">{lt(f.answer)}</p>
        </motion.details>
      ))}
    </motion.div>
  );
}
