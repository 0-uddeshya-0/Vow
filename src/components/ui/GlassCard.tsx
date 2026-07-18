import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

/**
 * The signature surface. Always render over a `wash-garden` (or image) —
 * glass over flat ivory reads as grey plastic; the wash is what the blur
 * and saturate(1.8) feed on.
 */
export function GlassCard({
  children,
  strong = false,
  className = "",
  ...rest
}: { children: ReactNode; strong?: boolean; className?: string } & ComponentProps<
  typeof motion.div
>) {
  return (
    <motion.div
      className={`${strong ? "glass-strong" : "glass"} rounded-[var(--radius-panel)] ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
