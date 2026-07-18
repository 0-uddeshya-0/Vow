import { useEffect } from "react";
import { useEvent } from "../../hooks/queries";

/**
 * Applies the event's CMS colour overrides as CSS custom properties, so a new
 * event can be rebranded without touching code. Blank values fall through to
 * the design system in app.css.
 */
export function ThemeVars() {
  const { data: event } = useEvent();

  useEffect(() => {
    if (!event) return;
    const root = document.documentElement;
    const t = event.theme;
    const apply = (name: string, value: string) => {
      if (value.trim()) root.style.setProperty(name, value.trim());
      else root.style.removeProperty(name);
    };
    apply("--sage", t.sage);
    apply("--gold", t.gold);
    // Background depends on which theme is active, so only set the matching one.
    const dark = root.dataset.theme === "dark";
    apply("--bg", dark ? t.bgDark : t.bgLight);
  }, [event]);

  // First visit only: honour the event's default mode before the user chooses.
  useEffect(() => {
    if (!event) return;
    try {
      if (!localStorage.getItem("vow.theme")) {
        document.documentElement.dataset.theme = event.theme.defaultMode;
      }
    } catch {
      /* private mode */
    }
  }, [event]);

  return null;
}
