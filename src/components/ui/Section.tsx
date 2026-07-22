import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, reveal } from "../../animations/variants";

export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    // Vertical rhythm comes from the parent's `gap`, not per-section padding,
    // so spacing stays uniform. `scroll-mt-24` keeps hash-nav clear of the
    // fixed top bar.
    <motion.section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24" {...reveal()}>
      <motion.h2
        id={`${id}-title`}
        variants={fadeUp}
        className="font-display text-3xl sm:text-4xl text-ink"
      >
        {title}
      </motion.h2>
      {lead ? (
        <motion.p variants={fadeUp} className="mt-2 max-w-[46ch] text-ink-soft">
          {lead}
        </motion.p>
      ) : null}
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

export function DemoRibbon({ text }: { text: string }) {
  return (
    <p className="mx-auto w-fit rounded-full border border-hairline bg-surface/60 px-4 py-1.5 text-center text-xs tracking-[0.12em] uppercase text-gold-ink backdrop-blur-sm">
      {text}
    </p>
  );
}
