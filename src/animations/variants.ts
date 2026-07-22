import type { Variants, Transition } from "motion/react";
import { ANIM_OFF } from "./motionSafe";

/** Shared easing: gentle expo-out — nothing abrupt. */
export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: easeOut } },
};

/**
 * Props for a staggered section container (children use `fadeUp`/`fadeIn`).
 *
 * Animates on MOUNT, not on scroll. The previous `whileInView` with a 0.25
 * visibility threshold left tall sections stuck at opacity 0: the heading
 * scrolled past before a quarter of the (very tall) section was visible, so
 * it never revealed — the reported "Schedule heading is just empty space".
 * On-mount reveal can never hide content: below-the-fold sections finish
 * their entrance while off-screen and are simply visible when scrolled to.
 * (`_amount` kept for call-site compatibility, intentionally unused.)
 */
export function reveal(_amount = 0) {
  return {
    variants: stagger,
    initial: ANIM_OFF ? false : ("hidden" as const),
    animate: "show" as const,
  };
}

/** Props for a single element entrance. */
export function entrance(delay = 0) {
  return {
    initial: ANIM_OFF ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: easeOut },
  };
}

/** Soft hover/tap for interactive surfaces. */
export const pressable = ANIM_OFF
  ? {}
  : {
      whileHover: { y: -2 },
      whileTap: { scale: 0.97 },
      transition: { type: "spring" as const, stiffness: 400, damping: 25 },
    };
