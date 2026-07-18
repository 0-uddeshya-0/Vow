import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pressable } from "../../animations/variants";

export function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      {...pressable}
      className={
        "min-h-11 rounded-full border px-4 py-2 transition-colors cursor-pointer " +
        (pressed
          ? "border-sage-deep bg-sage-deep text-on-accent"
          : "border-hairline-soft bg-transparent text-ink hover:border-hairline")
      }
    >
      {children}
    </motion.button>
  );
}
