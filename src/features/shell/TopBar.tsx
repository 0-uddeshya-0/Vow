import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../../i18n";

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

const pill =
  "inline-flex min-h-10 min-w-11 items-center justify-center rounded-full px-3 text-sm " +
  "tracking-wide text-ink-soft transition-colors hover:text-gold-ink cursor-pointer";

/**
 * Top chrome, decluttered by decision: fixed logo top-left, and ONLY the
 * language + theme toggles in their own glass pill top-right. Page navigation
 * lives in the floating bottom dock (FloatingDock) — phone-native reach.
 */
export function TopBar() {
  const { lang, t, setLang } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">(currentTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#141A11" : "#F7F3EA");
    try {
      localStorage.setItem("vow.theme", theme);
    } catch {
      /* ok */
    }
  }, [theme]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(0.7rem,env(safe-area-inset-top))]">
      <Link
        to="/"
        aria-label="Vow — home"
        className="script glass pointer-events-auto flex min-h-11 items-center rounded-full px-4 text-2xl leading-none"
      >
        Vow
      </Link>

      <div className="glass pointer-events-auto flex items-center gap-0.5 rounded-full p-1">
        <button
          className={pill}
          aria-label={t.a11y.langSwitch}
          onClick={() => setLang(lang === "en" ? "de" : "en")}
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
        <span aria-hidden className="h-4 w-px bg-hairline-soft" />
        <button
          className={pill}
          aria-label={theme === "dark" ? t.a11y.themeToLight : t.a11y.themeToDark}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
        </button>
      </div>
    </header>
  );
}
