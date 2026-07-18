import { motion, useReducedMotion } from "motion/react";
import { ANIM_OFF } from "../../animations/motionSafe";

/**
 * The floating couple illustration slot. Renders the event's real art
 * (heroIllustrationUrl — the couple's Canva illustrations, added via the CMS)
 * inside a gentle idle float. Until the art is uploaded it shows an elegant
 * monogram medallion — deliberately NOT generic stand-in people.
 *
 * Rig-ready: when the art arrives as layered SVG (named groups per limb/eyes),
 * this component is where blink/wave loops attach. Lottie/Rive can slot in
 * behind the same props without touching callers.
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
        animate: { y: [0, -12, 0] },
        transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const },
      };

  const initials = coupleNames
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join(" & ");

  return (
    <motion.div className={`pointer-events-none select-none ${className}`} {...float} aria-hidden="true">
      {illustrationUrl ? (
        <img
          src={illustrationUrl}
          alt=""
          className="mx-auto max-h-56 w-auto drop-shadow-[0_18px_30px_rgba(70,60,30,0.25)]"
        />
      ) : (
        <div className="mx-auto flex size-36 items-center justify-center rounded-full border border-hairline bg-surface/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md sm:size-44">
          <span className="script text-4xl sm:text-5xl">{initials}</span>
        </div>
      )}
    </motion.div>
  );
}
