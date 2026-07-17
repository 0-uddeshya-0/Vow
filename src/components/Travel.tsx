import { useI18n } from "../i18n";
import { wedding } from "../config/wedding";

export function Travel() {
  const { t } = useI18n();
  return (
    <section className="section section--tight" id="travel" aria-labelledby="travel-title">
      <div className="col">
        <h2 id="travel-title">{t.travel.title}</h2>
        <p className="lead">{t.travel.lead}</p>
        <div className="travel-row">
          {wedding.taxi.providers.map((p) => (
            <a key={p.name} className="btn btn--quiet tnum" href={`tel:${p.phone}`}>
              {p.name} · {p.phone.replace("+49", "0")}
            </a>
          ))}
          <a
            className="btn btn--quiet"
            href={wedding.taxi.searchUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t.travel.taxiSearch} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
