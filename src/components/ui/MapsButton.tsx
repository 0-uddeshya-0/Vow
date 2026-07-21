import { Navigation } from "lucide-react";
import { useI18n } from "../../i18n";
import { mapLinks } from "../../lib/maps";
import type { Location } from "../../types";
import { Popover, popoverItem } from "./Popover";

/**
 * One "Navigate" button that opens a small menu to pick Google / Apple /
 * OpenStreetMap — replacing the previous row of three separate buttons.
 */
export function MapsButton({ location, align = "left" }: { location: Location; align?: "left" | "right" }) {
  const { t } = useI18n();
  const links = mapLinks(location);
  if (!links) return null;

  const link = (href: string, label: string) => (
    <a className={popoverItem} href={href} target="_blank" rel="noreferrer noopener" role="menuitem">
      {label}
    </a>
  );

  return (
    <Popover
      align={align}
      trigger={(open) => (
        <span
          className={
            "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors " +
            (open
              ? "border-hairline text-gold-ink"
              : "border-hairline-soft text-ink-soft hover:border-hairline hover:text-gold-ink")
          }
        >
          <Navigation size={14} aria-hidden /> {t.schedule.navigate}
        </span>
      )}
    >
      {() => (
        <>
          {link(links.google, t.schedule.google)}
          {link(links.apple, t.schedule.apple)}
          {link(links.osm, t.schedule.osm)}
        </>
      )}
    </Popover>
  );
}
