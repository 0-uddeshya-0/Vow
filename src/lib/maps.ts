import type { Location } from "../types";

/** Every location supports Google, Apple, and OSM — explicit URLs win, else built from lat/lng or address. */
export function mapLinks(loc: Location): { google: string; apple: string; osm: string } | null {
  const q = loc.lat != null && loc.lng != null ? `${loc.lat},${loc.lng}` : loc.address || loc.name;
  if (!q && !loc.googleMapsUrl && !loc.appleMapsUrl && !loc.osmUrl) return null;
  const enc = encodeURIComponent(q);
  return {
    google: loc.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${enc}`,
    apple: loc.appleMapsUrl || `https://maps.apple.com/?q=${enc}`,
    osm:
      loc.osmUrl ||
      (loc.lat != null && loc.lng != null
        ? `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=17/${loc.lat}/${loc.lng}`
        : `https://www.openstreetmap.org/search?query=${enc}`),
  };
}
