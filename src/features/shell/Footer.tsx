import { useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import { useEvent, useSettings } from "../../hooks/queries";

/**
 * Footer sits above the floating dock, so its bottom padding must clear it.
 * Hidden on /admin (which has no dock and its own chrome). Footer text is
 * CMS-editable via settings.footerText, with a sensible fallback.
 */
export function Footer() {
  const { lt } = useI18n();
  const { pathname } = useLocation();
  const { data: event } = useEvent();
  const settings = useSettings(event?.id).data;

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-12 px-6 pb-[var(--dock-space)] pt-8 text-center">
      <div className="divider-gold mx-auto max-w-xs">
        <span
          aria-hidden
          className="size-1.5 rotate-45 border border-gold"
          style={{ flex: "none" }}
        />
      </div>
      {event ? (
        <p className="script mt-5 text-2xl" aria-hidden="true">
          {event.coupleNames}
        </p>
      ) : null}
      <p className="mt-1.5 text-sm text-ink-soft">
        {lt(
          settings?.footerText ?? {
            en: "Made with love, for one day worth remembering.",
            de: "Mit Liebe gemacht, für einen unvergesslichen Tag.",
          },
        )}
      </p>
    </footer>
  );
}
