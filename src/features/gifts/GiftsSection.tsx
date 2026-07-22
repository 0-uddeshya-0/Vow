import { motion } from "motion/react";
import { ArrowUpRight, Gift as GiftIcon } from "lucide-react";
import { useI18n } from "../../i18n";
import { fadeUp, reveal } from "../../animations/variants";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { Gift } from "../../types";

const linkCls =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-4 " +
  "text-sm text-ink-soft transition-colors hover:border-hairline hover:text-gold-ink";

function GiftCard({ gift }: { gift: Gift }) {
  const { t, lt } = useI18n();
  return (
    <motion.li variants={fadeUp} className="glass overflow-hidden rounded-[var(--radius-card)]">
      {gift.imageUrl ? (
        <img src={gift.imageUrl} alt="" loading="lazy" className="h-40 w-full object-cover" />
      ) : null}
      <div className="p-6">
        <div className="flex items-start gap-3">
          <GiftIcon size={20} className="mt-1 shrink-0 text-gold-ink" aria-hidden />
          <div className="min-w-0">
            <h3 className="font-display text-2xl text-ink">{lt(gift.title)}</h3>
            {gift.description ? (
              <p className="mt-1.5 max-w-[52ch] text-ink-soft">{lt(gift.description)}</p>
            ) : null}
          </div>
        </div>
        {gift.url ? (
          <div className="mt-4">
            <a className={linkCls} href={gift.url} target="_blank" rel="noreferrer noopener">
              {t.gifts.view} <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        ) : null}
      </div>
    </motion.li>
  );
}

export function GiftsSection({ gifts, loading }: { gifts: Gift[] | undefined; loading: boolean }) {
  if (loading || !gifts) return <CardSkeleton />;
  if (gifts.length === 0) return null;
  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-col gap-4 p-0">
      {gifts.map((g) => (
        <GiftCard key={g.id} gift={g} />
      ))}
    </motion.ul>
  );
}
