import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { LocalizedText } from "../types";
import { en, type Dict } from "./en";
import { de } from "./de";

export type Lang = "en" | "de";
const dicts: Record<Lang, Dict> = { en, de };

type I18n = {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  /** localized event content (data-driven text) */
  lt: (text: LocalizedText | null | undefined) => string;
};

const Ctx = createContext<I18n | null>(null);

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem("vow.lang");
    if (stored === "de" || stored === "en") return stored;
  } catch {
    /* private mode */
  }
  // No stored choice yet → follow the device/OS language (German or English).
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("de")) {
    return "de";
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem("vow.lang", l);
    } catch {
      /* ok */
    }
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      t: dicts[lang],
      setLang,
      lt: (text) => (text ? text[lang] || text.en : ""),
    }),
    [lang, setLang],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
