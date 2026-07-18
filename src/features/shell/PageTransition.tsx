import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { ANIM_OFF } from "../../animations/motionSafe";
import { easeOut } from "../../animations/variants";

/**
 * Route transitions. With ANIM_OFF (headless verification) AnimatePresence is
 * skipped entirely — exit animations would otherwise wait forever for a
 * rAF tick that never comes and block navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  if (ANIM_OFF) return <main>{children}</main>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
