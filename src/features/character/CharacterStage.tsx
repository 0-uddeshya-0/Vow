import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ANIM_OFF } from "../../animations/motionSafe";

/**
 * The couple's illustration, presented as a framed card that quietly breathes.
 *
 * The artwork is a flat PNG (white dress on white ground, no separating
 * outline — every automated cut-out eats the dress), so it is framed rather
 * than floated. Life comes from layered motion on the frame instead of from
 * the pixels: a slow bob, an even slower breath, a periodic light sweep
 * across the glass, and a soft glow behind. Every layer animates only
 * transform/opacity, so it composites on the GPU and stays smooth on a phone.
 * Free, no runtime, no subscription — and fully static under reduced motion.
 */
/** Packaged art, always reachable at one stable path in dev and production. */
const DEFAULT_ART = `${import.meta.env.BASE_URL}couple.png`;

/**
 * Self-healing source: a stored "/src/…" path (written into the database by
 * an import run against the dev server) or any URL that fails to load falls
 * back to the packaged illustration, so a bad value in the CMS can never
 * leave the landing page with a broken image.
 */
function usableArt(url: string): string {
  const v = url.trim();
  if (!v || v.startsWith("/src/") || v.startsWith("/@fs/")) return DEFAULT_ART;
  return v;
}

export function CharacterStage({
  illustrationUrl,
  coupleNames,
  className = "",
}: {
  illustrationUrl: string;
  coupleNames: string;
  className?: string;
}) {
  const still = useReducedMotion() || ANIM_OFF;
  const [failed, setFailed] = useState(false);
  const src = failed ? DEFAULT_ART : usableArt(illustrationUrl);

  const initials = coupleNames
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join(" & ");

  const bob = still
    ? {}
    : {
        animate: { y: [0, -9, 0] },
        transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <div className={`relative mx-auto w-fit ${className}`}>
      {/* ambient glow — sits behind, never intercepts taps */}
      {!still && src ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gold/25 blur-2xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <motion.div {...bob}>
        {src ? (
          <div className="relative overflow-hidden rounded-[28px] border border-hairline bg-[oklch(0.995_0.004_95)] p-2.5 shadow-[0_20px_45px_-22px_oklch(0.35_0.04_110/0.55)]">
            <motion.img
              src={src}
              onError={() => setFailed(true)}
              alt={coupleNames}
              width={396}
              height={452}
              className="w-44 rounded-[20px] sm:w-52"
              animate={still ? undefined : { scale: [1, 1.028, 1] }}
              transition={
                still
                  ? undefined
                  : { duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }
            />

            {/* light sweep — the "alive" beat, ~7s apart */}
            {!still ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-12
                           bg-gradient-to-r from-transparent via-white/45 to-transparent"
                animate={{ x: ["0%", "420%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 5.5,
                  ease: "easeInOut",
                }}
              />
            ) : null}
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex size-36 items-center justify-center rounded-full border border-hairline bg-surface/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md sm:size-44"
          >
            <span className="script text-4xl sm:text-5xl">{initials}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
