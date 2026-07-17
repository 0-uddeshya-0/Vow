import { useEffect, useState } from "react";
import { useI18n } from "../i18n";

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function TopBar() {
  const { lang, t, setLang } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">(() => currentTheme());

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
    <header className="topbar glass">
      <a href="#top" className="monogram script" aria-label="Michael & Dina">
        M&D
      </a>
      <div className="topbar-actions">
        <button
          className="pill"
          aria-label={t.a11y.langSwitch}
          onClick={() => setLang(lang === "en" ? "de" : "en")}
        >
          {lang === "en" ? "DE" : "EN"}
        </button>
        <button
          className="pill"
          aria-label={theme === "dark" ? t.a11y.themeToLight : t.a11y.themeToDark}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            /* sun */
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
              <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" />
              </g>
            </svg>
          ) : (
            /* moon */
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M13.5 9.8A6 6 0 1 1 6.2 2.5a4.8 4.8 0 1 0 7.3 7.3Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <a className="btn btn--primary btn--bar" href="#rsvp">
          {t.topbar.rsvp}
        </a>
      </div>
    </header>
  );
}
