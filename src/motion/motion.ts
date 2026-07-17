import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const motionOK = (): boolean =>
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Every entrance animation registers here so it can be force-completed.
 * Two consumers: reduced-motion users never see hidden content (we simply
 * skip creating tweens), and headless/preview environments where rAF never
 * fires can call `revealAll()` so screenshots show the settled page.
 */
const registry: gsap.core.Animation[] = [];

export function register<T extends gsap.core.Animation>(anim: T): T {
  registry.push(anim);
  return anim;
}

export function revealAll(): void {
  for (const a of registry) a.progress(1);
  for (const st of ScrollTrigger.getAll()) st.animation?.progress(1);
}

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__vowRevealAll = revealAll;
}

/**
 * Soft rise for a section's children. Content is authored visible; if motion
 * is not OK we never hide anything (the skill rule: reveals enhance an
 * already-visible default, they don't gate visibility).
 */
export function riseIn(targets: gsap.TweenTarget, trigger: Element, delay = 0): void {
  if (!motionOK()) return;
  register(
    gsap.from(targets, {
      autoAlpha: 0,
      y: 14,
      duration: 0.75,
      delay,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger, start: "top 86%", once: true },
    }),
  );
}

export { gsap, ScrollTrigger };
