import { useI18n } from "../../i18n";
import { useEvent } from "../../hooks/queries";

export function Footer() {
  const { lt } = useI18n();
  const { data: event } = useEvent();
  return (
    <footer className="mt-16 border-t border-hairline-soft px-6 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-center">
      {event ? (
        <p className="script text-2xl" aria-hidden="true">
          {event.coupleNames}
        </p>
      ) : null}
      <p className="mt-2 text-sm text-ink-soft">
        {lt({
          en: "Made with love, for one day worth remembering.",
          de: "Mit Liebe gemacht, für einen unvergesslichen Tag.",
        })}
      </p>
    </footer>
  );
}
