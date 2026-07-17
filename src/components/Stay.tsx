import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { wedding, type RuntimeContent } from "../config/wedding";
import { riseIn } from "../motion/motion";

export function Stay({ runtime }: { runtime: RuntimeContent }) {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (root.current) riseIn(root.current.querySelectorAll(".hotel"), root.current);
  }, []);

  return (
    <section ref={root} className="section" id="stay" aria-labelledby="stay-title">
      <div className="col">
        <h2 id="stay-title">{t.stay.title}</h2>
        <p className="lead">{t.stay.lead}</p>

        <p className="booking-code">
          <span className="smallcaps">{t.stay.bookingCodeLabel}</span>
          <span className="booking-code-value script">
            {runtime.bookingCode ?? t.stay.bookingCodePending}
          </span>
        </p>

        <ul className="hotels" role="list">
          {wedding.hotels.map((h) => (
            <li key={h.id} className="hotel">
              <span className="hotel-name">{h.name}</span>
              {h.phone ? (
                <a className="hotel-link tnum" href={`tel:${h.phone}`}>
                  {h.phone}
                </a>
              ) : (
                <a className="hotel-link" href={h.url} target="_blank" rel="noreferrer noopener">
                  {t.stay.visit} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
