import confetti from "canvas-confetti";

/** Gold-led, sage-accented burst — elegant, not carnival. */
const BRAND = ["#BB9254", "#D9BE86", "#6F8159", "#8A9A6E", "#F7F3EA"];

export function celebrateRsvp(originEl?: HTMLElement | null): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const r = originEl?.getBoundingClientRect();
  const origin = r
    ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.7 };

  const fire = (ratio: number, opts: confetti.Options) =>
    void confetti({
      origin,
      colors: BRAND,
      particleCount: Math.floor(160 * ratio),
      disableForReducedMotion: true,
      ...opts,
    });

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
