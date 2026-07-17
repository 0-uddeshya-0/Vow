import { useI18n } from "../i18n";

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="section section--tight" id="faq" aria-labelledby="faq-title">
      <div className="col">
        <h2 id="faq-title">{t.faq.title}</h2>
        <div className="faq">
          {t.faq.items.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
