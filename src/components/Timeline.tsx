import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { wedding } from "../config/wedding";
import { gsap, motionOK, register, riseIn } from "../motion/motion";

/** Reserved mount for the future animated Michael & Dina character layer. */
function SceneMount({ scene }: { scene: string }) {
  if (!import.meta.env.DEV) return <div data-scene={scene} className="scene-mount" />;
  return (
    <div data-scene={scene} className="scene-mount scene-mount--dev" aria-hidden="true">
      scene · {scene}
    </div>
  );
}

export function Timeline() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const thread = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    if (!motionOK() || !root.current || !thread.current) return;
    const ctx = gsap.context(() => {
      // The gold thread draws as the guest walks the day. A faint static
      // line beneath it keeps the rail visible without JS.
      register(
        gsap.from(thread.current, {
          strokeDashoffset: 1,
          strokeDasharray: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        }),
      );
      for (const li of gsap.utils.toArray<HTMLElement>(".moment")) {
        riseIn(li.children, li);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="section" id="day" aria-labelledby="day-title">
      <div className="col">
        <h2 id="day-title">{t.day.title}</h2>
        <p className="lead">{t.day.lead}</p>

        <div className="timeline">
          <svg className="thread" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 2 100">
            <path d="M1 0 V100" stroke="var(--hairline-soft)" strokeWidth="1.5" />
            <path ref={thread} d="M1 0 V100" stroke="var(--gold)" strokeWidth="1.5" pathLength={1} />
          </svg>

          <ol className="moments">
            {wedding.schedule.map((m) => {
              const copy = t.day.moments[m.key as keyof typeof t.day.moments];
              return (
                <li key={m.id} className="moment">
                  <p className="moment-time tnum">
                    {m.start}
                    {m.end ? <span className="moment-end"> – {m.end}</span> : null}
                  </p>
                  <div className="moment-body">
                    <h3>{copy.title}</h3>
                    <p className="moment-desc">{copy.desc}</p>
                    <a
                      className="moment-place"
                      href={m.mapUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {m.venue} · {t.day.directions} ↗
                    </a>
                    <SceneMount scene={m.scene} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
