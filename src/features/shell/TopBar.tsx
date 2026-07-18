import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../../i18n";

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

const pill =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border " +
  "border-hairline-soft px-3 text-sm tracking-wide text-ink-soft transition-colors " +
  "hover:border-hairline hover:text-gold-ink cursor-pointer";

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
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
      <div className="glass flex w-full max-w-3xl items-center justify-between rounded-full py-1.5 pl-4 pr-1.5">
        <Link to="/" className="script text-xl leading-none" aria-label="Vow — home">
          Vow
        </Link>
        <nav className="flex items-center gap-1.5" aria-label="Main">
          <NavLink
            to="/event"
            className={({ isActive }) => `${pill} ${isActive ? "border-hairline text-gold-ink" : ""}`}
          >
            {t.nav.event}
          </NavLink>
          <NavLink
            to="/rsvp"
            className={({ isActive }) => `${pill} ${isActive ? "border-hairline text-gold-ink" : ""}`}
          >
            {t.nav.rsvp}
          </NavLink>
          <button
            className={pill}
            aria-label={t.a11y.langSwitch}
            onClick={() => setLang(lang === "en" ? "de" : "en")}
          >
            {lang === "en" ? "DE" : "EN"}
          </button>
          <button
            className={pill}
            aria-label={theme === "dark" ? t.a11y.themeToLight : t.a11y.themeToDark}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
          </button>
        </nav>
      </div>
    </header>
  );
}
