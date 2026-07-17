import { useI18n } from "../i18n";
import { wedding } from "../config/wedding";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <p className="script footer-monogram" aria-label={t.footer.monogramAria}>
        {wedding.couple.one[0]} &amp; {wedding.couple.two[0]}
      </p>
      <p className="footer-line">{t.footer.line}</p>
      <p className="tnum footer-date">18 · 09 · 2026</p>
    </footer>
  );
}
