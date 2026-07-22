import { useI18n } from "../i18n";
import type { Settings } from "../types";

/**
 * Resolve a section's heading + tagline: an admin override from
 * settings.labels when present (and non-empty), otherwise the built-in
 * translation. Returns props ready to spread onto <Section>.
 */
export function useSectionLabels(settings: Settings | null | undefined) {
  const { lt } = useI18n();
  return (id: string, defTitle: string, defLead = ""): { title: string; lead: string } => {
    const o = settings?.labels?.find((l) => l.id === id);
    const title = o && (o.title.en.trim() || o.title.de.trim()) ? lt(o.title) : defTitle;
    const lead = o && (o.lead.en.trim() || o.lead.de.trim()) ? lt(o.lead) : defLead;
    return { title, lead };
  };
}

/** The sections the admin can rename, with their default i18n keys. */
export const EDITABLE_SECTIONS = [
  "schedule",
  "weather",
  "stay",
  "parking",
  "faq",
  "recommendations",
  "gifts",
  "contact",
  "emergency",
  "gallery",
  "photos",
] as const;
