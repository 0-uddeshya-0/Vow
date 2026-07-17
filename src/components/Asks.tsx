import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n";
import type { RuntimeContent } from "../config/wedding";
import { riseIn } from "../motion/motion";

export function Asks({ runtime }: { runtime: RuntimeContent }) {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (root.current) riseIn(root.current.querySelectorAll(".ask"), root.current);
  }, []);

  return (
    <section ref={root} className="section" id="asks" aria-labelledby="asks-title">
      <div className="col">
        <h2 id="asks-title">{t.asks.title}</h2>
        <ul className="asks" role="list">
          {t.asks.items.map((item) => (
            <li key={item.title} className="ask">
              <h3 className="ask-title">{item.title}</h3>
              <p className="ask-desc">{item.desc}</p>
            </li>
          ))}
        </ul>
        <p className="emergency">
          {t.asks.emergency}{" "}
          {runtime.emergencyPhone ? (
            <a className="tnum" href={`tel:${runtime.emergencyPhone}`}>
              {runtime.emergencyPhone}
            </a>
          ) : (
            <em>{t.asks.emergencyPending}</em>
          )}
        </p>
      </div>
    </section>
  );
}
