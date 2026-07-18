import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { pressable } from "../../animations/variants";

const styles = {
  primary: "bg-[var(--btn-primary)] text-on-accent shadow-[0_10px_24px_-10px_var(--btn-primary)]",
  gold: "bg-gold text-on-accent shadow-[0_10px_24px_-10px_var(--gold)]",
  quiet: "border border-hairline bg-surface/40 text-ink backdrop-blur-sm",
  ghost: "text-ink-soft hover:text-ink",
} as const;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  variant?: keyof typeof styles;
  className?: string;
  children: ReactNode;
} & ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      {...pressable}
      className={
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-2.5 " +
        "font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-50 " +
        `disabled:cursor-not-allowed ${styles[variant]} ${className}`
      }
      {...rest}
    >
      {children}
    </motion.button>
  );
}
