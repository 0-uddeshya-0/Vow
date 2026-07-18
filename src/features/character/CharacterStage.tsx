import { motion, useReducedMotion } from "motion/react";
import { ANIM_OFF } from "../../animations/motionSafe";

/**
 * The couple's illustration, presented as a framed card.
 *
 * Why framed and not cut out: the art has a white dress on a white ground
 * with no separating outline, so every automated background removal eats the
 * dress. A warm mat + gold hairline reads as a deliberate framed illustration
 * in both themes and keeps the artwork exactly as the couple drew it.
 * Swap-ready: when a transparent PNG / Lottie / Rive file arrives, only this
 * component changes — callers pass a URL either way.
 */
export function CharacterStage({
  illustrationUrl,
  coupleNames,
  className = "",
}: {
  illustrationUrl: string;
  coupleNames: string;
  className?: string;
}) {
  const reduce = useReducedMotion() || ANIM_OFF;
  const float = reduce
    ? {}
    : {
        animate: { y: [0, -10, 0] },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
      };

  const initials = coupleNames
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join(" & ");

  return (
    <motion.div className={`mx-auto w-fit ${className}`} {...float}>
      {illustrationUrl ? (
        <div className="rounded-[28px] border border-hairline bg-[oklch(0.995_0.004_95)] p-2.5 shadow-[0_20px_45px_-22px_oklch(0.35_0.04_110/0.55)]">
          <img
            src={illustrationUrl}
            alt={coupleNames}
            width={396}
            height={452}
            className="w-44 rounded-[20px] sm:w-52"
          />
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
  );
}
