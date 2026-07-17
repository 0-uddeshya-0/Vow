import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { wedding } from "../config/wedding";
import { downloadIcs } from "../lib/ics";
import { gsap, motionOK, register } from "../motion/motion";
import { Sprig } from "./Sprig";

export function Hero() {
  const { lang, t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motionOK() || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".sprig-stroke", {
        strokeDashoffset: 1,
        strokeDasharray: 1,
        duration: 1.1,
        stagger: 0.05,
      })
        .from(".sprig-bud", { scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.06 }, "-=0.4")
        .from(".hero-mark", { autoAlpha: 0, y: 10, duration: 0.7 }, "-=0.5")
        .from(".hero-name, .hero-amp", { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.12 }, "-=0.35")
        .from(".hero-meta > *", { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 }, "-=0.4");
      register(tl);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero-frame" aria-hidden="true" />
      <Sprig className="hero-sprig hero-sprig--tl" />
      <Sprig className="hero-sprig hero-sprig--br" flip />

      <div className="hero-inner col">
        <p className="hero-mark">
          <span className="script hero-mark-script">{wedding.mark}</span>
          <span className="smallcaps">{t.hero.markSub}</span>
        </p>

        <h1 className="hero-names" aria-label={`${wedding.couple.one} & ${wedding.couple.two}`}>
          <span className="hero-name">{wedding.couple.one}</span>
          <span className="hero-amp script" aria-hidden="true">
            &amp;
          </span>
          <span className="hero-name">{wedding.couple.two}</span>
        </h1>

        <div className="hero-meta">
          <p className="hero-date">
            <span className="tnum">{t.hero.dateLine}</span>
            <br />
            <span className="tnum hero-place">{t.hero.timeLine}</span>
          </p>
          <p className="hero-intro">{t.hero.intro}</p>
          <div className="hero-ctas">
            <a className="btn btn--primary" href="#rsvp">
              {t.hero.cta}
            </a>
            <button className="btn btn--quiet" onClick={() => downloadIcs(lang)}>
              {t.hero.calendar}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
